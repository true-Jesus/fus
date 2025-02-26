package chat

// Message структура представляет сообщение чата.
type Message struct {
	Author string `json:"author"` // Автор сообщения
	Body   string `json:"body"`   // Тело сообщения
	Room   string `json:"room"`   // Комната, к которой относится сообщение
}

// String возвращает строковое представление сообщения.
func (self *Message) String() string {
	return self.Author + " says " + self.Body // Форматируем сообщение в строку
}
