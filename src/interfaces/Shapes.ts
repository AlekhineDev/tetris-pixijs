export interface ShapeDatas extends Array<ShapeData> {

}

export interface ShapeData {
    name: String,
    shape: Array<Array<number>>,
    initialColumn: number,
    initialRotation: number
}