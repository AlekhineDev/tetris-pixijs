export interface ShapeData  {
    shapes:Array<ShapeInfo>
}

export interface ShapeInfo {
    name: string,
    shape: Array<Array<number>>,
    initialColumn: number,
    initialRotation: number
}