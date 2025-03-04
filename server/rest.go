package server

import (
	"database/sql"
	"fmt"
	"fus/repo"
	"fus/usecases"
	"net/http"
)

func RunFusServer(db *sql.DB) error {
	fmt.Println("zbc")
	//create repos
	repoSql := repo.NewRepo(db)
	//create usecases

	aufUc := usecases.NewAufUseCase(repoSql)
	proUc := usecases.NewProUseCase(repoSql)
	anketUc := usecases.NewAnketsUC(repoSql)
	chatUc := usecases.NewChatUseCase(repoSql)
	useCases := NewUseCases(aufUc, proUc, anketUc, chatUc)
	//create handlers
	h := NewHandlers(useCases)

	srv := &http.Server{Addr: fmt.Sprintf(":%d", 8080), Handler: NewRouter(h)}
	if err := srv.ListenAndServe(); err != nil {
		return fmt.Errorf("server.Run #2: %s \n", err)
	}

	return nil
}
