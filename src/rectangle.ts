import {ShapeStates, Shape} from "./shape";

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
            context.lineWidth = 3;
            context.strokeStyle = '#ced6e5';
            context.strokeRect(...this.getRectParameters(this.x1, this.y1, this.x2, this.y2));
        }
        if (this.currentState === ShapeStates.Pressed && context) {
            context.lineWidth = 3;
            context.strokeStyle = '#e5eeff';
            context.strokeRect(...this.getRectParameters(this.x1, this.y1, this.x2, this.y2));
        }
    }

    checkIfCursorWithin(mouseX: number,
                        mouseY: number,
                        setCursorType: React.Dispatch<React.SetStateAction<string>>): boolean {
        if (mouseX  >= this.x1 
            && mouseX <= this.x2 
            && mouseY >= this.y1 
            && mouseY <= this.y2) {
            setCursorType('move');
            return true;
        } else {
            setCursorType('default');
            return false;
        }
    }

    moveShape(dx: number, dy: number) {
        this.x1 += dx;
        this.y1 += dy;
        this.x2 += dx;
        this.y2 += dy;
    }
}

export default Rectangle;