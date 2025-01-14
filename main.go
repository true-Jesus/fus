package main

import (
	"fmt"
	"fus/repo"
	"fus/server"
	"log"
)

//ааааааа
func main() {

	db, err := repo.ConnectToDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	err = server.RunServer(db)
	if err != nil {
		fmt.Println(err)
	}

}
