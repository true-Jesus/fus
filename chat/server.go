package chat

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"sync"

	"golang.org/x/net/websocket"
)

// Chat server.
type Server struct {
	pattern   string                     // Паттерн URL, по которому будет доступен websocket
	messages  map[string][]*Message      // Сообщения для каждой комнаты (ключ - room)
	clients   map[string]map[int]*Client // Клиенты, подключенные к каждой комнате (ключ - room)
	addCh     chan *Client               // Канал для добавления новых клиентов
	delCh     chan *Client               // Канал для удаления клиентов
	sendAllCh chan *Message              // Канал для отправки сообщений всем клиентам в комнате
	doneCh    chan bool                  // Канал для сигнала завершения работы сервера
	errCh     chan error                 // Канал для ошибок
	mutex     sync.RWMutex               // Mutex для безопасной работы с maps
	db        *sql.DB                    // Подключение к базе данных
}

// NewServer создает новый чат-сервер.
func NewServer(pattern string, db *sql.DB) *Server {
	messages := make(map[string][]*Message)     // Инициализируем map для сообщений по комнатам
	clients := make(map[string]map[int]*Client) // Инициализируем map для клиентов по комнатам
	addCh := make(chan *Client)                 // Инициализируем канал для добавления клиентов
	delCh := make(chan *Client)                 // Инициализируем канал для удаления клиентов
	sendAllCh := make(chan *Message)            // Инициализируем канал для отправки сообщений
	doneCh := make(chan bool)                   // Инициализируем канал для завершения работы
	errCh := make(chan error)                   // Инициализируем канал для ошибок

	return &Server{
		pattern,
		messages,
		clients,
		addCh,
		delCh,
		sendAllCh,
		doneCh,
		errCh,
		sync.RWMutex{}, // Инициализация mutex
		db,             // Подключение к базе данных
	}
}

// Add добавляет нового клиента в сервер.
func (s *Server) Add(c *Client) {
	s.addCh <- c // Отправляем клиента в канал добавления
}

// Del удаляет клиента с сервера.
func (s *Server) Del(c *Client) {
	s.delCh <- c // Отправляем клиента в канал удаления
}

// SendAll отправляет сообщение всем клиентам в комнате.
func (s *Server) SendAll(msg *Message) {
	s.sendAllCh <- msg // Отправляем сообщение в канал отправки
}

// Done сигнализирует о завершении работы сервера.
func (s *Server) Done() {
	s.doneCh <- true // Отправляем сигнал завершения
}

// Err отправляет сообщение об ошибке.
func (s *Server) Err(err error) {
	s.errCh <- err // Отправляем ошибку в канал ошибок
}

// sendPastMessages отправляет клиенту историю сообщений из указанной комнаты.
func (s *Server) sendPastMessages(c *Client) {
	// Получаем историю сообщений из базы данных
	pastMessages, err := s.getPastMessages(c.room)
	if err != nil {
		log.Printf("Failed to get past messages: %v", err)
		return
	}

	// Отправляем историю сообщений клиенту
	for _, msg := range pastMessages {
		c.Write(msg)
	}
}

// sendAll отправляет сообщение всем клиентам в указанной комнате.
func (s *Server) sendAll(msg *Message) {
	s.mutex.RLock()         // Блокируем для чтения
	defer s.mutex.RUnlock() // Разблокируем после завершения

	if clients, ok := s.clients[msg.Room]; ok { // Проверяем, есть ли клиенты в этой комнате
		for _, c := range clients { // Перебираем клиентов
			c.Write(msg) // Отправляем сообщение клиенту
		}
	}
}

// Listen запускает сервер и обрабатывает подключения клиентов и сообщения.
func (s *Server) Listen() {
	log.Println("Listening server...")

	// websocket handler
	onConnected := func(ws *websocket.Conn) {
		// Get room from URL
		room := ws.Request().URL.Query().Get("room")
		if room == "" {
			log.Println("Room is required")
			ws.Close()
			return
		}

		defer func() {
			err := ws.Close()
			if err != nil {
				s.errCh <- err
			}
		}()

		client := NewClient(ws, s, room) // Создаем нового клиента, передавая room
		s.Add(client)                    // Добавляем клиента на сервер
		client.Listen()                  // Запускаем прослушивание клиента
	}
	http.Handle(s.pattern, websocket.Handler(onConnected)) // Регистрируем обработчик websocket
	log.Println("Created handler")

	for {
		fmt.Println("alive")
		select {

		// Add new a client
		case c := <-s.addCh:
			log.Println("Added new client to room:", c.room)

			s.mutex.Lock()                       // Блокируем для записи
			if _, ok := s.clients[c.room]; !ok { // Если комната еще не существует
				s.clients[c.room] = make(map[int]*Client) // Создаем map для клиентов в этой комнате
			}
			s.clients[c.room][c.id] = c // Добавляем клиента в map по ID
			s.mutex.Unlock()            // Разблокируем

			log.Println("Now", len(s.clients[c.room]), "clients connected to room", c.room)
			s.sendPastMessages(c) // Отправляем историю сообщений клиенту

		// del a client
		case c := <-s.delCh:
			log.Println("Delete client from room:", c.room)

			s.mutex.Lock()                      // Блокируем для записи
			if _, ok := s.clients[c.room]; ok { // Если комната существует
				delete(s.clients[c.room], c.id)  // Удаляем клиента из map
				if len(s.clients[c.room]) == 0 { // Если в комнате больше нет клиентов
					delete(s.clients, c.room) // Удаляем комнату
					log.Println("Room", c.room, "is empty, deleting.")
				}
			}
			s.mutex.Unlock() // Разблокируем

		// broadcast message for all clients
		case msg := <-s.sendAllCh:
			log.Println("Send all to room", msg.Room, ":", msg)

			// Сохраняем сообщение в базе данных
			err := s.saveMessage(msg)
			if err != nil {
				log.Printf("Failed to save message: %v", err)
			}

			s.sendAll(msg) // Отправляем сообщение всем клиентам в комнате

		case err := <-s.errCh:
			log.Println("Error:", err.Error()) // Логируем ошибку

		case <-s.doneCh:
			return // Завершаем работу сервера
		}
	}
}
