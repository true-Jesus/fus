function register() {
    var username = document.getElementById('regUsername').value;
    var password = document.getElementById('regPassword').value;
    // Отправляем данные на /reg
    fetch('/reg', {
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
                // Успешная регистрация
                // Перенаправляем на главную страницу
                window.location.href = '/logPg';
            } else {
                // Обработка ошибки регистрации
                return response.text(); // Получаем текст ответа
            }
        })
        .then(data => {
            // Отображаем ошибку пользователю
            alert(data); // Или выведите сообщение другим способом
        })
        .catch(error => {
            // Обработка ошибки регистрации
            console.error('Ошибка во время регистрации:', error);
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