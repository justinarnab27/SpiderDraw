import { Shape, ShapeStates } from "./shape";

export enum CursorStates {
    Default = 'default',
    Move = 'move',
    RESIZE_NW = 'nw-resize',
    RESIZE_NE = 'ne-resize',
    RESIZE_SW = 'sw-resize',
    RESIZE_SE = 'se-resize',
    RESIZE_N = 'n-resize',
    RESIZE_E = 'e-resize',
    RESIZE_W = 'w-resize',
    RESIZE_S = 's-resize',
}

export class State {
    shapesArray: Shape[];
    cursorType: CursorStates;
    currentSelectedShape: number | null;
    lastMousePos: [number, number] | null;
    currentPressedState: number | null;
    currentResizeState: number | null;
    shapeCount: number;
    isMouseDown: boolean;
    disableClickAfterMouseUp: boolean; // is true after mouse up event and before the subsequent click event

    constructor() {
        this.shapesArray = [];
        this.cursorType = CursorStates.Default;
        this.currentSelectedShape = null;
        this.lastMousePos = null;
        this.currentPressedState = null;
        this.currentResizeState = null;
        this.shapeCount = 0;
        this.isMouseDown = false;
        this.disableClickAfterMouseUp = false;
    }

    moveShape(id: number, dx: number, dy: number) {
        this.shapesArray.find(shape => shape.id === id)?.moveShape(dx, dy);
    }


    resizeShape(id: number, dx: number, dy: number, direction: ShapeStates) {
        this.shapesArray.find(shape => shape.id === id)?.resizeShape(dx, dy, direction);
    }

    modifyShapeState(id: number, newState: ShapeStates) {
        let shapeIndex = this.shapesArray.findIndex(shape => shape.id === id);
        if (this.shapesArray[shapeIndex] !== undefined) {
            this.shapesArray[shapeIndex].currentState = newState;
        }
    }
}

