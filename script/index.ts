let gravity: number = 9.81;
let velocity: number = 0;
let positionY: number = 100; // start height in px
let positionXGround: number = 0; // start position in px
let positionXPipes: number = 300;
let speed: number = -10;
let deltaTime: number = 0.1;
let jumpForce: number = 40;
const skylevel: number = 0;
const groundLevel: number = 555; // bottom height in px

const player = document.getElementById("player")!;
const ground1 = document.getElementById("ground1")!;
const ground2 = document.getElementById("ground2")!;
const ground3 = document.getElementById("ground3")!;
const pipes = document.getElementsByClassName("pipe");
const pipeholder = document.getElementById("pipe-container")!;

function update(): void {
    velocity += gravity * deltaTime;
    positionY += velocity * deltaTime;
    positionXGround += speed * deltaTime;
    positionXPipes +=speed * deltaTime;

    if (positionY >= groundLevel) {
        positionY = groundLevel;
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

    if(positionXGround <= -ground1.offsetWidth){
        positionXGround = 0;
    }
    player.style.top = `${positionY}px`; 
    ground1.style.left = `${positionXGround}px`;
    ground2.style.left = `${positionXGround + ground1.offsetWidth-1}px`;
    ground3.style.left = `${positionXGround + ground1.offsetWidth-1}px`;
    pipeholder.style.left = `${positionXPipes}px`;
    console.log(`Position: ${positionY.toFixed(2)}px, Geschwindigkeit: ${velocity.toFixed(2)}px/s`);
    
    if (isCollidingWithAny(player, pipes)) {
        console.log("Collision detected with a pipe!");
        clearInterval(gameLoop);
    }
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

function isCollidingWithAny(player: HTMLElement, pipes: HTMLCollectionOf<Element>): boolean {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i] as HTMLElement;
        if (isColliding(player, pipe)) {
            return true; // Collision detected with at least one pipe
        }
    }
    return false; // No collision detected
}

function isColliding(el1: HTMLElement, el2: HTMLElement): boolean {
    if (!el1 || !el2) return false;

    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const shrink = 5;

    return (
        rect1.left + shrink < rect2.right - shrink &&
        rect1.right - shrink > rect2.left + shrink &&
        rect1.top + shrink < rect2.bottom - shrink &&
        rect1.bottom - shrink > rect2.top + shrink
    );
}


document.addEventListener("wheel", function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });