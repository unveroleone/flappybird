let gravity: number = 9.81; 
let velocity: number = 0;    
let positionY: number = 100; // start height in px
let positionX : number = 0; // start position in px
let speed : number = 10;
let deltaTime: number = 0.1; 
let jumpForce : number = 50;
const skylevel : number = 0;
const groundLevel: number = 537; // botom height in px

const player = document.getElementById("player")!;

function update(): void {
    velocity += gravity * deltaTime;
    positionY += velocity * deltaTime;
    positionX += speed * deltaTime;

    if (positionY >= groundLevel) {
        positionY = groundLevel; // stopps falling
        velocity = 0; 
        console.log("Player reached bottom -- Game Over");
        clearInterval(gameLoop);
    }
    else if(positionY <= skylevel){
        positionY = skylevel;
        velocity = 0;
        console.log("Player reached sky -- Game Over");
        clearInterval(gameLoop);
    }

    player.style.top = `${positionY}px`; 
    player.style.left = `${positionX}px`;
    console.log(`Position: ${positionY.toFixed(2)}px, Geschwindigkeit: ${velocity.toFixed(2)}px/s`);
}

function Jump(): void {
    velocity = -jumpForce; 
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        Jump();
    }
});

let gameLoop = setInterval(update, deltaTime * 100);
