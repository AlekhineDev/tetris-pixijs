import { Container } from "pixi.js";
import * as _ from "lodash";

export class Grid extends Container {

    private _gridArray: Array<Array<boolean>> = [];
    constructor(width: number = 3, height: number = 12) {
        super();

        for (let i = 0; i < width; i++) {

            this._gridArray.push(_.fill(Array(height), false))
        }
        
    }
}