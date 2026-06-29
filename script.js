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

envelope.addEventListener("click",()=>{


    if(envelope.classList.contains("open")) return;


    envelope.classList.add("open");


    setTimeout(()=>{


        intro.classList.add("hidden");


        popup.classList.remove("hidden");

        popup.classList.add("show");


    },2300);



});



// ===========================
// CLOSE POPUP
// ===========================


closeBtn.addEventListener("click",()=>{


    popup.classList.remove("show");

    popup.classList.add("hidden");


    intro.classList.remove("hidden");


    envelope.classList.remove("open");


});




// ===========================
// TOMBOL MALU KABUR
// ===========================


runBtn.addEventListener("mouseenter",()=>{


    const area = runBtn.parentElement;


    const x = Math.random() * 
    (area.clientWidth - runBtn.offsetWidth);


    const y = Math.random() *
    (area.clientHeight - runBtn.offsetHeight);



    runBtn.style.position="absolute";


    runBtn.style.left=x+"px";


    runBtn.style.top=y+"px";

});




// ===========================
// PELUK VIRTUAL
// ===========================


loveBtn.addEventListener("click",()=>{


    popup.classList.add("hidden");


    startConfetti();



    setTimeout(()=>{


        finalPage.classList.remove("hidden");

        finalPage.classList.add("show");


    },600);



});




// ===========================
// HEART ANIMATION
// ===========================


function createHeart(){


    const heart=document.createElement("div");


    heart.className="floating-heart";


    heart.innerHTML="❤️";


    heart.style.left=Math.random()*100+"vw";


    heart.style.fontSize=
    (15+Math.random()*30)+"px";


    heart.style.animationDuration=
    (3+Math.random()*4)+"s";



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



function resizeCanvas(){


    canvas.width=window.innerWidth;

    canvas.height=window.innerHeight;


}



resizeCanvas();



window.addEventListener(
"resize",
resizeCanvas
);



let confetti=[];



function random(min,max){


    return Math.random()*(max-min)+min;


}




function startConfetti(){



    confetti=[];



    for(let i=0;i<200;i++){



        confetti.push({


            x:random(0,canvas.width),

            y:random(-canvas.height,0),


            size:random(5,10),


            speed:random(2,6),


            color:
            `hsl(${Math.random()*360},90%,60%)`


        });



    }



    animateConfetti();



}





function animateConfetti(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    confetti.forEach(c=>{


        ctx.fillStyle=c.color;


        ctx.fillRect(
            c.x,
            c.y,
            c.size,
            c.size
        );



        c.y+=c.speed;


        c.x+=Math.sin(c.y/30);



        if(c.y>canvas.height){


            c.y=-20;


            c.x=random(
                0,
                canvas.width
            );


        }



    });



    requestAnimationFrame(
        animateConfetti
    );

}
