
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
    const addInterestButton = document.getElementById("plus");
    const addInterestModal = document.getElementById("addInterestModal");
    const addInterestConfirm = document.getElementById("addInterestConfirm");
    const addInterestCancel = document.getElementById("addInterestCancel");

    const saveButton = document.getElementById("saveButton");

    const userGender = document.getElementById("userGender");
    const genderModal = document.getElementById("genderModal");
    const genderButtons = document.querySelectorAll(".gender-button");
    const genderIcon = document.getElementById("genderIcon");

    const userZodiac = document.getElementById("userZodiac");
    const zodiacModal = document.getElementById("zodiacModal");
    const zodiacButtons = document.querySelectorAll(".zodiac-button");
    const zodiacIcon = document.getElementById("zodiacIcon");

    genderModal.style.display = "none";
    zodiacModal.style.display = "none";

    userGender.addEventListener("click", function(){
        genderModal.style.display = genderModal.style.display === "block" ? "none" : "block";
    });
    userZodiac.addEventListener("click", function(){
        zodiacModal.style.display = zodiacModal.style.display === "block" ? "none" : "block";
    });

    genderIcon.addEventListener("click", function(){
        userGender.style.display = "inline-block";
        genderIcon.style.display = "none";
        genderModal.style.display = "block";
    });
    zodiacIcon.addEventListener("click", function(){
        userZodiac.style.display = "inline-block";
        zodiacIcon.style.display = "none";
        zodiacModal.style.display = "block";

    });

    genderButtons.forEach(button => {
        button.addEventListener("click", function() {
            const gender = button.getAttribute("data-gender");
            userGenderSelect.value = gender;
            genderModal.style.display = "none";
        });
    });

    zodiacButtons.forEach(button => {
        button.addEventListener("click", function() {
            const zodiac = button.getAttribute("data-zodiac");
            userZodiacSelect.value = zodiac;
            zodiacModal.style.display = "none";
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
    addInterestModal.style.display = "none";

    // Функция для добавления интереса
    function addInterest(interestText) {
        if(interestText && interestText !== ""){
            interests.push(interestText);
            const interestElement = document.createElement("span");
            interestElement.classList.add("interest");
            interestElement.innerHTML = `<span>${interestText}</span><img src="/image/profil elements/cross.png" alt="Удалить" class="remove-interest-button">`;
            interestsContainer.appendChild(interestElement);

            const removeButton = interestElement.querySelector(".remove-interest-button");
            removeButton.addEventListener("click", function(){
                removeInterest(interestElement, interestText);
            })
        }
    }
    function removeInterest(interestElement, interestText){
        interests = interests.filter(item => item !== interestText);
        interestsContainer.removeChild(interestElement);
    }

    // Слушатель события на кнопку добавления интереса
    addInterestButton.addEventListener("click", function() {
        addInterestModal.style.display = addInterestModal.style.display === "block" ? "none" : "block";
        addInterestButton.style.display = "none"
    });

    addInterestConfirm.addEventListener("click", function() {
        addInterest(newInterestInput.value);
    });
    addInterestCancel.addEventListener("click", function() {
        addInterestModal.style.display = "none";
        addInterestButton.style.display = "inline-block"
    });

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
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    saveButton.addEventListener("click", function() {
        const user = getCookie('user')
        const userData = {
            name: userNameInput.value,
            age: userAgeInput.value,
            gender: userGenderSelect.value,
            zodiac: userZodiacSelect.value,
            city: userCityInput.value,
            work: userWorkInput.value,
            study: userStudyInput.value,
            description: userDescriptionInput.value,
            interests: interests,
            user: user
        };

        fetch('/saveSettings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if(response.ok){

                } else{
                    return response.text()
                }
            })
            .then(data => {
                // Отображаем ошибку пользователю
                alert(data); // Или выведите сообщение другим способом
            })
            .catch(error => {
                // Обработка ошибки регистрации
                console.error('Ошибка при отправке данных:', error);
                // Отобразите сообщение об ошибке пользователю
            });
    });

});
