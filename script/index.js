"use strict";
let gravity = 9.81;
let velocity = 0;
let positionY = 100; // Start-Höhe in px
let deltaTime = 0.1;
const groundLevel = 500; // Bodenhöhe in px
const player = document.getElementById("player"); // Holen des Div-Elements
function update() {
    velocity += gravity * deltaTime; // Beschleunigung anwenden
    positionY += velocity * deltaTime; // Position aktualisieren
    if (positionY >= groundLevel) {
        positionY = groundLevel; // Stoppt das Fallen
        velocity = 0;
        console.log("Der Spieler hat den Boden erreicht.");
        clearInterval(gameLoop);
    }
    player.style.top = `${positionY}px`; // Position im CSS aktualisieren
    console.log(`Position: ${positionY.toFixed(2)}px, Geschwindigkeit: ${velocity.toFixed(2)}px/s`);
}
// Setze das Intervall für die kontinuierliche Bewegung
let gameLoop = setInterval(update, deltaTime * 100);
