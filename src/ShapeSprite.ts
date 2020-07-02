import { ShapeData } from "./interfaces/Shapes";
import { Texture } from "pixi.js";

export class ShapeSprite extends PIXI.Sprite {
    public shapeData: ShapeData;
    constructor(texture: Texture, shapeData: ShapeData) {
        super(texture)
        this.shapeData = shapeData;
        this.tint = Math.random() * 16777215
    }
}