
document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');
    const chatMessages = document.querySelector('.chat-messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const userNameHeader = document.getElementById('chatUserName');
    const userStatusHeader = document.getElementById('chatUserStatus');
    const urlParams = new URLSearchParams(window.location.search);
    const receiverName = urlParams.get('name');
    const user = getCookie('user');
    const addFileButton = document.querySelector('.add-file-button');
    const fileInput = document.getElementById('fileInput');
    const addEmojiButton = document.querySelector('.add-emoji-button');
    const emojiModal = document.querySelector('.emoji-modal');
    const emojiModalContent = document.querySelector('.emoji-modal-content');
    const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😳', '🤯', '🤪', '😵', '😴', '🤤', '😥', '😓', '😪', '😭', '🥵', '🥶', '🥴', '🤢', '🤮', '🤧', '🤒', '🤕', '😇', '🤠', '🤡', '🥳', '🥴', '🤫', '🤭', '🧐', '🤨', '🙄', '😒', '😤', '😠', '😡', '🤬', '😷', '🤒', '🤕'];
    const chatListContainer = document.querySelector('.chat-list-container');
    const toggleChatListButton = document.querySelector('.toggle-chat-list');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function sendMessage(messageText, file) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'outgoing');

        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const fileType = file.type;
                if (fileType.startsWith('image/')) {
                    // Если это изображение
                    const imageElement = document.createElement('img');
                    imageElement.src = event.target.result;
                    imageElement.style.maxWidth = '200px';
                    messageElement.appendChild(imageElement);
                } else if (fileType.startsWith('text/')) {
                    // Если это текст
                    messageElement.textContent = event.target.result;

                } else {
                    // Если это любой другой тип файла
                    const linkElement = document.createElement('a');
                    linkElement.href = event.target.result;
                    linkElement.download = file.name;
                    linkElement.textContent = `Файл: ${file.name}`;
                    messageElement.appendChild(linkElement);

                }
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };
            if (file.type.startsWith('text/')) {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }

        } else {
            messageElement.textContent = messageText;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        messageInput.value = '';
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

    function loadMessages(receiverName) {
        userNameHeader.textContent = receiverName;
        chatMessages.innerHTML = '';

        const mockMessages = [
            { sender: 'Alice', text: 'Привет! Как дела?' },
            { sender: user, text: 'Привет, все хорошо! А у тебя?' },
            { sender: 'Alice', text: 'Тоже все хорошо!' },
            { sender: 'Alice', text: 'Чем занимаешься?' },
            { sender: user, text: 'Да так, ничего особого' },
            { sender: 'Alice', text: 'Понятно' },
        ];

        mockMessages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (message.sender === user) {
                messageElement.classList.add('outgoing');
            } else {
                messageElement.classList.add('incoming');
            }
            messageElement.textContent = message.text;
            chatMessages.appendChild(messageElement);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addChatToList(chatName) {
        const existingChat = Array.from(chatList.children).find(chatItem => {
            return chatItem.querySelector('.username').textContent === chatName
        });
        if (!existingChat) {
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');
            chatItem.innerHTML = `
                <div class="user-icon">${chatName[0].toUpperCase()}</div>
                <div class="user-info">
                    <span class="username">${chatName}</span>
                    <span class="last-message">Нет сообщений</span>
                </div>
            `;
            chatItem.addEventListener('click', () => {
                loadMessages(chatName);
            });

            chatList.appendChild(chatItem);
        }
    }

    const mockChats = [
        { name: 'Alice', lastMessage: 'Тоже все хорошо!' },
        { name: 'Bob', lastMessage: 'Рад тебя видеть!' },
        { name: 'Charlie', lastMessage: 'Чем занимаешься?' },
        { name: 'Diana', lastMessage: 'Хорошего дня!' }
    ];

    mockChats.forEach(chat => {
        addChatToList(chat.name)
    });


    if (receiverName) {
        loadMessages(receiverName);
        addChatToList(receiverName);
    }

    sendMessageButton.addEventListener('click', function() {
        const messageText = messageInput.value;
        sendMessage(messageText);
    });
    toggleChatListButton.addEventListener('click', () => {
        chatListContainer.classList.toggle('collapsed');
    });
});
