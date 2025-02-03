
document.addEventListener('DOMContentLoaded', function() {
    const dislikeButton = document.querySelector('.action-button.dislike');
    const likeButton = document.querySelector('.action-button.like');
    const anketCard = document.querySelector('.anket-card');
    const anketContainer = document.querySelector('.anket-container');
    const expandButton = document.querySelector('.expand-button-container');

    const expandedAnketContainer = document.querySelector('.expanded-anket-container');
    const collapseButton = document.querySelector('.collapse-button-container');



    if (dislikeButton && likeButton && anketCard) {
        loadUserData();
        dislikeButton.addEventListener('click', function() {
            animateOutAndIn(anketCard, anketContainer);
        });

        likeButton.addEventListener('click', function() {
            animateOutAndIn(anketCard, anketContainer);
        });
        expandButton.addEventListener('click', function() {
            showExpandedAnket(expandedAnketContainer, anketCard);
        });
        collapseButton.addEventListener('click', function() {
            hideExpandedAnket(expandedAnketContainer, anketCard);
        });
    }
});


function animateOutAndIn(anketCard, anketContainer)
{
    anketCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    anketCard.style.transform = 'translateY(-500px)';
    anketCard.style.opacity = '0';

    setTimeout(() => {
        const newAnket = createAnketElement();
        newAnket.style.opacity = '0';
        anketContainer.innerHTML = '';
        anketContainer.appendChild(newAnket);

        // Force reflow to apply initial styles
        void newAnket.offsetWidth;

        newAnket.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        newAnket.style.opacity = '1';
        newAnket.style.transform = 'translateY(0)';
    }, 500);

}

function showExpandedAnket(expandedAnketContainer, anketCard) {
    anketCard.style.display = 'none';
    expandedAnketContainer.style.display = 'flex';
}

function hideExpandedAnket(expandedAnketContainer, anketCard) {
    anketCard.style.display = 'flex';
    expandedAnketContainer.style.display = 'none';
}


function createAnketElement() {
    const newCard = document.createElement('div');
    newCard.classList.add('anket-card');
    newCard.innerHTML = `
             <div class="image-container">
                 <img src="" alt="Фото пользователя" class="user-photo">
            </div>
            <div class="profile-info">
                <div class="name-info-container">
                  <span class="name-info user-name"></span> <span class="name-info user-age"></span> <img class="user-gender" src="" alt="Пол"> <img class="user-zodiac" src="" alt="Знак зодиака">
                </div>
                <div class="location-info">
                    <img src="../../image/profil elements/sity.png" alt="Город"> <span class="user-city"></span>
                </div>
                <div class="work-info">
                    <img src="../../image/profil elements/work.png" alt="Работа"> <span class="user-work"></span>
                </div>
                <div class="study-info">
                    <img src="../../image/profil elements/study.png" alt="Учёба"> <span class="user-study"></span>
                </div>
            </div>
            <div class="description user-description">

            </div>
            <div class="interests">

            </div>
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
    loadUserDataForElement(newCard);
    return newCard;
}


function loadUserData() {
    // Имитируем получение данных с сервера (замените на реальный запрос)
    const userData = {
        name: "Кристина",
        age: 25,
        gender: "../../image/profil elements/women.png",
        zodiac: "../../image/profil elements/aries.png",
        city: "Город",
        work: "Реснички делаю",
        study: "МГУ",
        description: "Я люблю пить кока колу и кушац пиццу",
        interests: ["Майнкрафт", "Майнкрафт", "Minecraft", "Minecraft", "Майнкрафт", "Майнкрафт", "Minecraft", "Minecraft", "Майнкрафт", "Майнкрафт"],
        photo: "../../image/ankets elements/userPhoto.jpg",
    };
    updateProfile(userData);
    updateExpandedProfile(userData);
}


function loadUserDataForElement(card) {
    // Имитируем получение данных с сервера (замените на реальный запрос)
    const userData = {
        name: "Кристина",
        age: 25,
        gender: "../../image/profil elements/women.png",
        zodiac: "../../image/profil elements/aries.png",
        city: "Город",
        work: "Реснички делаю",
        study: "МГУ",
        description: "Я люблю пить кока колу и кушац пиццу",
        interests: ["Майнкрафт", "Майнкрафт", "Minecraft", "Minecraft", "Майнкрафт", "Майнкрафт", "Minecraft", "Minecraft", "Майнкрафт", "Майнкрафт"],
        photo: "../../image/ankets elements/userPhoto.jpg",
    };
    updateProfileForElement(card, userData);
    updateExpandedProfileForElement(card, userData);
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
