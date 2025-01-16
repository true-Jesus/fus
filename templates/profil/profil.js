document.addEventListener("DOMContentLoaded", function() {
    const userPhoto = document.getElementById("userPhoto");
    const defaultImagePath = "../../image/profil elements/photo.png"; // Замените на путь к вашему изображению

    if (!userPhoto.getAttribute("src")) {
        userPhoto.src = defaultImagePath;
    }

    // Получаем элементы
    const userName = document.getElementById("userName");
    const userAge = document.getElementById("userAge");
    const userZodiac = document.getElementById("userZodiac");
    const defaultZodiacPath = "../../image/profil elements/not selected.png";
    const userWorkSpan = document.getElementById("userWork"); // Получаем span для работы
    const userStudySpan = document.getElementById("userStudy"); // Получаем span для учебы
    const userCity = document.getElementById("userCity");
    const userDescription = document.getElementById("userDescription");
    const userGender = document.getElementById("userGender");
    const defaultGenderPath = "../../image/profil elements/not selected.png";
    const interestsContainer = document.getElementById("interestsContainer");

    if (!userZodiac.getAttribute("src")) {
        userZodiac.src = defaultZodiacPath;
    }
    if (!userGender.getAttribute("src")) {
        userGender.src = defaultGenderPath;
    }


    // Пример данных (здесь вы будете использовать реальные данные)
    const userData = {
        photo: "",
        name: "Джон Доу",
        age: 25,
        zodiac: "",
        work: "Каменщик",
        study: "МГУ",
        city: "Нью-Йорк",
        description: "Люблю гулять по парку и играть на гитаре.",
        gender: "",
        interest: ["Футбол", "Музыка", "Программирование", "Танцы", "Путешествия"]
    };

    // Обновляем данные на странице
    if(userData.photo){
        userPhoto.src = userData.photo;
    }
    if(userData.zodiac){
        userPhoto.src = userData.zodiac;
    }
    if(userData.gender){
        userPhoto.src = userData.gender;
    }

    userName.textContent = userData.name;
    userAge.textContent = userData.age + " лет";

    if (userData.work) {
        userWorkSpan.textContent = userData.work; // Вставляем текст в span
    }

    if (userData.study) {
        userStudySpan.textContent = userData.study; // Вставляем текст в span
    }

    userCity.textContent = userData.city;
    userDescription.textContent = userData.description;

    // Динамическое добавление интересов
    if (userData.interest && Array.isArray(userData.interest)) {
        userData.interest.forEach(interest => {
            const interestElement = document.createElement("span");
            interestElement.classList.add("interest");
            interestElement.textContent = interest;
            interestsContainer.appendChild(interestElement);
        });
    }
});
