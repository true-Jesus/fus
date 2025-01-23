
document.addEventListener("DOMContentLoaded", function() {
    const userPhoto = document.getElementById("userPhoto");
    const defaultImagePath = "../../image/profil elements/photo.png";

    const userName = document.getElementById("userName");
    const userAge = document.getElementById("userAge");
    const userZodiac = document.getElementById("userZodiac");
    const defaultZodiacPath = "../../image/profil elements/not selected.png";
    const userWorkSpan = document.getElementById("userWork");
    const userStudySpan = document.getElementById("userStudy");
    const userCity = document.getElementById("userCity");
    const userDescription = document.getElementById("userDescription");
    const userGender = document.getElementById("userGender");
    const defaultGenderPath = "../../image/profil elements/not selected.png";
    const interestsContainer = document.getElementById("interestsContainer");
    const genderIcon = document.getElementById("genderIcon");
    const zodiacIcon = document.getElementById("zodiacIcon");

    if (!userPhoto.getAttribute("src")) {
        userPhoto.src = defaultImagePath;
    }

    if (!userZodiac.getAttribute("src")) {
        userZodiac.src = defaultZodiacPath;
    }
    if (!userGender.getAttribute("src")) {
        userGender.src = defaultGenderPath;
    }

    function updateProfileDisplay(userData) {

        if (userData.photo) {
            userPhoto.src = userData.photo;
        }

        userName.textContent = userData.username;
        userAge.textContent = userData.age + " лет";

        if (userData.place_of_work) {
            userWorkSpan.textContent = userData.place_of_work;
        }

        if (userData.place_of_study) {
            userStudySpan.textContent = userData.place_of_study;
        }

        userCity.textContent = userData.city;
        userDescription.textContent = userData.description;


        // Динамическое добавление интересов
        interestsContainer.innerHTML = '';
        if (userData.interests && Array.isArray(userData.interests)) {
            userData.interests.forEach(interest => {
                const interestElement = document.createElement("span");
                interestElement.classList.add("interest");
                interestElement.textContent = interest;
                interestsContainer.appendChild(interestElement);
            });
        }
        if(userData.gender === "man"){
            genderIcon.src = "/image/profil elements/men.png";
        }else if (userData.gender === "woman"){
            genderIcon.src = "/image/profil elements/women.png";
        }
        genderIcon.style.display = "inline-block";
        userGender.style.display = "none";


        if(userData.zodiac === "Aquarius"){
            zodiacIcon.src = "/image/profil elements/Aquarius.png";
        }else if (userData.zodiac === "archer"){
            zodiacIcon.src = "/image/profil elements/archer.png";
        }else if (userData.zodiac === "Aries"){
            zodiacIcon.src = "/image/profil elements/Aries.png";
        }else if (userData.zodiac === "canser"){
            zodiacIcon.src = "/image/profil elements/canser.png";
        }else if (userData.zodiac === "Capricorn"){
            zodiacIcon.src = "/image/profil elements/Capricorn.png";
        }else if (userData.zodiac === "crorpion"){
            zodiacIcon.src = "/image/profil elements/crorpion.png";
        }else if (userData.zodiac === "Lion"){
            zodiacIcon.src = "/image/profil elements/Lion.png";
        }else if (userData.zodiac === "fish"){
            zodiacIcon.src = "/image/profil elements/fish.png";
        }else if (userData.zodiac === "Scales"){
            zodiacIcon.src = "/image/profil elements/Scales.png";
        }else if (userData.zodiac === "Taurus"){
            zodiacIcon.src = "/image/profil elements/Taurus.png";
        }else if (userData.zodiac === "Twins"){
            zodiacIcon.src = "/image/profil elements/Twins.png";
        }else if (userData.zodiac === "Virgo"){
            zodiacIcon.src = "/image/profil elements/Virgo.png";
        }
        zodiacIcon.style.display = "inline-block";
        userZodiac.style.display = "none";
    }
    function loadProfile() {
        const user = getCookie('user');
        if (!user) {
            console.error("User cookie not found");
            return;
        }

        fetch(`/getProfilePhoto?user=${user}`, {
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
            .catch(error => {
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
                updateProfileDisplay(data); // Обновляем интерфейс с данными, полученными из лоад профиля
            })
            .catch(error => {
                console.error('Ошибка при загрузке профиля:', error);
            });
    }

    loadProfile();
});
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}