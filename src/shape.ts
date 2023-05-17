import { CONSTANTS } from "./constants";
import { CursorStates } from "./state";

export interface Shape {
    id: number;
    checkIfCursorWithin: (mouseX: number, mouseY: number) => boolean;
    checkIfCursorOnControls: (mouseX: number, mouseY: number) => CursorStates | null;
    currentState: ShapeStates;
    drawShape: (canvasRef: React.RefObject<HTMLCanvasElement>) => void;
    moveShape: (dx: number, dy: number) => void;
}

export enum ShapeStates {
    Normal = 'normal',
    Selected = 'selected',
    Pressed = 'pressed'
}

export const drawSmallSquare = (x: number, y: number, color: string, context: CanvasRenderingContext2D) => {
    const length = CONSTANTS.controlSquareLength;
    context.fillStyle = color;
    context.fillRect(x - length / 2, y - length / 2, length, length);
}