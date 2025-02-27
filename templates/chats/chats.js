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
        return;
    }

    let websocket = null;
    let currentRoomID = null;

    function sendMessageToWebSocket(message) {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket не подключен или не готов к отправке сообщений.");
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        const isCurrentUser = message.author === userNickname;
        messageElement.classList.add(isCurrentUser ? "outgoing" : "incoming");

        // Обработка разных типов сообщений
        if (message.type === "image") {
            const img = document.createElement('img');
            img.src = message.body;
            img.style.maxWidth = '200px';
            messageElement.appendChild(img);
        } else {
            messageElement.textContent = message.body;
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function connectWebSocket(roomID) {
        if (websocket) {
            websocket.close();
            websocket = null;
        }

        const wsUrl = `ws://localhost:8081/entry?room=${roomID}`;
        websocket = new WebSocket(wsUrl);
        currentRoomID = roomID;

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
                    const message = {
                        author: userNickname,
                        body: event.target.result,
                        room: currentRoomID,
                        type: "image"
                    };
                    sendMessageToWebSocket(message);
                } else if (fileType.startsWith('text/')) {
                    const message = {
                        author: userNickname,
                        body: event.target.result,
                        room: currentRoomID,
                        type: "text"
                    };
                    sendMessageToWebSocket(message);
                } else {
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
            const message = {
                author: userNickname,
                body: messageText,
                room: currentRoomID,
                type: "text"
            };
            sendMessageToWebSocket(message);
        }
        messageInput.value = '';
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
        chatMessages.innerHTML = ''; // Полная очистка контейнера

        // Запрос истории с защитой от кэширования
        fetch(`/messages?room=${roomID}&_=${Date.now()}`)
            .then(response => response.json())
            .then(messages => {
                // Если сервер возвращает новые сообщения первыми - переворачиваем массив
                messages.reverse().forEach(message => {
                    displayMessage(message);
                });
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(console.error);

        connectWebSocket(roomID);
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

    function loadChatList() {
        const userNickname = getCookie('user');

        if (!userNickname) {
            console.error('Не удалось получить имя пользователя из cookie!');
            return;
        }

        const url = new URL('/rooms', window.location.origin);
        url.searchParams.append('user', userNickname);
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                data.forEach(chat => {
                    addChatToList(chat.RoomID, chat.OtherUserNickname);
                });

                if (initialRoomID && initialOtherUserNickname) {
                    loadMessages(initialRoomID, initialOtherUserNickname);
                }
            })
            .catch(error => {
                console.error('Ошибка во время получения чатов:', error);
            });
    }

    sendMessageButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            sendMessage(messageText);
            messageInput.value = '';
        }
    });

    toggleChatListButton.addEventListener('click', () => {
        chatListContainer.classList.toggle('collapsed');
    });

    loadChatList();
});