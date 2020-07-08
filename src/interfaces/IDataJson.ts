export interface DataJson{
    shapes:Array<ShapeInfo>,

    outcome:Array<Outcome>
}
export interface Outcome  {
    name:string,
    rotation:number,
    column:number
}

export interface ShapeInfo {
    name: string,
    shape: Array<Array<number>>,
    initialColumn: number,
    initialRotation: number
}