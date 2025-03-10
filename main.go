package main

import (
	"fus/repo"
	"fus/server"
	"log"
	"net/http"

	"fus/chat"
	_ "fus/chat"

	_ "github.com/lib/pq" // Импортируем драйвер PostgreSQL
)

func main() {
	log.SetFlags(log.Lshortfile)
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

	// Создание таблиц для чата (если их еще нет)
	chat.CreateTables(dbFus)

	// websocket server
	chatServer := chat.NewServer("/entry", dbFus) // Передаем соединение с БД в конструктор сервера
	go chatServer.Listen()                        // Запускаем сервер в отдельной горутине

	// Запуск fus
	go server.RunFusServer(dbFus)

	// static files
	http.Handle("/", http.FileServer(http.Dir("webroot"))) // Обслуживаем статические файлы из директории "webroot"

	log.Fatal(http.ListenAndServe(":8081", nil)) // Запускаем HTTP-сервер на порту 8080 и обрабатываем ошибки
}
