
//Холст и его контекст
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Поля ввода
const widthBox = document.getElementById("widthBox");
const heightBox = document.getElementById("heightBox");
const topBox = document.getElementById("topBox");
const leftBox = document.getElementById("leftBox");

//Кнопка сохранения
const saveBtn = document.getElementById("saveBtn");

//Ссылка на новое изображение
//const newImg = document.getElementById("newImg"); // Удаляем, она не используется

// Добавляем обработчик для кнопки сохранения
saveBtn.addEventListener("click", SavePhoto);


widthBox.addEventListener("change", function () { ChangeBoxes(); });
heightBox.addEventListener("change", function () { ChangeBoxes(); });
topBox.addEventListener("change", function () { ChangeBoxes(); });
leftBox.addEventListener("change", function () { ChangeBoxes(); });


canvas.addEventListener("mousedown", function (e) { MouseDown(e); });
canvas.addEventListener("mousemove", function (e) { MouseMove(e); });
document.addEventListener("mouseup", function (e) { MouseUp(e); });

var selection =
    {
        mDown: false,
        x: 0,
        y: 0,
        top: 50,
        left: 50,
        width: 400,
        height: 400
    };

const image = document.getElementById("image");

image.addEventListener("load", function () { Init(); });



window.addEventListener("resize", function () { Init(); });



function Init()
{
    image.src = document.getElementById("userPhoto").src;
    canvas.width = image.width;
    canvas.height = image.height;

    canvas.setAttribute("style", "top: " + (image.offsetTop + 5) + "px; left: " + (image.offsetLeft + 5) + "px;");

    leftBox.setAttribute("max", image.width - 200);
    topBox.setAttribute("max", image.height - 200);

    widthBox.setAttribute("max", image.width);
    heightBox.setAttribute("max", image.height);

    DrawSelection();
}


function MouseDown(e)
{
    selection.mDown = true;
}

function MouseMove(e)
{
    if(selection.mDown)
    {
        selection.x = e.clientX - canvas.offsetLeft;
        selection.y = e.clientY - canvas.offsetTop;

        selection.left = selection.x - selection.width / 2;
        selection.top = selection.y - selection.height / 2;

        CheckSelection();

        Update();
    }
}

function MouseUp(e)
{
    selection.mDown = false;
}


function Update()
{
    UpdateBoxes();
    DrawSelection();
}

function DrawSelection()
{
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(selection.left, selection.top, selection.width, selection.height);

    ctx.strokeStyle = "#fff";

    ctx.beginPath();

    ctx.moveTo(selection.left, 0);
    ctx.lineTo(selection.left, canvas.height);

    ctx.moveTo(selection.left + selection.width, 0);
    ctx.lineTo(selection.left + selection.width, canvas.height);

    ctx.moveTo(0, selection.top);
    ctx.lineTo(canvas.width, selection.top);

    ctx.moveTo(0, selection.top + selection.height);
    ctx.lineTo(canvas.width, selection.top + selection.height);

    ctx.stroke();
}

function ChangeBoxes()
{
    selection.width = Math.round(widthBox.value);
    selection.height = Math.round(heightBox.value);
    selection.top = Math.round(topBox.value);
    selection.left = Math.round(leftBox.value);

    CheckSelection();
    Update();
}

function CheckSelection()
{
    if(selection.width < 200)
    {
        selection.width = 200;
    }

    if(selection.height < 200)
    {
        selection.height = 200;
    }

    if(selection.width > canvas.width)
    {
        selection.width = canvas.width;
    }

    if(selection.height > canvas.height)
    {
        selection.height = canvas.height;
    }

    if(selection.left < 0)
    {
        selection.left = 0;
    }

    if(selection.top < 0)
    {
        selection.top = 0;
    }

    if(selection.left > canvas.width - selection.width)
    {
        selection.left = canvas.width - selection.width;
    }

    if(selection.top > canvas.height - selection.height)
    {
        selection.top = canvas.height - selection.height;
    }
}

function UpdateBoxes()
{
    widthBox.value = Math.round(selection.width);
    heightBox.value = Math.round(selection.height);
    topBox.value = Math.round(selection.top);
    leftBox.value = Math.round(selection.left);
}

function SavePhoto() {
    // Получаем URL изображения из атрибута src элемента userPhoto
    const imageUrl = document.getElementById("userPhoto").src;

    // Создаем объект FormData
    const formData = new FormData();

    // Добавляем параметры обрезки
    formData.append("width", widthBox.value);
    formData.append("height", heightBox.value);
    formData.append("top", topBox.value);
    formData.append("left", leftBox.value);
    formData.append("cw", canvas.width);
    formData.append("ch", canvas.height);

    // Функция для загрузки изображения и отправки данных
    function loadImageAndSendData(imageUrl) {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                // Добавляем изображение как blob
                formData.append("image", blob, "user_image.png");

                // Отправляем данные на сервер
                sendDataToServer(formData);
            })
            .catch(error => console.error('Error loading image:', error));
    }

    function sendDataToServer(formData) {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "/editer", true); // Изменен endpoint на "/crop"
        xhr.responseType = "blob"; // Указываем, что ожидаем получить blob

        xhr.onload = function () {
            if (xhr.status != 200) {
                console.log(xhr.status + ": " + xhr.statusText);
            } else {
                // Получаем Blob с обрезанным изображением
                const croppedImageBlob = xhr.response;

                // Создаем URL для Blob
                const croppedImageUrl = URL.createObjectURL(croppedImageBlob);

                // Обновляем src изображения на странице
                document.getElementById("userPhoto").src = croppedImageUrl;
                document.getElementById("application").hidden = true
                console.log("Изображение успешно обновлено");


                // Очистка URL
                // URL.revokeObjectURL(croppedImageUrl);
            }
        };

        xhr.send(formData);
    }

    loadImageAndSendData(imageUrl);
}