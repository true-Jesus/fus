function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    // Отправляем данные на /login
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: username,
            Password: password
        })
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // Получаем текст ответа
            } else {
                // Обработка ошибки входа
                return Promise.reject('Ошибка входа:', response.status);
            }
        })
        .then(data => {
            // Успешный вход
            // Получаем токен из ответа
            var token = data; // Обработайте токен, например, извлеките его из ответа
            setAuthToken(token); // Сохраняем токен в куки
            setCookie("user", username, 30);
            window.location.href = '/';

            // window.location.href = '/'; // Перенаправляем на главную
        })
        .catch(error => {
            // Обработка ошибки входа
            console.error(error);
            // Отобразите сообщение об ошибке пользователю
        });
}

function setAuthToken(token) {
    document.cookie = 'authToken=' + token + '; path=/'; // Установка кукиъ
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
}