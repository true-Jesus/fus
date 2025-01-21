package server

import (
	"encoding/json"
	"fmt"
	"fus/usecases"
	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
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
			Route{Name: "getProfil", Method: http.MethodGet, Pattern: "/getProfilePhoto", HandlerFunc: h.handleGetProfilePhoto},
			Route{Name: "getProfil", Method: http.MethodGet, Pattern: "/getProfile", HandlerFunc: h.handleGetProfile},
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

//	func (h *Handlers) SaveSettings(w http.ResponseWriter, r *http.Request) {
//		var Data struct {
//			// photo todo узнать в каком формате принимать
//			Username    string   `json:"user"`
//			Name        string   `json:"name"`
//			Age         string   `json:"age"`
//			Gender      string   `json:"gender"`
//			Zodiac      string   `json:"zodiac"`
//			City        string   `json:"city"`
//			Work        string   `json:"work"`
//			Study       string   `json:"study"`
//			Description string   `json:"description"`
//			Interests   []string `json:"interests"`
//		}
//		// Декодируем JSON из тела запроса в структуру gradeData
//		fmt.Print(r.Body)
//		err := json.NewDecoder(r.Body).Decode(&Data)
//		if err != nil {
//			fmt.Println(err, "SaveSettings 1")
//			http.Error(w, err.Error(), http.StatusBadRequest)
//			return
//		}
//		fmt.Println("Полученные данные:", Data)
//		err = h.useCases.proUC.SetProfileSettings(Data.Username, Data.Name, Data.Age, Data.Gender, Data.Zodiac, Data.City, Data.Work, Data.Study, Data.Description, Data.Interests)
//		if err != nil {
//			fmt.Println(err, "SaveSettings 2")
//			http.Error(w, err.Error(), http.StatusInternalServerError)
//		}
//		w.WriteHeader(http.StatusOK)
//
// }
func (h *Handlers) SaveSettings(w http.ResponseWriter, r *http.Request) {
	fname := ""
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	err := r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("photo")
	if err != nil && err != http.ErrMissingFile {
		fmt.Println(err)
		http.Error(w, "Error retrieving photo", http.StatusBadRequest)
		return
	}
	// Получаем имя пользователя из запроса
	username := r.FormValue("user")
	// Сохраняем файл, если он был отправлен
	if file != nil {
		defer file.Close()

		// Генерируем имя файла с использованием имени пользователя
		fileExt := filepath.Ext(header.Filename)
		newFilename := fmt.Sprintf("photo%s%s", username, fileExt)
		fname = newFilename
		tempFile, err := os.CreateTemp("uploads", "image-*"+fileExt)
		if err != nil {
			log.Printf("error creating temp file : %v", err)
			http.Error(w, "Error create temp file", http.StatusInternalServerError)
			return
		}
		defer tempFile.Close()

		_, err = io.Copy(tempFile, file)
		if err != nil {
			log.Printf("error saving file : %v", err)
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		err = os.Rename(tempFile.Name(), "uploads/"+newFilename)
		if err != nil {
			log.Printf("error rename file : %v", err)
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		fmt.Println("Photo uploaded successfully")
	}

	name := r.FormValue("name")
	age := r.FormValue("age")
	gender := r.FormValue("gender")
	zodiac := r.FormValue("zodiac")
	city := r.FormValue("city")
	work := r.FormValue("work")
	study := r.FormValue("study")
	description := r.FormValue("description")
	interestsJSON := r.FormValue("interests")
	var interests []string
	if err := json.Unmarshal([]byte(interestsJSON), &interests); err != nil {
		log.Printf("error unmarshal json : %v", err)
		http.Error(w, "Error unmarshal json", http.StatusInternalServerError)
		return
	}
	err = h.useCases.proUC.SetProfileSettings(username, name, age, gender, zodiac, city, work, study, description, fname, interests)
	if err != nil {
		fmt.Println(err, "SaveSettings 2")
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)

}

func (h *Handlers) handleGetProfilePhoto(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("user")
	if username == "" {
		http.Error(w, "Необходимо передать имя пользователя", http.StatusBadRequest)
		return
	}

	profileData, err := h.useCases.proUC.GetProfileData(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if profileData.Photopath == "" {
		http.Error(w, "Фотография не найдена", http.StatusNotFound)
		return
	}

	fullPath := "./" + profileData.Photopath //Ensure that photopath only contains relative path from your uploads folder
	file, err := os.Open(fullPath)
	if err != nil {
		http.Error(w, "Фотография не найдена", http.StatusNotFound)
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		http.Error(w, "Фотография не найдена", http.StatusNotFound)
		return
	}

	http.ServeContent(w, r, filepath.Base(fullPath), fileInfo.ModTime(), file)

	return

}

func (h *Handlers) handleGetProfile(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("user")
	if username == "" {
		http.Error(w, "Необходимо передать имя пользователя", http.StatusBadRequest)
		return
	}

	profileData, err := h.useCases.proUC.GetProfileData(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Создаем новый тип, который будет содержать все поля, кроме Photopath
	type ProfileDataWithoutPhoto struct {
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
	}
	fmt.Println(profileData.Interests)
	profileDataWithoutPhoto := ProfileDataWithoutPhoto{
		Username:     profileData.Username,
		Nickname:     profileData.Nickname,
		Age:          profileData.Age,
		City:         profileData.City,
		PlaceOfStudy: profileData.PlaceOfStudy,
		PlaceOfWork:  profileData.PlaceOfWork,
		Gender:       profileData.Gender,
		Zodiac:       profileData.Zodiac,
		Description:  profileData.Description,
		Interests:    profileData.Interests,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(profileDataWithoutPhoto); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
