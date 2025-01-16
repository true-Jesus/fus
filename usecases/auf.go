package usecases

import (
	_ "database/sql"
	"fmt"
	"fus/repo"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"time"
	_ "time"

	//"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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

// Структура для данных пользователя

// Секретный ключ для подписи JWT
var mySigningKey = []byte("adolfGitler") // Используйте более надежную секретную фразу

// Функция для генерации хеша пароля
func generatePasswordHash(password string) (string, error) {
	hasher, err := bcrypt.GenerateFromPassword([]byte(password), 2)
	if err != nil {
		return "", fmt.Errorf("generatePasswordHash err 1:", err)
	}
	return string(hasher), nil
}

// Функция для генерации JWT-токена
func generateJWT(user *User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    "fus",                                 // Имя приложения
		IssuedAt:  time.Now().Unix(),                     // Время выдачи
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // Время истечения// TODO: ПРОВЕРИТЬ УДАЛЕНИЯ ПО ВРЕМЕНИ
		Subject:   user.Username,                         // Имя пользователя
	})

	tokenString, err := token.SignedString(mySigningKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Функция для обработки запроса на регистрацию

// Middleware для проверки аутентификаци

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Получаем токен из заголовка Authorization
		cookies := r.Cookies()

		// Извлекаем значения hashed_ip и authToken
		hashedIP := ""
		tokenString := ""
		for _, cookie := range cookies {
			if cookie.Name == "hashed_ip" {
				hashedIP = cookie.Value
			}
			if cookie.Name == "authToken" {
				tokenString = cookie.Value
			}
		}
		if tokenString == "" {
			http.Redirect(w, r, "/auf", http.StatusFound)
			return
		}

		// Проверяем токен
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Неверный метод подписи")
			}
			return mySigningKey, nil
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		if !token.Valid {
			http.Error(w, "Неверный токен", http.StatusUnauthorized)
			return
		}
		ipAddress := r.RemoteAddr
		err = bcrypt.CompareHashAndPassword([]byte(hashedIP), []byte(ipAddress))
		if err != nil {
			http.Redirect(w, r, "/auf", http.StatusFound)
		}
		// Доступ разрешен
		next.ServeHTTP(w, r)
	})
}
func (a *AufUseCase) Registr(username string, pswd string) error {

	exists, err := a.repo.UserExists(username)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Пользователь с таким именем существует")
	}
	pswdHash, err := generatePasswordHash(pswd)
	if err != nil {
		return err
	}
	err = a.repo.AddUser(username, pswdHash)
	if err != nil {
		return err
	}
	return nil
}

func (a *AufUseCase) Login(user *User) (string, error) {
	passwordHash, err := a.repo.GetUserHash(user.Username)
	if err != nil {
		return "", err
	}

	// Сверяем хеш пароля с введенным пользователем
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(user.Password))
	if err != nil {
		return "", err
	}

	// Генерируем JWT
	token, err := generateJWT(user)
	if err != nil {
		return "", err
	}
	return token, nil
}
