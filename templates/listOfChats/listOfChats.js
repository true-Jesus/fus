document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');
    const user =  getCookie('user')

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
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
                const chatItem = document.createElement('div');
                chatItem.classList.add('chat-item');
                chatItem.innerHTML = `
                <div class="user-icon">${chat.name[0].toUpperCase()}</div>
                 <div class="user-info">
                    <span class="username">${chat.name}</span>
                    <span class="last-message">${chat.lastMessage ? chat.lastMessage : "Нет сообщений"}</span>
                </div>
                `;
                chatItem.addEventListener('click', () => {
                    window.location.href = `/chatPage?name=${chat.name}`;
                });
                chatList.appendChild(chatItem);
            });
        })
        .catch(error => {
            console.error('Ошибка во время получения чатов:', error);
        });

});