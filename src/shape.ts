
export interface Shape {
    id: number;
    checkIfCursorWithin: (mouseX: number, mouseY: number) => boolean;
    currentState: ShapeStates;
    drawShape: (canvasRef: React.RefObject<HTMLCanvasElement>) => void;
    moveShape: (dx: number, dy: number) => void;
}

export enum ShapeStates {
    Normal = 'normal',
    Selected = 'selected',
    Pressed = 'pressed'
}