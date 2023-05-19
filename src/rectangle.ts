import { CONSTANTS } from "./constants";
import {ShapeStates, Shape, drawSmallSquare, ControlStates} from "./shape";

class Rectangle implements Shape {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    id: number;

    currentState = ShapeStates.Normal;
    // currentState = ShapeStates.Selected;

    constructor(id: number,
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                canvasRef: React.RefObject<HTMLCanvasElement>) {
        this.id = id;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        // this.drawShape(canvasRef);
    }

    getRectParameters(x1: number, y1: number, x2: number, y2: number): [number, number, number, number] {
        return [x1, y1, x2 - x1, y2 - y1];
    }

    drawShape(canvasRef: React.RefObject<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.fillStyle = '#f00';
            context.fillRect(...this.getRectParameters(this.x1, this.y1, this.x2, this.y2));
        }
        // draws borders when the shape is selected
        if (this.currentState === ShapeStates.Selected && context) {
            // The code here can be simplified by having an array of 'control points' and
            // having a single function that takes input the control points and draws the small squares
            // can be simplified further having the control points saame for all shapes
            drawSmallSquare(this.x1, this.y1, CONSTANTS.selection_color, context);
            drawSmallSquare(this.x2, this.y1, CONSTANTS.selection_color, context);
            drawSmallSquare(this.x1, this.y2, CONSTANTS.selection_color, context);
            drawSmallSquare(this.x2, this.y2, CONSTANTS.selection_color, context);
            drawSmallSquare((this.x1 + this.x2) / 2, this.y1, CONSTANTS.selection_color, context);
            drawSmallSquare((this.x1 + this.x2) / 2, this.y2, CONSTANTS.selection_color, context);
            drawSmallSquare(this.x1, (this.y1 + this.y2) / 2, CONSTANTS.selection_color, context);
            drawSmallSquare(this.x2, (this.y1 + this.y2) / 2, CONSTANTS.selection_color, context);
        }
        if (this.currentState === ShapeStates.Pressed && context) {
            context.lineWidth = 3;
            context.strokeStyle = CONSTANTS.pressed_color;
            context.strokeRect(...this.getRectParameters(this.x1, this.y1, this.x2, this.y2));
        }
        if (this.currentState === ShapeStates.PressedControlE && context) {
            let color = CONSTANTS.pressed_color;
            drawSmallSquare(this.x1, this.y1, color, context);
            drawSmallSquare(this.x2, this.y1, color, context);
            drawSmallSquare(this.x1, this.y2, color, context);
            drawSmallSquare(this.x2, this.y2, color, context);
            drawSmallSquare((this.x1 + this.x2) / 2, this.y1, color, context);
            drawSmallSquare((this.x1 + this.x2) / 2, this.y2, color, context);
            drawSmallSquare(this.x1, (this.y1 + this.y2) / 2, color, context);
            drawSmallSquare(this.x2, (this.y1 + this.y2) / 2, color, context);
        }
    }

    checkCursorInRect(mouseX: number, mouseY: number, x1: number, y1: number, x2: number, y2: number) {
        if (mouseX  >= x1 
            && mouseX <= x2 
            && mouseY >= y1 
            && mouseY <= y2) {
            return true;
        } else {
            return false;
        }
    }

    checkIfCursorWithin(mouseX: number,
                        mouseY: number): boolean {
        let cursorIsOnControl = this.getControlCursorIsOn(mouseX, mouseY) === ControlStates.None ? false : true;
        return this.checkCursorInRect(mouseX, mouseY, this.x1, this.y1, this.x2, this.y2) || cursorIsOnControl;
    }

    getCornersOfControlSquares(x: number, y: number, length: number): [number, number, number, number] {
        return [x - length / 2, y - length / 2, x + length / 2, y + length / 2];
    }

    getControlCursorIsOn(mouseX: number,
                         mouseY: number): ControlStates {
        const length = CONSTANTS.controlSquareLength;
        if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares(this.x1, this.y1, length))) return ControlStates.NorthWest;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares(this.x1, this.y2, length))) return ControlStates.SouthWest;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares(this.x2, this.y1, length))) return ControlStates.NorthEast;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares(this.x2, this.y2, length))) return ControlStates.SouthEast;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares((this.x1 + this.x2) / 2, this.y2, length))) return ControlStates.South;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares((this.x1 + this.x2) / 2, this.y1, length))) return ControlStates.North;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares(this.x1, (this.y1 + this.y2) / 2, length))) return ControlStates.West;
        else if (this.checkCursorInRect(mouseX, mouseY, ...this.getCornersOfControlSquares(this.x2, (this.y1 + this.y2) / 2, length))) return ControlStates.East;
        else return ControlStates.None;
    }

    moveShape(dx: number, dy: number) {
        this.x1 += dx;
        this.y1 += dy;
        this.x2 += dx;
        this.y2 += dy;
    }

    resizeShape(mouseX: number, mouseY: number, dx: number, dy: number, direction: ShapeStates) {
        switch (direction) {
            case ShapeStates.PressedControlE:
                this.x2 += dx;
                return;
            case ShapeStates.PressedControlW:
                this.x1 += dx;
                return;
            case ShapeStates.PressedControlN:
                this.y1 += dy;
                return;
            case ShapeStates.PressedControlS:
                this.y2 += dy;
                return;
            case ShapeStates.PressedControlNE:
                this.x2 = mouseX;
                this.y1 = mouseY;
                return;
            case ShapeStates.PressedControlNW:
                this.x1 = mouseX;
                this.y1 = mouseY;
                return;
            case ShapeStates.PressedControlSE:
                this.x2 = mouseX;
                this.y2 = mouseY;
                return;
            case ShapeStates.PressedControlSW:
                this.x1 = mouseX;
                this.y2 = mouseY;
                return;
            default:
                return;
        }
    }
}

export default Rectangle;