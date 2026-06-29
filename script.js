// ============================
// ELEMENT
// ============================

const envelope = document.getElementById("envelope");
const popup = document.getElementById("popup");
const intro = document.getElementById("intro");
const finalPage = document.getElementById("final");

const loveBtn = document.getElementById("loveBtn");
const runBtn = document.getElementById("runBtn");
const closeBtn = document.getElementById("closeBtn");

// ============================
// BUKA SURAT
// ============================

envelope.addEventListener("click", () => {

    envelope.classList.add("open");

    setTimeout(() => {

        intro.classList.add("hide");

        popup.classList.remove("hidden");
        popup.classList.add("show");

    }, 1300);

});

// ============================
// TOMBOL MALU (KABUR)
// ============================

runBtn.addEventListener("mouseover", () => {

    const parent = runBtn.parentElement;

    const maxX = parent.clientWidth - runBtn.offsetWidth;
    const maxY = parent.clientHeight + 120;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    runBtn.style.position = "absolute";
    runBtn.style.left = x + "px";
    runBtn.style.top = y + "px";

});

// ============================
// PELUK VIRTUAL
// ============================

loveBtn.addEventListener("click", () => {

    popup.classList.add("hide");

    startConfetti();

    setTimeout(() => {

        popup.style.display = "none";

        finalPage.classList.remove("hidden");
        finalPage.classList.add("show");

    }, 600);

});

// ============================
// CLOSE BUTTON
// ============================

closeBtn.addEventListener("click", () => {

    popup.classList.add("hide");

    setTimeout(() => {

        popup.classList.add("hidden");

        intro.classList.remove("hide");

        envelope.classList.remove("open");

    }, 400);

});

// ============================
// HEARTS
// ============================

function createHeart() {

    const heart = document.createElement("div");

    heart.classList.add("floating-heart");

    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize = (15 + Math.random() * 25) + "px";

    heart.style.animationDuration = (3 + Math.random() * 3) + "s";

    document.body.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 6000);

}

setInterval(createHeart, 500);

// ============================
// CONFETTI
// ============================

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettis = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function startConfetti() {

    confettis = [];

    for (let i = 0; i < 180; i++) {

        confettis.push({

            x: random(0, canvas.width),
            y: random(-canvas.height, 0),

            r: random(4, 10),

            d: random(2, 7),

            color:
                `hsl(${Math.random()*360},90%,65%)`,

            tilt: random(-10, 10),

            speed: random(2, 5)

        });

    }

    animateConfetti();

}

function animateConfetti() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettis.forEach(c => {

        ctx.beginPath();

        ctx.fillStyle = c.color;

        ctx.fillRect(c.x, c.y, c.r, c.r);

        c.y += c.speed;

        c.x += Math.sin(c.y / 30);

        if (c.y > canvas.height) {

            c.y = -20;

            c.x = random(0, canvas.width);

        }

    });

    requestAnimationFrame(animateConfetti);

}

// ============================
// RESIZE
// ============================

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});
