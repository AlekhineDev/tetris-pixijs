import * as PIXI from "pixi.js";
import { Game } from "./Game";

(async () => {
    console.log("Main.ts run.");

    let app = new PIXI.Application({ width: 150, height: 600, backgroundColor: 0x1099bb });
    app.stage.addChild(new Game());


    let gameContainer = document.getElementById("game-container")
    gameContainer.appendChild(app.view)
    
})();
