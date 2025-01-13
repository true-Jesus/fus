package usecases

import (
	//"fmt"
	"fus/repo"
	//"github.com/dgrijalva/jwt-go"
	//"net/http"
	//"time"
	_ "time"

	//"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	//"golang.org/x/crypto/bcrypt"
)

type User struct {
	Username string `json:"Username"`
	Password string `json:"Password"`
}
type AufUseCase struct {
	repo *repo.Repo
}

func NewAufUseCase(repo *repo.Repo) *AufUseCase {
	return &AufUseCase{repo: repo}
}
