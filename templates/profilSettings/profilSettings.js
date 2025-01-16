document.addEventListener("DOMContentLoaded", function() {
    const userPhoto = document.getElementById("userPhoto");
    const photoInput = document.getElementById("photoInput");
    const userNameInput = document.getElementById("userName");
    const userAgeInput = document.getElementById("userAge");
    const userCityInput = document.getElementById("userCity");
    const userWorkInput = document.getElementById("userWork");
    const userStudyInput = document.getElementById("userStudy");
    const userDescriptionInput = document.getElementById("userDescription");
    const userGenderSelect = document.getElementById("userGender");
    const userZodiacSelect = document.getElementById("userZodiac");
    const interestsContainer = document.getElementById("interestsContainer");
    const newInterestInput = document.getElementById("newInterestInput");
    const addInterestButton = document.getElementById("addInterestButton");
    const saveButton = document.getElementById("saveButton");

    const userGender = document.getElementById("userGender");
    const genderModal = document.getElementById("genderModal");
    const genderButtons = document.querySelectorAll(".gender-button");
    const genderIcon = document.getElementById("genderIcon");

    const userZodiac = document.getElementById("userZodiac");
    const zodiacModal = document.getElementById("zodiacModal");
    const zodiacButtons = document.querySelectorAll(".zodiac-button");
    const zodiacIcon = document.getElementById("zodiacIcon");

    userGender.addEventListener("click", function(){
        genderModal.style.display = genderModal.style.display === "block" ? "none" : "block";
    });
    genderIcon.addEventListener("click", function(){
        userGender.style.display = "inline-block";
        genderIcon.style.display = "none";
        genderModal.style.display = "block";
    });
    genderButtons.forEach(button => {
        button.addEventListener("click", function() {
            const gender = button.getAttribute("data-gender");
            userGenderSelect.value = gender;
            genderModal.style.display = "none";

        });
    });
    genderButtons.forEach(button => {
        button.addEventListener("click", function() {
            const gender = button.getAttribute("data-gender");
            userGenderSelect.value = gender;

            if(gender === "♂"){
                genderIcon.src = "/image/profil elements/men.png";
            }else if (gender === "♀"){
                genderIcon.src = "/image/profil elements/women.png";
            }
            genderIcon.style.display = "inline-block";
            genderModal.style.display = "none";
            userGender.style.display = "none";
        });
    });


    userZodiac.addEventListener("click", function(){
        zodiacModal.style.display = zodiacModal.style.display === "block" ? "none" : "block";
    });

    zodiacIcon.addEventListener("click", function(){
        userZodiac.style.display = "inline-block";
        zodiacIcon.style.display = "none";
        zodiacModal.style.display = "block";

    });



    zodiacButtons.forEach(button => {
        button.addEventListener("click", function() {
            const zodiac = button.getAttribute("data-zodiac");
            userZodiacSelect.value = zodiac;

            if(zodiac === "Aquarius"){
                zodiacIcon.src = "/image/profil elements/Aquarius.png";
            }else if (zodiac === "archer"){
                zodiacIcon.src = "/image/profil elements/archer.png";
            }else if (zodiac === "Aries"){
                zodiacIcon.src = "/image/profil elements/Aries.png";
            }else if (zodiac === "canser"){
                zodiacIcon.src = "/image/profil elements/canser.png";
            }else if (zodiac === "Capricorn"){
                zodiacIcon.src = "/image/profil elements/Capricorn.png";
            }else if (zodiac === "crorpion"){
                zodiacIcon.src = "/image/profil elements/crorpion.png";
            }else if (zodiac === "Lion"){
                zodiacIcon.src = "/image/profil elements/Lion.png";
            }else if (zodiac === "fish"){
                zodiacIcon.src = "/image/profil elements/fish.png";
            }else if (zodiac === "Scales"){
                zodiacIcon.src = "/image/profil elements/Scales.png";
            }else if (zodiac === "Taurus"){
                zodiacIcon.src = "/image/profil elements/Taurus.png";
            }else if (zodiac === "Twins"){
                zodiacIcon.src = "/image/profil elements/Twins.png";
            }else if (zodiac === "Virgo"){
                zodiacIcon.src = "/image/profil elements/Virgo.png";
            }
            zodiacIcon.style.display = "inline-block";
            userZodiac.style.display = "none";
            zodiacModal.style.display = "none";
        });
    });

    let interests = []; // Массив для хранения интересов

    photoInput.addEventListener("change", function(){
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userPhoto.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }

    });

    // Функция для добавления интереса
    function addInterest(interestText) {
        if(interestText && interestText !== ""){
            interests.push(interestText);
            const interestElement = document.createElement("span");
            interestElement.classList.add("interest");
            interestElement.textContent = interestText;
            interestsContainer.appendChild(interestElement);
            newInterestInput.value = ""; // Очищаем input
        }

    }


    // Слушатель события на кнопку добавления интереса
    addInterestButton.addEventListener("click", function() {
        addInterest(newInterestInput.value);
    });


    // Функция для обработки нажатия на кнопку "Готово"
    saveButton.addEventListener("click", function() {
        const userData = {
            photo: userPhoto.src,
            name: userNameInput.value,
            age: userAgeInput.value,
            city: userCityInput.value,
            work: userWorkInput.value,
            study: userStudyInput.value,
            description: userDescriptionInput.value,
            gender: userGenderSelect.value,
            zodiac: userZodiacSelect.value,
            interest: interests
        };
        // Сохраняем в localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        // перенаправляем на профиль пользователя
        window.location.href = '../../templates/profil/profil.html';

        console.log(userData);
    });
    // Загрузка данных из localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        if(userData.photo){
            userPhoto.src = userData.photo;
        }
        userNameInput.value = userData.name;
        userAgeInput.value = userData.age;
        userCityInput.value = userData.city;
        userWorkInput.value = userData.work;
        userStudyInput.value = userData.study;
        userDescriptionInput.value = userData.description;
        userGenderSelect.value = userData.gender;
        userZodiacSelect.value = userData.zodiac;
        userData.interest.forEach(interest => {
            addInterest(interest)
        });
    }

});