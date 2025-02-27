package chat

import (
	"database/sql"
	"fmt"
	"golang.org/x/net/websocket"
	"io"
	"log"
	"sync"
)

const channelBufSize = 100

var maxId int = 0
var clientMutex sync.Mutex // Mutex для безопасной работы с maxId

// Chat client.
type Client struct {
	id     int             // Уникальный идентификатор клиента
	ws     *websocket.Conn // Websocket соединение
	server *Server         // Ссылка на сервер
	ch     chan *Message   // Канал для отправки сообщений клиенту
	doneCh chan bool       // Канал для сигнала о завершении работы клиента
	room   string          // Идентификатор комнаты чата, к которой принадлежит клиент
}

// Create new chat client.
func NewClient(ws *websocket.Conn, server *Server, room string) *Client {
	if ws == nil {
		panic("ws cannot be nil") // Паника, если websocket соединение не передано
	}

	if server == nil {
		panic("server cannot be nil") // Паника, если сервер не передан
	}

	clientMutex.Lock() // Блокируем мьютекс перед изменением maxId
	maxId++
	id := maxId          // Получаем уникальный ID для клиента
	clientMutex.Unlock() // Разблокируем мьютекс

	ch := make(chan *Message, channelBufSize) // Создаем канал для сообщений
	doneCh := make(chan bool)                 // Создаем канал для сигнала завершения

	return &Client{id, ws, server, ch, doneCh, room} // Возвращаем нового клиента
}

func (c *Client) Conn() *websocket.Conn {
	return c.ws // Возвращает websocket соединение клиента
}

// Write отправляет сообщение клиенту через канал.
// Если канал заполнен, отключает клиента и сообщает об ошибке.
func (c *Client) Write(msg *Message) {
	select {
	case c.ch <- msg: // Пытаемся отправить сообщение в канал клиента
	default:
		c.server.Del(c)                                       // Если канал заполнен, удаляем клиента с сервера
		err := fmt.Errorf("client %d is disconnected.", c.id) // Создаем сообщение об ошибке
		c.server.Err(err)                                     // Отправляем сообщение об ошибке на сервер
	}
}

// Done сигнализирует о завершении работы клиента.
func (c *Client) Done() {
	c.doneCh <- true // Отправляем сигнал в канал завершения
}

// Listen запускает горутины для чтения и записи сообщений.
func (c *Client) Listen() {
	go c.listenWrite() // Запускаем горутину для записи сообщений
	c.listenRead()     // Запускаем горутину для чтения сообщений
}

// listenWrite слушает канал записи и отправляет сообщения клиенту через websocket.
func (c *Client) listenWrite() {
	log.Println("Listening write to client")
	for {
		select {

		// Получаем сообщение из канала и отправляем его клиенту
		case msg := <-c.ch:
			log.Println("Send:", msg)
			websocket.JSON.Send(c.ws, msg) // Отправляем сообщение клиенту

		// Получаем сигнал завершения работы
		case <-c.doneCh:
			c.server.Del(c)  // Удаляем клиента с сервера
			c.doneCh <- true // Отправляем сигнал в канал listenRead
			return           // Завершаем работу горутины
		}
	}
}

// listenRead слушает websocket соединение и отправляет полученные сообщения на сервер.
func (c *Client) listenRead() {
	log.Println("Listening read from client")
	for {
		select {

		// Получаем сигнал завершения работы
		case <-c.doneCh:
			c.server.Del(c)  // Удаляем клиента с сервера
			c.doneCh <- true // Отправляем сигнал в канал listenWrite
			return           // Завершаем работу горутины

		// Читаем данные из websocket соединения
		default:
			var msg Message                           // Создаем переменную для сообщения
			err := websocket.JSON.Receive(c.ws, &msg) // Получаем сообщение из websocket
			if err == io.EOF {                        // Если соединение закрыто
				c.doneCh <- true // Отправляем сигнал завершения
			} else if err != nil { // Если произошла ошибка
				c.server.Err(err) // Отправляем сообщение об ошибке на сервер
			} else { // Если сообщение получено успешно
				msg.Room = c.room      // Устанавливаем комнату для сообщения
				c.server.SendAll(&msg) // Отправляем сообщение всем клиентам в комнате
			}
		}
	}
}

// Функция для создания таблиц в базе данных (если их нет)
func CreateTables(db *sql.DB) {
	createMessagesTable := `
	CREATE TABLE IF NOT EXISTS messages (
		id SERIAL PRIMARY KEY,
		author TEXT NOT NULL,
		body TEXT NOT NULL,
		room TEXT NOT NULL,
		timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc')
	);
	`
	_, err := db.Exec(createMessagesTable)
	if err != nil {
		log.Fatalf("Failed to create messages table: %v", err)
	}
	log.Println("Messages table created (or already exists)")
}

// Функция для сохранения сообщения в базе данных
func (s *Server) saveMessage(msg *Message) error {
	query := `
	INSERT INTO messages (author, body, room)
	VALUES ($1, $2, $3);
	`
	_, err := s.db.Exec(query, msg.Author, msg.Body, msg.Room)
	if err != nil {
		log.Printf("Failed to save message to database: %v", err)
		return err
	}
	return nil
}

// Функция для получения истории сообщений из базы данных
func (s *Server) getPastMessages(room string) ([]*Message, error) {
	query := `
	SELECT author, body FROM messages
	WHERE room = $1
	ORDER BY timestamp ASC;
	`
	rows, err := s.db.Query(query, room)
	if err != nil {
		log.Printf("Failed to query messages from database: %v", err)
		return nil, err
	}
	defer rows.Close()

	var messages []*Message
	for rows.Next() {
		var msg Message
		err := rows.Scan(&msg.Author, &msg.Body)
		if err != nil {
			log.Printf("Failed to scan message from database: %v", err)
			return nil, err
		}
		msg.Room = room // Устанавливаем комнату для сообщения
		messages = append(messages, &msg)
	}

	return messages, nil
}
