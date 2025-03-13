function showForm(formType) {
    // Скрываем все формы
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'none';

    // Показываем нужную форму
    if (formType === 'registerForm') {
        document.getElementById('registerForm').style.display = 'block';
    } else if (formType === 'loginFormContainer') {
        document.getElementById('loginFormContainer').style.display = 'block';
    } else {
        document.getElementById('mainScreen').style.display = 'block';
    }
}

// Функции регистрации и входа из register.js и login.js
async function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch('/reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Username: username, Password: password })
        });
        
        if(response.ok) {
            showForm('login');
        }
    } catch(error) {
        console.error('Ошибка регистрации:', error);
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Username: username, Password: password })
        });

        if(response.ok) {
            const token = await response.text();
            setAuthToken(token);
            setCookie("user", username, 30);
            window.location.href = '/profil';
        }
    } catch(error) {
        console.error('Ошибка входа:', error);
    }
}

function setAuthToken(token) {
    document.cookie = `authToken=${token}; path=/`;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}