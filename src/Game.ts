import * as PIXI from "pixi.js";
import { Grid } from "./Grid";
import { ShapeData as ShapeData, ShapeInfo } from "./interfaces/IShapes";
import { ShapeSprite } from "./ShapeSprite";
import * as _ from "lodash";
export class Game extends PIXI.Container {
    private _shapeDatas: ShapeData;
    private _grid: Grid;
    private _graphics: Partial<Record<string, PIXI.LoaderResource>>;
    constructor() {
        super();
        this._init().then(() => this._start())
    }
    /**
     * Initialize the game, fetch assets used by the game such as JSON and Graphics.
     */
    private async _init() {

        this._grid = new Grid(3, 12);
        this.addChild(this._grid);
        this._shapeDatas = await this._fetchShapeData();
        this._graphics = await this._fetchGraphics();
    }
    private _start() {
        const shape: ShapeSprite = this._spawnShapeSprite();
        const spawnPoint: PIXI.Point = new PIXI.Point(0, 0)
        this._grid.addChild(shape)
        shape.position.set(spawnPoint.x, spawnPoint.y)
    }
    private _spawnShapeSprite(): ShapeSprite {
        const randomShapeData = _.sample(this._shapeDatas.shapes);
        const texture = this._graphics[randomShapeData.name].texture
        return new ShapeSprite(texture, randomShapeData)
    }

    private _fetchShapeData(): Promise<ShapeData> {
        return fetch("/shapes.json")
            .then(response => response.json())
            .then(data => Promise.resolve(data as ShapeData))

    }
    private _fetchGraphics(): Promise<Partial<Record<string, PIXI.LoaderResource>>> {
        const loader = new PIXI.Loader()
        loader.add("shape1", "/graphics/shape1.png")
        loader.add("shape2", "/graphics/shape2.png")
        loader.add("shape3", "/graphics/shape3.png")
        loader.add("shape4", "/graphics/shape4.png")
        loader.add("shape5", "/graphics/shape5.png")
        const resources = new Promise<Partial<Record<string, PIXI.LoaderResource>>>(resolve => {
            loader.load((loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {
                resolve(resources)
            })
        });
        return resources;
    }
    private _findTexture(name: string): PIXI.Texture {
        for (const property of Object.keys(this._graphics)) {
            if (property === name) return this._graphics[property].texture;
        }
        return null;
    }
}