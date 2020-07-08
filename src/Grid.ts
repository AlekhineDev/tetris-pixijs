import * as _ from "lodash";
import { Block } from "./Block";
import { BlockShape } from "./BlockShape";
import { consts } from "./consts";

export class Grid extends PIXI.Container {

    private _gridArray: Array<Array<Block>> = [];
    private _shapes: Array<BlockShape> = []
    constructor(width: number = 3, height: number = 12) {
        super();

        for (let i = 0; i < height; i++) {

            this._gridArray.push(_.fill(Array(width), null))
        }

    }
    /**
     * Adds a provided shape to the grid.
     * @param shape Shape to add to the grid.
     */
    public addShape(shape: BlockShape) {
        const shapeOutline = shape.shapeInfo.shape;

        //Cycle through grid and place piece at start
        for (let row = 0; row < shape.blocks.length; row++) {

            for (let col = 0; col < shape.blocks[row].length; col++) {

                const block: Block = shape.blocks[row][col];
                if (block !== null) { //Found block location.
                    this.addChild(block)
                    this._gridArray[row][col] = block;
                }
            }
        }

        this._shapes.push(shape);
    }
    /**
     * Moves down a provided shape.
     * @param shape Shape to move down.
     */
    public moveDownShape(shape: BlockShape) {
        for (let row = this._gridArray.length - 1; row > -1; row--) {

            for (let col = this._gridArray[row].length - 1; col > -1; col--) {

                if (this._gridArray[row][col] !== null && shape.contains(this._gridArray[row][col])) {

                    this._gridArray[row][col].y += consts.BlockHeight;

                    this._gridArray[row + 1][col] = this._gridArray[row][col];
                    this._gridArray[row][col] = null;

                }
            }
        }
    }

    /**
     * Can provided shape move down?
     * @param shape Shape to test if it can move down.
     */
    public canMoveDownShape(shape: BlockShape): boolean {

        for (let row = this._gridArray.length - 1; row > -1; row--) {

            for (let col = 0; col < this._gridArray[row].length; col++) {
                const cell: Block = this._gridArray[row][col];
                //locate shape.
                if (shape.contains(cell)) {
                    //If the next row is out of bounds or the next cell is occupied by a block not belonging to this shape then return false.
                    const outOfBounds: boolean = this._gridArray.length < (row + 2)

                    if (outOfBounds) return false;

                    const nextRowHasBlock: boolean = this._gridArray[row + 1][col] !== null;
                    const shapeContainsNextRow: boolean = shape.contains(this._gridArray[row + 1][col])

                    if (nextRowHasBlock && !shapeContainsNextRow) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /**
     * Check if a row is filled
     * @returns -1 if no row is complete, otherwise returns the index of a completed row.
     */
    public findFullRow(): number {

        for (let row = this._gridArray.length - 1; row > -1; row--) {
            let blocksInRow = 0;

            for (let col = 0; col < this._gridArray[row].length; col++) {
                //If theres a block in the row, count it.
                if (this._gridArray[row][col] !== null) blocksInRow++
            }
            if (blocksInRow === this._gridArray[row].length) { //If the number of blocks is equal to the size of the row
                return row;
            }
        }
        return -1;
    }
    /**
     * Clears a row of blocks, moves down all shapes above it.
     * @param rowIndex Index of the row to clear
     */
    public clearRow(rowIndex: number) {

        for (let col = 0; col < this._gridArray[rowIndex].length; col++) {
            const block = this._gridArray[rowIndex][col]
            this.removeChild(block);
            this._gridArray[rowIndex][col] = null;
        }

        for (let row = rowIndex - 1; row > 0; row--) {
            const rowBlocks = this._gridArray[row]

            for (let col = 0; col < rowBlocks.length; col++) {
                const block = rowBlocks[col];
                if (block !== null) {
                    while (this.canMoveDownShape(block.shape)) {
                        this.moveDownShape(block.shape)
                    }
                }
            }
        }
    }
}