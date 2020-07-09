import * as PIXI from "pixi.js";
import { Grid } from "./Grid";
import * as _ from "lodash";
import { utils } from "./Utils";
import { BlockShape } from "./BlockShape";
import { consts } from "./Consts";
import { ShapeInfo, DataJson, Outcome } from "./interfaces/IDataJson";
export class Game extends PIXI.Container {
    private _data: DataJson;
    private _grid: Grid;
    private _graphics: Partial<Record<string, PIXI.LoaderResource>>;
    private _scoreText: PIXI.Text;
    private _score: number = 0;
    private _spawnedShapes: number = 0;
    constructor() {
        super();
        //Initialize the game, then when that is completed, start the game.
        this._init()
            .then(() => this._start())
    }
    /**
     * Initialize the game, fetch assets used by the game such as JSON and Graphics, set up game objects such as grid and score text.
     */
    private async _init() {

        this._grid = new Grid(3, 12);
        this.addChild(this._grid);

        const scoreTitle = new PIXI.Text("Score:")
        this._scoreText = new PIXI.Text("")

        this._scoreText.anchor.x = 1;
        scoreTitle.x = 0
        this._scoreText.x = consts.GameWidth;

        this.addChild(scoreTitle)
        this.addChild(this._scoreText);

        this._data = await this._fetchDataJson();
        this._graphics = await this._fetchGraphics();

    }
    /**
     * Start the game, assets should be fetched before starting.
     */
    private async _start() {
        this._refreshScoreText();
        this._dropShape();
    }

    /**
     * Spawn and drop a shape until it collides, recursively calls itself until it spawns a shape that cannot move down.
     */
    private async _dropShape() {

        const shape: BlockShape = this._spawnShape();
        if(shape==null){
            //Player lost! No shape to add.
            return
        }
        this._grid.addShape(shape)

        if (!this._grid.canMoveDownShape(shape)) {
            //Player lost! Shape just spawned and cant move.
            return;
        }

        await utils.timeout(250)

        //Move shape down while it can.
        while (this._grid.canMoveDownShape(shape)) {
            this._grid.moveDownShape(shape);
            await utils.timeout(250)
        }

        //Find full rows until they have all been cleared.
        while (this._grid.findFullRow() > -1) {
            this._grid.clearRow(this._grid.findFullRow());

            this._score += 10;
            this._refreshScoreText();
            
            await utils.timeout(500)
        }
        this._dropShape();
    }
    private _refreshScoreText() {
        this._scoreText.text = this._score.toString();
    }

    private _spawnShape(): BlockShape {

        if (this._data.outcome.length <= this._spawnedShapes) return null;

        const outcome: Outcome = this._data.outcome[this._spawnedShapes]
        const outcomeShapeInfo: ShapeInfo = this._findShape(outcome);
        const texture: PIXI.Texture = this._graphics["baseshape"].texture
        this._spawnedShapes++
        return new BlockShape(texture, outcomeShapeInfo, outcome.rotation, outcome.column)
    }
    private _findShape(outcome: Outcome): ShapeInfo {
        for (const shape of this._data.shapes) {
            if (outcome.name === shape.name) return shape;
        }
    }

    private _fetchDataJson(): Promise<DataJson> {
        return fetch("/data.json")
            .then(response => response.json())
            .then(data => Promise.resolve(data as DataJson))

    }
    private _fetchGraphics(): Promise<Partial<Record<string, PIXI.LoaderResource>>> {
        const loader = new PIXI.Loader()
        loader.add("baseshape", "/graphics/baseshape.png")

        //Wrap loader in promise to allow for async.
        const resources = new Promise<Partial<Record<string, PIXI.LoaderResource>>>(resolve => {
            loader.load((loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {
                resolve(resources)
            })
        });
        return resources;
    }
}