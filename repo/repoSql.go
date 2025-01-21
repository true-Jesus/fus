package repo

import (
	"database/sql"
	"fmt"
	"github.com/lib/pq"
	"strconv"
)

type Repo struct {
	db *sql.DB
}
type Subject struct {
	Name string
}
type Class struct {
	Name string
}

func NewRepo(db *sql.DB) *Repo {
	return &Repo{db: db}
}
func (r *Repo) UserExists(username string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(`SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)`, username).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("Ошибка проверки существования пользователя: %w", err)
	}
	return exists, nil
}
func (r *Repo) AddUser(user string, pswd string) error {
	fmt.Println("oj")
	_, err := r.db.Exec(`INSERT INTO users (username, password_hash) VALUES ($1, $2)`, user, pswd)
	if err != nil {
		return fmt.Errorf("Ошибка добавления пользователя: %w", err)
	}
	return nil
}
func (r *Repo) GetUserHash(username string) (string, error) {
	var passwordHash string
	err := r.db.QueryRow(`SELECT password_hash FROM users WHERE username = $1`, username).Scan(&passwordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("Пользователь не найден: %w", err)
		}
		return "", fmt.Errorf("Ошибка получения хеша: %w", err)
	}
	return passwordHash, nil
}
func (r *Repo) SetProfileSettings(username, nickname, strAge, gender, zodiac, city, work, study, description, newFilename string, interests []string) error {
	age, err := strconv.Atoi(strAge)
	photoPath := "uploads/" + newFilename
	fmt.Print(photoPath)
	if err != nil {
		return fmt.Errorf("SetProfileSettings, 1")
	}
	query := `
  INSERT INTO profil (username, nickname, age, gender, zodiac, city, place_of_work, place_of_study, description, interests, photoPath) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  ON CONFLICT (username) DO UPDATE SET
   nickname = $2,
   age = $3,
   gender = $4,
   zodiac = $5,
   city = $6,
   place_of_work = $7,
   place_of_study = $8,
   description = $9,
   interests = $10,
	photoPath = $11
 `

	_, err = r.db.Exec(query, username, nickname, age, gender, zodiac, city, work, study, description, pq.Array(interests), photoPath)
	if err != nil {
		return fmt.Errorf("ошибка при выполнении запроса: %w", err)
	}

	return nil
}

type ProfileData struct {
	Username     string         `json:"username"`
	Nickname     string         `json:"nickname"`
	Age          int            `json:"age"`
	City         string         `json:"city"`
	PlaceOfStudy string         `json:"place_of_study"`
	PlaceOfWork  string         `json:"place_of_work"`
	Gender       string         `json:"gender"`
	Zodiac       string         `json:"zodiac"`
	Description  string         `json:"description"`
	Interests    pq.StringArray `json:"interests"`
	Photopath    string         `json:"photopath"`
}

func (r *Repo) GetProfileData(username string) (*ProfileData, error) {
	var profil ProfileData
	var interests pq.StringArray // создаем переменную для получения данных из бд
	query := "SELECT username, nickname, age, city, place_of_study, place_of_work, gender, zodiac, description, interests, photopath FROM profil WHERE username = $1"

	row := r.db.QueryRow(query, username)
	err := row.Scan(
		&profil.Username,
		&profil.Nickname,
		&profil.Age,
		&profil.City,
		&profil.PlaceOfStudy,
		&profil.PlaceOfWork,
		&profil.Gender,
		&profil.Zodiac,
		&profil.Description,
		&interests, // Записываем массив в interests типа pq.StringArray
		&profil.Photopath,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return &ProfileData{}, fmt.Errorf("user with username %s not found", username)
		}
		return &ProfileData{}, fmt.Errorf("error getting user: %w", err)
	}
	profil.Interests = interests // присваиваем значения полю структуры, тип pq.StringArray автоматически преобразуется в []string
	return &profil, nil
}
