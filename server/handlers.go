package server

import (
	"encoding/json"
	"fmt"
	"fus/usecases"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
)

type Routes []Route

type UseCases struct {
	aufUC *usecases.AufUseCase
	proUC *usecases.ProfileUseCase
}

func NewUseCases(aufUC *usecases.AufUseCase, proUC *usecases.ProfileUseCase) *UseCases {
	return &UseCases{aufUC: aufUC, proUC: proUC}
}

type Handlers struct {
	useCases *UseCases
}

func NewHandlers(cases *UseCases) *Handlers {
	h := &Handlers{cases}
	return h
}

type Route struct {
	Name          string
	Method        string
	Pattern       string
	HandlerFunc   http.HandlerFunc
	MiddlewareAuf func(handler http.Handler) http.Handler
}

func NewRouter(h *Handlers) *mux.Router {
	var (
		routes = Routes{
			Route{Name: "HomePage", Method: http.MethodGet, Pattern: "/", HandlerFunc: h.Homepage},
			Route{Name: "LoginPage", Method: http.MethodGet, Pattern: "/logPg", HandlerFunc: h.LoginPage},
			Route{Name: "RegistrPage", Method: http.MethodGet, Pattern: "/regPg", HandlerFunc: h.RegisterPage},
			Route{Name: "Login", Method: http.MethodPost, Pattern: "/log", HandlerFunc: h.HandleLogin},
			Route{Name: "Register", Method: http.MethodPost, Pattern: "/reg", HandlerFunc: h.HandleRegistration},
			Route{Name: "RegistrPage", Method: http.MethodGet, Pattern: "/profil", HandlerFunc: h.ProfilePage}, //, MiddlewareAuf: usecases.AuthMiddleware
			Route{Name: "RegistrPage", Method: http.MethodGet, Pattern: "/profilSettings", HandlerFunc: h.ProfilSettings},
			Route{Name: "saveSettings", Method: http.MethodPost, Pattern: "/saveSettings", HandlerFunc: h.SaveSettings},
		}
	)
	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {

		if route.MiddlewareAuf != nil {
			router.
				Methods(route.Method).
				Path(route.Pattern).
				Name(route.Name).
				Handler(route.MiddlewareAuf(route.HandlerFunc))
		} else {
			router.
				Methods(route.Method).
				Path(route.Pattern).
				Name(route.Name).
				Handler(route.HandlerFunc)
		}

	}
	imagePath := filepath.Join(".", "image")
	router.PathPrefix("/image/").Handler(http.StripPrefix("/image/", http.FileServer(http.Dir(imagePath))))

	// Обслуживаем статические файлы из директории "templates"
	templatesPath := filepath.Join(".", "templates")
	router.PathPrefix("/templates/").Handler(http.StripPrefix("/templates/", http.FileServer(http.Dir(templatesPath))))
	return router
}
func (h *Handlers) Homepage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/home/home.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}

func (h *Handlers) LoginPage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/login/login.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}
func (h *Handlers) ProfilePage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/profil/profil.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}
func (h *Handlers) RegisterPage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/register/register.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}
func (h *Handlers) ProfilPage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/profil/profil.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}
func (h *Handlers) ProfilSettings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/profilSettings/profilSettings.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}
func (h *Handlers) HandleRegistration(w http.ResponseWriter, r *http.Request) {
	// Читаем тело запроса
	fmt.Print("a")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Декодируем JSON
	var user usecases.User
	err = json.Unmarshal(body, &user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = h.useCases.aufUC.Registr(user.Username, user.Password)
	if err != nil {
		fmt.Println("ошибка при регистрации", err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	fmt.Fprintf(w, "Регистрация успешна!")

}

func (h *Handlers) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var user usecases.User
	body, err := ioutil.ReadAll(r.Body)
	err = json.Unmarshal(body, &user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	token, err := h.useCases.aufUC.Login(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	ipAddress := r.RemoteAddr
	hashedIP, err := bcrypt.GenerateFromPassword([]byte(ipAddress), 2)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	// Создаем куку с хешированным IP-адресом
	cookie := http.Cookie{
		Name:   "hashed_ip",
		Value:  string(hashedIP),
		Path:   "/",
		MaxAge: 365 * 24 * 60 * 60, // 1 год
	}

	http.SetCookie(w, &cookie)
	fmt.Fprintf(w, token)
}
func (h *Handlers) SaveSettings(w http.ResponseWriter, r *http.Request) {
	var Data struct {
		// photo todo узнать в каком формате принимать
		Username    string   `json:"user"`
		Name        string   `json:"name"`
		Age         string   `json:"age"`
		Gender      string   `json:"gender"`
		Zodiac      string   `json:"zodiac"`
		City        string   `json:"city"`
		Work        string   `json:"work"`
		Study       string   `json:"study"`
		Description string   `json:"description"`
		Interests   []string `json:"interests"`
	}
	// Декодируем JSON из тела запроса в структуру gradeData
	fmt.Print(r.Body)
	err := json.NewDecoder(r.Body).Decode(&Data)
	if err != nil {
		fmt.Println(err, "SaveSettings 1")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("Полученные данные:", Data)
	err = h.useCases.proUC.SetProfileSettings(Data.Username, Data.Name, Data.Age, Data.Gender, Data.Zodiac, Data.City, Data.Work, Data.Study, Data.Description, Data.Interests)
	if err != nil {
		fmt.Println(err, "SaveSettings 2")
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)

}
