package repo

import (
	"database/sql"
	"fmt"
)

func ConnectToDB() (*sql.DB, error) {
	connStr := "host=localhost port=5432 user=admin password=1233 dbname=fus sslmode=disable" // Замените на ваши настройки подключения
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("Ошибка подключения к базе данных: %w", err)
	}
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("Ошибка проверки соединения: %w", err)
	}
	return db, nil
}
