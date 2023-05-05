import { Shape, ShapeStates } from "./shape";

export enum CursorStates {
    Default = 'default',
    Move = 'move'
}

export class State {
    shapesArray: Shape[];
    cursorType: CursorStates;
    currentSelectedShape: number | null;
    lastMousePos: [number, number] | null;
    currentPressedState: number | null;
    shapeCount: number;
    isMouseDown: boolean;

    constructor() {
        this.shapesArray = [];
        this.cursorType = CursorStates.Default;
        this.currentSelectedShape = null;
        this.lastMousePos = null;
        this.currentPressedState = null;
        this.shapeCount = 0;
        this.isMouseDown = false;
    }

    moveShape(id: number, dx: number, dy: number) {
        this.shapesArray.find(shape => shape.id === id)?.moveShape(dx, dy);
    }

    modifyShapeState(id: number, newState: ShapeStates) {
        let shapeIndex = this.shapesArray.findIndex(shape => shape.id === id);
        if (this.shapesArray[shapeIndex] !== undefined) {
            this.shapesArray[shapeIndex].currentState = newState;
        }
    }
}
