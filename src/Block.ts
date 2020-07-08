import { BlockShape } from "./BlockShape";

export class Block extends PIXI.Sprite {
    public shape: BlockShape;
    constructor(texture: PIXI.Texture, shape: BlockShape) {
        super(texture);
        this.shape = shape;
    }


}