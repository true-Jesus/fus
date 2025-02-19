// Получаем контейнер уведомлений
const notificationsContainer = document.querySelector('.notifications-container');
const noNotificationsMessage = document.createElement('p');
noNotificationsMessage.textContent = 'Уведомлений пока что нет';
noNotificationsMessage.classList.add('no-notifications-message');
notificationsContainer.appendChild(noNotificationsMessage);

// Функция для создания элемента уведомления о лайке
function createLikedNotification() {
    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification-item', 'liked-notification');
    notificationItem.innerHTML = `
      <img src="../../image/notifications elements/heart.png" alt="Сердечко" class="notification-icon">
      <p class="notification-text">Вас лайкнули!</p>
  `;
    return notificationItem;
}

// Функция для создания элемента уведомления о взаимном лайке
function createMutualLikeNotification(userName) {
    const notificationItem = document.createElement('a');
    notificationItem.classList.add('mutual-like-item');
    notificationItem.innerHTML = `
        <img src="../../image/notifications elements/twoHeart.png" alt="Два сердечка" class="notification-icon">
        <p class="notification-text">У вас взаимный лайк!<br>Начните общаться с <span class="user-name">${userName}</span> прямо сейчас!</p>
    `;

    notificationItem.addEventListener('click', function (event) {
        event.preventDefault(); // Предотвращаем переход по ссылке

        // Получаем текущий URL

        // Перенаправляем пользователя на страницу чата с данным именем (используя абсолютный путь)
        window.location.href = `/templates/chats/chats.html?name=${userName}`;

        // Удаляем уведомление из DOM
        notificationItem.remove();
    });
    return notificationItem;
}


// Функция для создания элемента уведомления о жалобе
function createComplaintNotification() {
    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification-item', 'complaint-notification');
    notificationItem.innerHTML = `
      <img src="../../image/notifications elements/approve.png" alt="Лайк" class="notification-icon">
      <p class="notification-text">Спасибо, ваша жалоба учтена!</p>
  `;
    return notificationItem;
}

// Функция для отображения уведомления, всегда добавляет взаимный лайк наверх
function showNotification(notificationElement) {
    if (noNotificationsMessage.parentNode) {
        noNotificationsMessage.remove();
    }
    if (notificationElement.classList.contains('mutual-like-item')) {
        // Если это уведомление о взаимном лайке, добавляем его в начало списка
        notificationsContainer.prepend(notificationElement);
    } else {
        // В противном случае, добавляем его после всех уведомлений о взаимном лайке
        const firstMutualLike = notificationsContainer.querySelector('.mutual-like-item');
        if (firstMutualLike) {
            notificationsContainer.insertBefore(notificationElement, firstMutualLike.nextSibling);
        } else {
            notificationsContainer.prepend(notificationElement);
        }
    }
}


// Функция для показа уведомления о лайке
function showLikedNotification() {
    const notification = createLikedNotification();
    showNotification(notification);
}

// Функция для показа уведомления о взаимном лайке
function showMutualLikeNotification(userName) {
    const notification = createMutualLikeNotification(userName);
    showNotification(notification);
}

// Функция для показа уведомления о жалобе
function showComplaintNotification() {
    const notification = createComplaintNotification();
    showNotification(notification);
}

// Примеры использования:
// showLikedNotification();
// showMutualLikeNotification('Александр');
// showLikedNotification();
// showMutualLikeNotification('Дмитрий');
// showComplaintNotification();

showLikedNotification();
showMutualLikeNotification('Александр');