package server

import (
	"fus/usecases"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
)

type Routes []Route

type UseCases struct {
	aufUC *usecases.AufUseCase
}

func NewUseCases(aufUC *usecases.AufUseCase) *UseCases {
	return &UseCases{aufUC: aufUC}
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
			Route{Name: "Home", Method: http.MethodGet, Pattern: "/", HandlerFunc: h.Home},
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
	return router
}
func (h *Handlers) Home(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	htmlFile := "templates/homePage.html"
	html, err := ioutil.ReadFile(htmlFile)
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	w.Write([]byte(html))
}
