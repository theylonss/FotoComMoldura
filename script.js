const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const photo = new Image();
const frame = new Image();

let imageX = 0;
let imageY = 0;
let scale = 1;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Tamanho fixo do canvas
canvas.width = 500;
canvas.height = 500;

// Caminho correto da moldura
frame.src = 'img/forma1.png';

// ===== FUNÇÃO DE DESENHO =====
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // FOTO (ATRÁS)
    if (photo.complete && photo.src) {
        const w = photo.width * scale;
        const h = photo.height * scale;
        ctx.drawImage(photo, imageX, imageY, w, h);
    }

    // MOLDURA (FRENTE)
    if (frame.complete) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    }
}

// ===== CARREGAR FOTO =====
function loadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        photo.onload = function () {
            scale = 1;
            imageX = (canvas.width - photo.width) / 2;
            imageY = (canvas.height - photo.height) / 2;
            draw();
        };
        photo.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ===== ARRASTAR FOTO =====
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.offsetX - imageX;
    offsetY = e.offsetY - imageY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        imageX = e.offsetX - offsetX;
        imageY = e.offsetY - offsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

// ===== ZOOM =====
function zoomIn() {
    scale += 0.1;
    draw();
}

function zoomOut() {
    if (scale > 0.2) {
        scale -= 0.1;
        draw();
    }
}

// ===== DOWNLOAD (CORRIGIDO) =====
function downloadImage() {
    draw();

    try {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'foto_com_moldura.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        alert('Seu navegador bloqueou o download. Use o site publicado (GitHub Pages).');
    }
}


// Garante que a moldura desenhe sozinha
frame.onload = draw;
