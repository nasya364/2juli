// ===========================
// ELEMENT
// ===========================

const envelope = document.getElementById("envelope");
const intro = document.getElementById("intro");

const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

const loveBtn = document.getElementById("loveBtn");
const runBtn = document.getElementById("runBtn");

const finalPage = document.getElementById("final");

// ===========================
// BUKA AMPLOP
// ===========================

envelope.addEventListener("click", () => {

    if(envelope.classList.contains("open")) return;

    envelope.classList.add("open");

    setTimeout(() => {

        intro.classList.add("hide");

        popup.classList.remove("hidden");
        popup.classList.add("show");

    },2200);

});

// ===========================
// CLOSE POPUP
// ===========================

closeBtn.addEventListener("click",()=>{

    popup.classList.remove("show");
    popup.classList.add("hidden");

    intro.classList.remove("hide");

    envelope.classList.remove("open");

});

// ===========================
// TOMBOL MALU
// ===========================

runBtn.addEventListener("mouseenter",()=>{

    const parent = runBtn.parentElement;

    const maxX = parent.clientWidth-runBtn.offsetWidth;
    const maxY = parent.clientHeight-runBtn.offsetHeight;

    runBtn.style.position="absolute";
    runBtn.style.left=Math.random()*maxX+"px";
    runBtn.style.top=Math.random()*maxY+"px";

});

// ===========================
// LOVE BUTTON
// ===========================

loveBtn.addEventListener("click",()=>{

    popup.classList.remove("show");
    popup.classList.add("hidden");

    startConfetti();

    setTimeout(()=>{

        finalPage.classList.remove("hidden");
        finalPage.classList.add("show");

    },600);

});

// ===========================
// FLOATING HEART
// ===========================

function createHeart(){

    const heart=document.createElement("div");

    heart.className="floating-heart";

    heart.innerHTML="❤️";

    heart.style.left=Math.random()*100+"vw";

    heart.style.fontSize=(18+Math.random()*20)+"px";

    heart.style.animationDuration=(4+Math.random()*3)+"s";

    document.body.appendChild(heart);

    setTimeout(()=>{

        heart.remove();

    },7000);

}

setInterval(createHeart,500);

// ===========================
// CONFETTI
// ===========================

const canvas=document.getElementById("confetti");
const ctx=canvas.getContext("2d");

function resize(){

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

}

resize();

window.addEventListener("resize",resize);

let confettis=[];

function random(min,max){

    return Math.random()*(max-min)+min;

}

function startConfetti(){

    confettis=[];

    for(let i=0;i<220;i++){

        confettis.push({

            x:random(0,canvas.width),

            y:random(-canvas.height,0),

            size:random(5,10),

            speed:random(2,6),

            angle:random(0,360),

            color:`hsl(${Math.random()*360},90%,65%)`

        });

    }

    animateConfetti();

}

function animateConfetti(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    confettis.forEach(c=>{

        ctx.save();

        ctx.translate(c.x,c.y);

        ctx.rotate(c.angle);

        ctx.fillStyle=c.color;

        ctx.fillRect(0,0,c.size,c.size);

        ctx.restore();

        c.y+=c.speed;

        c.x+=Math.sin(c.y/30);

        c.angle+=0.05;

        if(c.y>canvas.height){

            c.y=-20;
            c.x=random(0,canvas.width);

        }

    });

    requestAnimationFrame(animateConfetti);

}
