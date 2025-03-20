let gravity: number = 9.81; 
let velocity: number = 0;    
let positionY: number = 100; // start height in px
let deltaTime: number = 0.1; 
const groundLevel: number = 500; // botom height in px

const player = document.getElementById("player")!;

function update(): void {
    velocity += gravity * deltaTime;
    positionY += velocity * deltaTime;

    if (positionY >= groundLevel) {
        positionY = groundLevel; // stopps falling
        velocity = 0; 
        console.log("Der Spieler hat den Boden erreicht.");
        clearInterval(gameLoop);
    }

    player.style.top = `${positionY}px`; 
    console.log(`Position: ${positionY.toFixed(2)}px, Geschwindigkeit: ${velocity.toFixed(2)}px/s`);
}

let gameLoop = setInterval(update, deltaTime * 100);
