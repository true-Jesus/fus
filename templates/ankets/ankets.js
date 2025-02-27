
document.addEventListener('DOMContentLoaded', function() {
    const dislikeButton = document.querySelector('.action-button.dislike');
    const likeButton = document.querySelector('.action-button.like');
    const anketCard = document.querySelector('.anket-card');
    const anketContainer = document.querySelector('.anket-container');
    const expandButton = document.querySelector('.expand-button-container');
    const expandedAnketContainer = document.querySelector('.expanded-anket-container');
    const collapseButton = document.querySelector('.collapse-button-container');

    if (dislikeButton && likeButton && anketCard) {
        loadUserData().then(() => {  // Ждем завершения loadUserData
            console.log("Начальное значение targname:", targname); // Отладка: проверяем начальное значение

            dislikeButton.addEventListener('click', function() {
                console.log("Нажат дизлайк. targname:", targname); // Отладка
                handleAssessment(0);
                animateOutAndIn(anketCard, anketContainer);

            });

            likeButton.addEventListener('click', function() {
                console.log("Нажат лайк. targname:", targname); // Отладка
                handleAssessment(1);
                animateOutAndIn(anketCard, anketContainer);
            });
        });

        expandButton.addEventListener('click', function() {
            showExpandedAnket(expandedAnketContainer, anketCard);
        });
        collapseButton.addEventListener('click', function() {
            hideExpandedAnket(expandedAnketContainer, anketCard);
        });
    } else {
        console.error("Один или несколько элементов не найдены!"); // Важно: обрабатываем отсутствующие элементы
    }
});

let targname = "Изначальное значение"; // Начальное значение. Скорее всего, не то, что вам нужно.

function animateOutAndIn(anketCard, anketContainer) {
    // Анимируем только карточку
    anketCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    anketCard.style.transform = 'translateY(-500px)';
    anketCard.style.opacity = '0';

    setTimeout(() => {
        // Создаем новую карточку
        const newCard = createAnketCard();
        newCard.style.opacity = '0';

        // Заменяем только карточку внутри контейнера
        anketContainer.replaceChild(newCard, anketCard);

        // Force reflow to apply initial styles
        void newCard.offsetWidth;

        // Анимируем появление новой карточки
        newCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
    }, 500);
}

function showExpandedAnket(expandedAnketContainer, anketCard) {
    const background = document.querySelector('.background'); // Находим элемент фона
    anketCard.style.display = 'none'; // Скрываем основную анкету
    expandedAnketContainer.style.display = 'flex'; // Показываем расширенную анкету
    background.style.display = 'none'; // Скрываем фон
}

function hideExpandedAnket(expandedAnketContainer, anketCard) {
    const background = document.querySelector('.background'); // Находим элемент фона
    anketCard.style.display = 'flex'; // Показываем основную анкету
    expandedAnketContainer.style.display = 'none'; // Скрываем расширенную анкету
    background.style.display = 'block'; // Показываем фон
}

function createAnketCard() {
    // Создаем только карточку, без контейнера
    const newCard = document.createElement('div');
    newCard.classList.add('anket-card');

    // Копируем структуру карточки
    newCard.innerHTML = `
        <div class="image-container">
            <img src="" alt="Фото пользователя" class="user-photo">
        </div>
        <div class="profile-info">
            <div class="name-info-container">
                <span class="name-info user-name"></span> 
                <span class="name-info user-age"></span> 
                <img class="user-gender" src="" alt="Пол"> 
                <img class="user-zodiac" src="" alt="Знак зодиака">
            </div>
            <div class="location-info">
                <img src="../../image/profil elements/sity.png" alt="Город"> 
                <span class="user-city"></span>
            </div>
            <div class="work-info">
                <img src="../../image/profil elements/work.png" alt="Работа"> 
                <span class="user-work"></span>
            </div>
            <div class="study-info">
                <img src="../../image/profil elements/study.png" alt="Учёба"> 
                <span class="user-study"></span>
            </div>
        </div>
        <div class="description user-description"></div>
        <div class="interests"></div>
        <div class="anket-actions">
            <div class="action-buttons">
                <div class="action-button dislike">
                    <img src="../../image/ankets elements/dislike.png" alt="Дизлайк">
                </div>
                <div class="action-button like">
                    <img src="../../image/ankets elements/like.png" alt="Лайк">
                </div>
            </div>
            <div class="expand-button-container">
                <img src="../../image/ankets elements/right.png" alt="Развернуть" class="expand-button">
                <span class="expand-text">Развернуть</span>
            </div>
        </div>
    `;

    // Загружаем данные для новой карточки
    loadUserDataForElement(newCard);
    return newCard;
}


async function loadUserData() {
    const user = getCookie('user');
    if (!user) {
        console.error("Cookie пользователя не найдена");
        return;
    }
    try {
        const response = await fetch(`/getanket?user=${user}`);
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        const userData = await response.json();
        console.log("Данные пользователя загружены:", userData); // Отладка: проверяем данные
        const processedData = processUserData(userData);
        targname = processedData.tname
        updateProfile(processedData);
        updateExpandedProfile(processedData);
        console.log("targname после loadUserData:", targname); // Отладка

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // Обработка ошибок (например, отображение сообщения об ошибке пользователю)
    }
}

async function loadUserDataForElement(card) {
    const user = getCookie('user');
    if (!user) {
        console.error("Cookie пользователя не найдена");
        return;
    }
    try {
        const response = await fetch(`/getanket?user=${user}`);
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        const userData = await response.json();

        const processedData = processUserData(userData);
        targname = processedData.tname
        updateProfileForElement(card, processedData);
        updateExpandedProfileForElement(card, processedData);

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // Обработка ошибок (например, отображение сообщения об ошибке пользователю)
    }
}

async function getImage(imagePath) {
    try {
        const response = await fetch(`/images?imagePath=${imagePath}`);
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);  // Создаем URL для отображения изображения
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        return null; // Или какое-то изображение-заглушка
    }
}

function processUserData(userData) {

    return {
        tname: userData.username,
        name: userData.nickname, // Используем nickname, если нужно
        age: userData.age,
        gender: getGenderImage(userData.gender), // Функция для получения пути к изображению пола
        zodiac: getZodiacImage(userData.zodiac), // Функция для получения пути к изображению знака зодиака
        city: userData.city,
        work: userData.place_of_work, // Используйте правильное поле
        study: userData.place_of_study, // Используйте правильное поле
        description: userData.description,
        interests: userData.interests,
        photo:  `/images?imagePath=${userData.photopath}`
    };
}

function getGenderImage(gender) {
    switch (gender) {
        case 'man':
            return '../../image/profil elements/men.png';
        case 'woman':
            return '../../image/profil elements/women.png';
    }
}

function getZodiacImage(zodiac) {
    switch (zodiac) {
        case 'Aries':
            return '../../image/profil elements/Aries.png';
        case 'Aquarius':
            return '../../image/profil elements/Aquarius.png';
        case 'archer':
            return '../../image/profil elements/archer.png';
        case 'canser':
            return '../../image/profil elements/canser.png';
        case 'Capricorn':
            return '../../image/profil elements/Capricorn.png';
        case 'crorpion':
            return '../../image/profil elements/crorpion.png';
        case 'Lion':
            return '../../image/profil elements/Lion.png';
        case 'fish':
            return '../../image/profil elements/fish.png';
        case 'Scales':
            return '../../image/profil elements/Scales.png';
        case 'Taurus':
            return '../../image/profil elements/Taurus.png';
        case 'Twins':
            return '../../image/profil elements/Twins.png';
        case 'Virgo':
            return '../../image/profil elements/Virgo.png';
    }
}


function updateProfile(data){
    const userName = document.querySelector('.user-name');
    const userAge = document.querySelector('.user-age');
    const userGender = document.querySelector('.user-gender');
    const userZodiac = document.querySelector('.user-zodiac');
    const userCity = document.querySelector('.user-city');
    const userWork = document.querySelector('.user-work');
    const userStudy = document.querySelector('.user-study');
    const userDescription = document.querySelector('.user-description');
    const interestsContainer = document.querySelector('.interests');
    const userPhoto = document.querySelector('.user-photo');


    userPhoto.src = data.photo;
    userName.textContent = data.name + ', ';
    userAge.textContent = data.age;
    userGender.src = data.gender;
    userZodiac.src = data.zodiac;
    userCity.textContent = data.city;
    userWork.textContent = data.work;
    userStudy.textContent = data.study;
    userDescription.textContent = data.description;


    interestsContainer.innerHTML = ''; // Очищаем предыдущие интересы

    data.interests.slice(0, 3).forEach(interest => {
        const button = document.createElement('button');
        button.classList.add('interest-button');
        button.textContent = interest;
        interestsContainer.appendChild(button);
    });
}


function updateProfileForElement(card, data){
    const userName = card.querySelector('.user-name');
    const userAge = card.querySelector('.user-age');
    const userGender = card.querySelector('.user-gender');
    const userZodiac = card.querySelector('.user-zodiac');
    const userCity = card.querySelector('.user-city');
    const userWork = card.querySelector('.user-work');
    const userStudy = card.querySelector('.user-study');
    const userDescription = card.querySelector('.user-description');
    const interestsContainer = card.querySelector('.interests');
    const userPhoto = card.querySelector('.user-photo');

    userPhoto.src = data.photo;
    userName.textContent = data.name + ', ';
    userAge.textContent = data.age;
    userGender.src = data.gender;
    userZodiac.src = data.zodiac;
    userCity.textContent = data.city;
    userWork.textContent = data.work;
    userStudy.textContent = data.study;
    userDescription.textContent = data.description;

    interestsContainer.innerHTML = ''; // Очищаем предыдущие интересы

    data.interests.slice(0, 3).forEach(interest => {
        const button = document.createElement('button');
        button.classList.add('interest-button');
        button.textContent = interest;
        interestsContainer.appendChild(button);
    });
}


function updateExpandedProfile(data){
    const userName = document.querySelector('.expanded-user-name');
    const userAge = document.querySelector('.expanded-user-age');
    const userGender = document.querySelector('.expanded-user-gender');
    const userZodiac = document.querySelector('.expanded-user-zodiac');
    const userCity = document.querySelector('.expanded-user-city');
    const userWork = document.querySelector('.expanded-user-work');
    const userStudy = document.querySelector('.expanded-user-study');
    const userDescription = document.querySelector('.expanded-user-description');
    const interestsContainer = document.querySelector('.expanded-interests');
    const userPhoto = document.querySelector('.expanded-user-photo');


    userPhoto.src = data.photo;
    userName.textContent = data.name + ', ';
    userAge.textContent = data.age;
    userGender.src = data.gender;
    userZodiac.src = data.zodiac;
    userCity.textContent = data.city;
    userWork.textContent = data.work;
    userStudy.textContent = data.study;
    userDescription.textContent = data.description;

    interestsContainer.innerHTML = ''; // Очищаем предыдущие интересы
    data.interests.forEach(interest => {
        const button = document.createElement('button');
        button.classList.add('interest-button');
        button.textContent = interest;
        interestsContainer.appendChild(button);
    });
}

function updateExpandedProfileForElement(card, data){
    const userName = card.querySelector('.expanded-user-name');
    const userAge = card.querySelector('.expanded-user-age');
    const userGender = card.querySelector('.expanded-user-gender');
    const userZodiac = card.querySelector('.expanded-user-zodiac');
    const userCity = card.querySelector('.expanded-user-city');
    const userWork = card.querySelector('.expanded-user-work');
    const userStudy = card.querySelector('.expanded-user-study');
    const userDescription = card.querySelector('.expanded-user-description');
    const interestsContainer = card.querySelector('.expanded-interests');
    const userPhoto = card.querySelector('.expanded-user-photo');


    userPhoto.src = data.photo;
    userName.textContent = data.name + ', ';
    userAge.textContent = data.age;
    userGender.src = data.gender;
    userZodiac.src = data.zodiac;
    userCity.textContent = data.city;
    userWork.textContent = data.work;
    userStudy.textContent = data.study;
    userDescription.textContent = data.description;
    interestsContainer.innerHTML = ''; // Очищаем предыдущие интересы
    data.interests.forEach(interest => {
        const button = document.createElement('button');
        button.classList.add('interest-button');
        button.textContent = interest;
        interestsContainer.appendChild(button);
    });
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
async function handleAssessment(value) {
    const user = getCookie('user');

    if (!user) {
        console.error("Cookie пользователя не найдена в handleAssessment");
        return;
    }

    console.log("handleAssessment - Пользователь:", user, "Цель:", targname, "Оценка:", value);

    try {
        const response = await fetch('/assess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Убедитесь, что заголовок Content-Type установлен
            },
            body: JSON.stringify({ // Преобразуем объект в строку JSON
                username: user,
                targetname: targname,
                assessment: value.toString() // Преобразуем значение в строку, как ожидает сервер
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }

        const responseData = await response.json(); // Разбираем JSON-ответ
        console.log('Оценка отправлена успешно!', responseData);

    } catch (error) {
        console.error('Ошибка при отправке оценки:', error);
    }
}