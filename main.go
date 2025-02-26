package main

import (
	"database/sql"
	"fus/repo"
	"fus/server"
	"log"
	"net/http"
	"os"

	"fus/chat"
	_ "fus/chat"

	_ "github.com/lib/pq" // Импортируем драйвер PostgreSQL
)

// TODO:FUS-3 ааааааа
// aa
func main() {
	log.SetFlags(log.Lshortfile)

	// Подключение к базе данных PostgreSQL для чата
	dbURL := os.Getenv("DATABASE_URL") // Получаем URL базы данных из переменной окружения

	if dbURL == "" {
		dbURL = "host=localhost user=admin password=1233 dbname=chat port=5432 sslmode=disable"
	}

	dbChat, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to chat database: %v", err)
	}
	defer dbChat.Close()

	// Проверка соединения с базой данных для чата
	err = dbChat.Ping()
	if err != nil {
		log.Fatalf("Failed to ping chat database: %v", err)
	}
	log.Println("Connected to PostgreSQL chat database")

	// Создание таблиц для чата (если их еще нет)
	chat.CreateTables(dbChat)

	// websocket server
	chatServer := chat.NewServer("/entry", dbChat) // Передаем соединение с БД в конструктор сервера
	go chatServer.Listen()                         // Запускаем сервер в отдельной горутине

	// Подключение к базе данных PostgreSQL для fus
	dbFus, err := repo.ConnectToDB()
	if err != nil {
		log.Fatalf("Failed to connect to fus: %v", err)
	}
	defer dbFus.Close()

	// Проверка соединения с базой данных для fus
	err = dbFus.Ping()
	if err != nil {
		log.Fatalf("Failed to ping fus database: %v", err)
	}
	log.Println("Connected to PostgreSQL fus database")

	// Запуск fus
	go server.RunFusServer(dbFus)

	// static files
	http.Handle("/", http.FileServer(http.Dir("webroot"))) // Обслуживаем статические файлы из директории "webroot"

	log.Fatal(http.ListenAndServe(":8081", nil)) // Запускаем HTTP-сервер на порту 8080 и обрабатываем ошибки
}
