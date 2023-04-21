import { Dispatch, SetStateAction } from "react";

export interface Shape {
    checkIfCursorWithin: (mouseX: number, mouseY: number, setCursorType: Dispatch<SetStateAction<string>>) => boolean;
    currentState: ShapeStates;
    drawShape: (canvasRef: React.RefObject<HTMLCanvasElement>) => void;
    moveShape: (dx: number, dy: number) => void;
}

export enum ShapeStates {
    Normal = 'normal',
    Selected = 'selected',
    Pressed = 'pressed'
}