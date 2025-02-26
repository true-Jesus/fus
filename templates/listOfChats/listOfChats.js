document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');

    // Функция для получения значения cookie по имени
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Возвращаем null, если cookie не найдена
    }

    // Получаем имя пользователя из cookie
    const userNickname = getCookie('user');

    // Проверяем, получили ли имя пользователя из cookie
    if (!userNickname) {
        console.error('Не удалось получить имя пользователя из cookie!');
        return; // Прерываем выполнение, если нет имени пользователя
    }

    // Функция для добавления элемента чата в список
    function addChatToList(roomID, otherUserNickname) {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.innerHTML = `
            <div class="user-icon">${otherUserNickname[0].toUpperCase()}</div>
            <div class="user-info">
              <span class="username">${otherUserNickname}</span>
               <span class="last-message">Нет сообщений</span>
            </div>
         `;
        chatItem.addEventListener('click', () => {
            const currentUrl = window.location.origin;
            //console.log('Перенаправление на:', `${currentUrl}/templates/chats/chats.html?RoomID=${roomID}&OtherUserNickname=${otherUserNickname}`);
            window.location.href = `${currentUrl}/templates/chats/chats.html?RoomID=${roomID}&OtherUserNickname=${otherUserNickname}`;
        });
        chatList.appendChild(chatItem);
    }

    // Выполняем GET запрос к /rooms, передавая имя пользователя как параметр
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
        })
        .catch(error => {
            console.error('Ошибка во время получения чатов:', error);
        });
});
