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
    const userWork = document.getElementById("userWork");
    const userStudy = document.getElementById("userStudy");
    const userCity = document.getElementById("userCity");
    const userDescription = document.getElementById("userDescription");
    const userGender = document.getElementById("userGender");
    const interest1 = document.getElementById("interest1");
    const interest2 = document.getElementById("interest2");
    const interest3 = document.getElementById("interest3");
})