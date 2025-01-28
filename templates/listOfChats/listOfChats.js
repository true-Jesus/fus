document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');
    const user =  getCookie('user')

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function addChatToList(chatName) {
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
            const currentUrl = window.location.origin;
            console.log('Перенаправление на:', `${currentUrl}/templates/chats/chats.html?name=${chatName}`);
            window.location.href = `${currentUrl}/templates/chats/chats.html?name=${chatName}`;
        });
        chatList.appendChild(chatItem);
    }


    fetch('/getChats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user: user})
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(chat => {
                addChatToList(chat.name);
            });
        })
        .catch(error => {
            console.error('Ошибка во время получения чатов:', error);
        });
});
