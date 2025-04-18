
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

    const cancelButton = document.getElementById("cancelBtn");
    const saveBtnPhoto = document.getElementById("saveBtn")

    const deleteProfilBtn = document.getElementById('deleteProfil');
    const sureDeleteModal = document.getElementById('sureDelete');
    const cancellationBtn = document.getElementById('cancellation');
    const yesDeleteBtn = document.getElementById('yesDelete');

    const errorMessage = document.createElement('div');
    errorMessage.id = 'errorMessage';
    errorMessage.className = 'error-message';
    document.querySelector('.profile-container').appendChild(errorMessage);

    const interestsWarning = document.getElementById("interestsWarning");
    const confirmSaveWithout = document.getElementById("confirmSaveWithout");
    const cancelSave = document.getElementById("cancelSave");

    genderModal.style.display = "none";
    zodiacModal.style.display = "none";


    // Обработчики событий
    deleteProfilBtn.addEventListener('click', () => {
        sureDeleteModal.style.display = 'block';
    });

    cancellationBtn.addEventListener('click', () => {
        sureDeleteModal.style.display = 'none';
    });

    yesDeleteBtn.addEventListener('click', () => {
        const user = getCookie('user');
        fetch('/deleteProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user })
        })
            .then(response => {
                if(response.ok) {
                    // Очищаем куки и перенаправляем
                    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

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

            if(gender === "man"){
                genderIcon.src = "/image/profil elements/men.png";
            }else if (gender === "woman"){
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

    function checkCriticalErrors() {
        return validateForm().length === 0; // Возвращает true если нет критических ошибок
    }

    function hasNoInterests() {
        return interests.length === 0;
    }

    // Функция валидации формы
    function validateForm() {
        const errors = [];

        // Проверка фотографии
        const isDefaultPhoto = userPhoto.src.includes('photo.png') ||
            userPhoto.src === window.location.href;
        if (isDefaultPhoto) {
            errors.push("Выберите фотографию");
        }

        // Проверка пола
        if (genderIcon.style.display === 'none') {
            errors.push('Выберите пол');
        }

        // Проверка знака зодиака
        if (zodiacIcon.style.display === 'none') {
            errors.push('Выберите знак зодиака');
        }

        // Проверка текстовых полей
        if (!userNameInput.value.trim()) errors.push('Напишите своё имя');
        if (!userAgeInput.value || parseInt(userAgeInput.value) < 1) errors.push('Напишите свой возраст');
        if (!userCityInput.value.trim()) errors.push('Напишите свой город');
        if (!userWorkInput.value.trim()) errors.push('Напишите свою работу');
        if (!userStudyInput.value.trim()) errors.push('Напишите своё образование');
        if (!userDescriptionInput.value.trim()) errors.push('Напишите что-нибудь о себе');

        return errors;
    }

    // Функция обновления сообщений об ошибках
    function updateErrorDisplay() {
        const errors = validateForm();
        errorMessage.textContent = errors.join('\n');
    }

    const fieldsToValidate = [
        userNameInput, userAgeInput, userCityInput,
        userWorkInput, userStudyInput, userDescriptionInput
    ];

    fieldsToValidate.forEach(field => {
        field.addEventListener('input', updateErrorDisplay);
    });

    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(updateErrorDisplay, 100); // Даем время на обновление DOM
        });
    });

    zodiacButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(updateErrorDisplay, 100);
        });
    });

// Отслеживание изменения фотографии
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'src') {
                updateErrorDisplay();
            }
        });
    });
    observer.observe(userPhoto, { attributes: true });

    // Обработчики для кнопок предупреждения
    confirmSaveWithout.addEventListener("click", proceedWithSave);
    cancelSave.addEventListener("click", function() {
        interestsWarning.style.display = "none";
        document.getElementById("plus").click(); // Открываем модалку добавления интересов
    });

    interestsContainer.addEventListener("DOMSubtreeModified", function() {
        if (!hasNoInterests()) {
            interestsWarning.style.display = "none";
        }
    });

    function proceedWithSave() {
        interestsWarning.style.display = "none";
        // ... существующая логика отправки данных
    }

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
        newInterestInput.value = "";
        addInterestButton.style.display = "none"
    });
    addInterestCancel.addEventListener("click", function() {
        addInterestModal.style.display = "none";
        addInterestButton.style.display = "inline-block"
    });
    var usersrc =""
    photoInput.addEventListener("change", function(){
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                usersrc = userPhoto.src
                userPhoto.src = e.target.result;

            }

            reader.readAsDataURL(file);
            Init();
            document.getElementById("application").hidden = false

        }
    });
    saveBtnPhoto.addEventListener("click" , function (){
        SavePhoto()
    });
    cancelButton.addEventListener("click", function() {
        userPhoto.src = usersrc

        document.getElementById("application").hidden = true
    });
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    // Функция для загрузки данных профиля
    function loadProfile() {
        const user = getCookie('user');
        if (!user) {
            console.error("User cookie not found");
            return;
        }
        // Загрузка фото
        fetch(`/getProfilePhoto?user=${user}`, { // добавили слэш в начало
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    return response.arrayBuffer();
                }
                return Promise.reject('Ошибка загрузки фото');
            })
            .then(buffer => {
                const blob = new Blob([buffer]);
                const imageUrl = URL.createObjectURL(blob);
                userPhoto.src = imageUrl;
            })
            .catch(error =>{
                console.error('Ошибка при загрузке фото:', error)
            });

        fetch(`/getProfile?user=${user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) })

                }
                return response.json();
            })
            .then(data => {
                userNameInput.value = data.username;
                userAgeInput.value = data.age;
                userCityInput.value = data.city;
                userWorkInput.value = data.place_of_work;
                userStudyInput.value = data.place_of_study;
                userDescriptionInput.value = data.description;
                userGenderSelect.value = data.gender;
                userZodiacSelect.value = data.zodiac;
                if(data.gender === "man"){
                    genderIcon.src = "/image/profil elements/men.png";
                }else if (data.gender === "woman"){
                    genderIcon.src = "/image/profil elements/women.png";
                }
                genderIcon.style.display = "inline-block";
                userGender.style.display = "none";


                if(data.zodiac === "Aquarius"){
                    zodiacIcon.src = "/image/profil elements/Aquarius.png";
                }else if (data.zodiac === "archer"){
                    zodiacIcon.src = "/image/profil elements/archer.png";
                }else if (data.zodiac === "Aries"){
                    zodiacIcon.src = "/image/profil elements/Aries.png";
                }else if (data.zodiac === "canser"){
                    zodiacIcon.src = "/image/profil elements/canser.png";
                }else if (data.zodiac === "Capricorn"){
                    zodiacIcon.src = "/image/profil elements/Capricorn.png";
                }else if (data.zodiac === "crorpion"){
                    zodiacIcon.src = "/image/profil elements/crorpion.png";
                }else if (data.zodiac === "Lion"){
                    zodiacIcon.src = "/image/profil elements/Lion.png";
                }else if (data.zodiac === "fish"){
                    zodiacIcon.src = "/image/profil elements/fish.png";
                }else if (data.zodiac === "Scales"){
                    zodiacIcon.src = "/image/profil elements/Scales.png";
                }else if (data.zodiac === "Taurus"){
                    zodiacIcon.src = "/image/profil elements/Taurus.png";
                }else if (data.zodiac === "Twins"){
                    zodiacIcon.src = "/image/profil elements/Twins.png";
                }else if (data.zodiac === "Virgo"){
                    zodiacIcon.src = "/image/profil elements/Virgo.png";
                }
                zodiacIcon.style.display = "inline-block";
                userZodiac.style.display = "none";
                // Заполнение интересов
                interestsContainer.innerHTML = "";
                interests = [];
                if(data.interests) {
                    for(const key in data.interests) {
                        addInterest(data.interests[key]);
                    }
                }

            })
            .catch(error => {
                console.error('Ошибка при загрузке профиля:', error);
                userPhoto.src = "/image/profil elements/photo.png"
            });
    }

    loadProfile(); // Загружаем данные профиля при загрузке страницы

    saveButton.addEventListener("click", function (e) {
        e.preventDefault();
        updateErrorDisplay();

        if (!checkCriticalErrors()) return;

        if (hasNoInterests()) {
            interestsWarning.style.display = "block";
        } else {
            proceedWithSave();
        }
        const user = getCookie('user');
        const userPhoto = document.getElementById("userPhoto"); // Получаем элемент userPhoto

        const formData = new FormData();

        if (userPhoto && userPhoto.src) {
            // Получаем изображение как Blob
            fetch(userPhoto.src)
                .then(response => response.blob())
                .then(blob => {
                    // Добавляем изображение в FormData
                    formData.append('photo', blob, "user_photo.jpeg"); // Можно задать имя файла

                    // Добавляем остальные поля
                    formData.append('user', user);
                    formData.append('name', userNameInput.value);
                    formData.append('age', userAgeInput.value);
                    formData.append('gender', userGenderSelect.value);
                    formData.append('zodiac', userZodiacSelect.value);
                    formData.append('city', userCityInput.value);
                    formData.append('work', userWorkInput.value);
                    formData.append('study', userStudyInput.value);
                    formData.append('description', userDescriptionInput.value);
                    formData.append('interests', JSON.stringify(interests));

                    // Отправляем данные
                    sendDataToServer(formData);

                })
                .catch(error => {
                    console.error('Ошибка при получении изображения:', error);
                });
        }
        else {
            formData.append('user', user);
            formData.append('name', userNameInput.value);
            formData.append('age', userAgeInput.value);
            formData.append('gender', userGenderSelect.value);
            formData.append('zodiac', userZodiacSelect.value);
            formData.append('city', userCityInput.value);
            formData.append('work', userWorkInput.value);
            formData.append('study', userStudyInput.value);
            formData.append('description', userDescriptionInput.value);
            formData.append('interests', JSON.stringify(interests));
            sendDataToServer(formData);
        }

        function sendDataToServer(formData)
        {
            fetch('/saveSettings', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if(response.ok){
                    } else{
                        return response.text()
                    }
                })
                .then(data => {
                })
                .catch(error => {
                    console.error('Ошибка при отправке данных:', error);
                });
        }
    });
    updateErrorDisplay();
});