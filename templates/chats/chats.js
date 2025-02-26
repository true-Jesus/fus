
document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');
    const chatMessages = document.querySelector('.chat-messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const userNameHeader = document.getElementById('chatUserName');
    const addFileButton = document.querySelector('.add-file-button');
    const fileInput = document.getElementById('fileInput');
    const addEmojiButton = document.querySelector('.add-emoji-button');
    const emojiModal = document.querySelector('.emoji-modal');
    const emojiModalContent = document.querySelector('.emoji-modal-content');
    const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😳', '🤯', '🤪', '😵', '😴', '🤤', '😥', '😓', '😪', '😭', '🥵', '🥶', '🥴', '🤢', '🤮', '🤧', '🤒', '🤕', '😇', '🤠', '🤡', '🥳', '🥴', '🤫', '🤭', '🧐', '🤨', '🙄', '😒', '😤', '😠', '😡', '🤬', '😷', '🤒', '🤕'];
    const chatListContainer = document.querySelector('.chat-list-container');
    const toggleChatListButton = document.querySelector('.toggle-chat-list');

    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialRoomID = urlParams.get('RoomID');
    const initialOtherUserNickname = urlParams.get('OtherUserNickname');

    // Получаем имя пользователя из cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const userNickname = getCookie('user');

    // Проверяем, получили ли имя пользователя из cookie
    if (!userNickname) {
        console.error('Не удалось получить имя пользователя из cookie!');
        // Возможно, стоит перенаправить пользователя на страницу авторизации
        return;
    }

    let websocket = null;
    let currentRoomID = null; // Добавлено для отслеживания текущей комнаты

    function sendMessageToWebSocket(message) {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket не подключен или не готов к отправке сообщений.");
        }
        //  const messageElement = document.createElement("div");
        //  messageElement.classList.add("message");
        //  messageElement.innerHTML = `<strong>${message.author}:</strong> ${message.body}`;
        //  chatMessages.appendChild(messageElement);
        //  chatMessages.scrollTop = chatMessages.scrollHeight;

    }

    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        // Проверяем, является ли автор сообщения текущим пользователем
        const isCurrentUser = message.author === userNickname;
        if (isCurrentUser) {
            messageElement.classList.add("outgoing");
        } else {
            messageElement.classList.add("incoming");
        }

        messageElement.innerHTML = `<strong>${message.author}:</strong> ${message.body}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function connectWebSocket(roomID) {
        // Закрываем существующее соединение, если оно есть
        if (websocket) {
            websocket.close();
            websocket = null; // Сбрасываем websocket
        }

        const wsUrl = `ws://localhost:8081/entry?room=${roomID}`;
        websocket = new WebSocket(wsUrl);
        currentRoomID = roomID; // Сохраняем текущую комнату

        websocket.onopen = function (event) {
            console.log(`Подключено к websocket (комната: ${roomID})`);
        };

        websocket.onmessage = function (event) {
            const message = JSON.parse(event.data);
            displayMessage(message);
        };

        websocket.onclose = function (event) {
            console.log(`Отключено от websocket (комната: ${roomID})`);
            websocket = null;
            currentRoomID = null;
        };

        websocket.onerror = function (error) {
            console.error("WebSocket error:", error);
            websocket = null;
            currentRoomID = null;
        };
    }
    function sendMessage(messageText, file) {
        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const fileType = file.type;
                if (fileType.startsWith('image/')) {
                    // Если это изображение
                    const imageElement = document.createElement('img');
                    imageElement.src = event.target.result;
                    imageElement.style.maxWidth = '200px';
                    //отправляем сообщение WebSocket с URL изображения
                    const message = {
                        author: userNickname,
                        body: event.target.result, // Отправляем URL изображения
                        room: currentRoomID,
                        type: "image" // Добавляем тип сообщения
                    };
                    sendMessageToWebSocket(message)
                } else if (fileType.startsWith('text/')) {
                    // Если это текст
                    //отправляем сообщение WebSocket с текстом
                    const message = {
                        author: userNickname,
                        body: event.target.result,
                        room: currentRoomID,
                        type: "text"
                    };
                    sendMessageToWebSocket(message);
                } else {
                    // Если это любой другой тип файла
                    const linkElement = document.createElement('a');
                    linkElement.href = event.target.result;
                    linkElement.download = file.name;
                    linkElement.textContent = `Файл: ${file.name}`;
                    //отправляем сообщение WebSocket со ссылкой на файл
                    const message = {
                        author: userNickname,
                        body: event.target.result,
                        room: currentRoomID,
                        type: "file"
                    };
                    sendMessageToWebSocket(message);
                }
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };
            if (file.type.startsWith('text/')) {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        } else {
            //отправляем текстовое сообщение WebSocket
            const message = {
                author: userNickname,
                body: messageText,
                room: currentRoomID,
                type: "text"
            };
            sendMessageToWebSocket(message)
        }
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    function sendMessageToWebSocket(message) {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket не подключен или не готов к отправке сообщений.");
        }
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${message.author}:</strong> ${message.body}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    }

    addFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    function closeEmojiModal() {
        emojiModal.style.display = 'none';
    }

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            sendMessage('', file);
        }
    });

    addEmojiButton.addEventListener('click', () => {
        if (emojiModal.style.display === 'block') {
            closeEmojiModal();
        } else {
            emojiModal.style.display = 'block';
        }
    });

    emojis.forEach(emoji => {
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = emoji;
        emojiSpan.addEventListener('click', () => {
            messageInput.value += emoji;
            closeEmojiModal();
        });
        emojiModalContent.appendChild(emojiSpan);
    });

    window.addEventListener('click', (event) => {
        if (event.target === emojiModal) {
            closeEmojiModal();
        }
    });

    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const messageText = messageInput.value;
            sendMessage(messageText);
        }
    });

    function loadMessages(roomID, otherUserNickname) {
        userNameHeader.textContent = otherUserNickname;
        chatMessages.innerHTML = '';

        // Подключаемся к WebSocket комнате
        connectWebSocket(roomID);
        //sendMessage("", null)

    }

    function addChatToList(roomID, otherUserNickname) {
        const existingChat = Array.from(chatList.children).find(chatItem => {
            return chatItem.dataset.roomId === roomID;
        });

        if (!existingChat) {
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');
            chatItem.dataset.roomId = roomID;
            chatItem.innerHTML = `
                <div class="user-icon">${otherUserNickname[0].toUpperCase()}</div>
                <div class="user-info">
                    <span class="username">${otherUserNickname}</span>
                    <span class="last-message">Нет сообщений</span>
                </div>
            `;
            chatItem.addEventListener('click', () => {
                loadMessages(roomID, otherUserNickname);
            });
            chatList.appendChild(chatItem);
        }
    }

    // Загружаем список чатов с сервера
    function loadChatList() {
        // Получаем имя пользователя из cookie
        const userNickname = getCookie('user');

        // Проверяем, получили ли имя пользователя из cookie
        if (!userNickname) {
            console.error('Не удалось получить имя пользователя из cookie!');
            return; // Прерываем выполнение, если нет имени пользователя
        }
        const url = new URL('/rooms', window.location.origin); // Используем URL, чтобы правильно добавить параметры
        url.searchParams.append('user', userNickname); // Добавляем параметр userNickname
        fetch(url, {
            method: 'GET', // Явно указываем метод GET
        })
            .then(response => response.json())
            .then(data => {
                // Обрабатываем полученные данные и добавляем чаты в список
                data.forEach(chat => {
                    addChatToList(chat.RoomID, chat.OtherUserNickname);
                });

                // После загрузки чатов, проверяем, нужно ли открыть какой-то чат
                if (initialRoomID && initialOtherUserNickname) {
                    loadMessages(initialRoomID, initialOtherUserNickname);
                }
            })
            .catch(error => {
                console.error('Ошибка во время получения чатов:', error);
            });
    }

    // Изменяем обработчик отправки сообщения
    sendMessageButton.addEventListener('click', function() {
        const messageText = messageInput.value;

        // Проверяем, подключен ли websocket и есть ли сообщение для отправки
        if (websocket && websocket.readyState === WebSocket.OPEN && messageText.trim() !== "") {
            const message = {
                author: userNickname,
                body: messageText,
                room: currentRoomID, // Отправляем текущий RoomID
                type: "text"
            };
            sendMessageToWebSocket(message);
            sendMessage("",null);
        } else {
            console.error("Невозможно отправить сообщение: WebSocket не подключен или сообщение пустое.");
        }
    });

    toggleChatListButton.addEventListener('click', () => {
        chatListContainer.classList.toggle('collapsed');
    });
    // Загружаем список чатов при загрузке страницы
    loadChatList();
});