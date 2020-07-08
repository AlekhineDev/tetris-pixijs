import { Texture, Sprite, Point } from "pixi.js";
import { Block } from "./Block";
import { consts } from "./consts";
import _ = require("lodash");
import { ShapeInfo } from "./interfaces/IDataJson";
export class BlockShape {
    public shapeInfo: ShapeInfo;
    public blocks: Block[][]
    constructor(blockTexture: Texture, shapeInfo: ShapeInfo, rotation: number, column: number) {
        this.shapeInfo = shapeInfo;
        const color: number = Math.random() * 16777215

        let adjustedPositions: number[][] = shapeInfo.shape;
        for (let i = 0; i < rotation; i++) {
            adjustedPositions = this._rotate90Degrees(adjustedPositions)
        }
        adjustedPositions = this._changeStartColumn(adjustedPositions, column)

        this.blocks = this._drawBlocks(adjustedPositions, blockTexture, color)

    }
    private _drawBlocks(rowsCols: number[][], blockTexture: Texture, color: number): Block[][] {
        const blocks: Block[][] = [];
        for (let row = 0; row < rowsCols.length; row++) {
            const rowBlocks: Block[] = []

            for (let col = 0; col < rowsCols[row].length; col++) {

                if (rowsCols[row][col] !== 0) {
                    const block = new Block(blockTexture, this);
                    block.x = col * consts.BlockWidth;
                    block.y = row * consts.BlockHeight;

                    rowBlocks.push(block)
                    block.tint = color;
                }
                else rowBlocks.push(null)
            }
            blocks.push(rowBlocks)
        }
        return blocks;
    }
    public contains(block: Block): boolean {
        if (block === null) return false
        else {
            for (let row = 0; row < this.blocks.length; row++) {
                const rowBlocks: Block[] = this.blocks[row];
                for (const rowBlock of rowBlocks) {
                    if (block === rowBlock) return true;
                }
            }
        }
        return false;
    }
    private _changeStartColumn(positions: number[][], column: number): number[][] {
        const newPositions: number[][] = [];
        for (let y = 0; y < positions.length; y++) {
            const newRow: number[] = _.fill(Array(positions[y].length), 0)
            for (let x = 0; x < positions[y].length; x++) {
                const element = positions[y][x];
                if (element !== 0) {
                    newRow[x + column] = element;
                }
            }
            newPositions.push(newRow)
        }
        return newPositions;
    }
    private _rotate90Degrees(shape: number[][]): number[][] {

        for (let y = 0; y < shape.length; y++) {
            const newRow = _.fill(Array(shape[y].length), 0)
        }

        const newPoints: Point[] = [];
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    console.log("Found a piece on: " + x + " " + y)
                    const newX = -y
                    const newY = x
                    console.log("Converted to " + newX + " " + newY)
                    newPoints.push(new Point(newX, newY))
                }
            }
        }

        let lowestX: number = 0;
        let lowestY: number = 0;
        for (const point of newPoints) {
            if (point.x < lowestX) lowestX = point.x;
            if (point.y < lowestY) lowestY = point.y
        }

        for (const point of newPoints) {
            point.x -= (lowestX)
            point.x = Math.abs(point.x)

            point.y -= (lowestY)
            point.y = Math.abs(point.y)
        }

        const gridPositions: number[][] = [];
        for (let y = 0; y < shape.length; y++) {
            let row: number[] = []
            for (let x = 0; x < shape[y].length; x++) {
                let containsBlock = false;
                for (const point of newPoints) {
                    if (point.x == x && point.y == y) {
                        containsBlock = true;
                        break;
                    }
                }
                if (containsBlock) row.push(1)
                else row.push(0)
            }
            gridPositions.push(row)

        }
        console.log(newPoints)
        return gridPositions;
    }
}