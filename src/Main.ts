import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { consts } from "./Consts";

(async () => {
    console.log("Main.ts run.");

    let app = new PIXI.Application({ width: consts.GameWidth, height: consts.GameHeight, backgroundColor: consts.bgColor });
    app.stage.addChild(new Game());


    let gameContainer = document.getElementById("game-container")
    gameContainer.appendChild(app.view)

})();
