import { CONSTANTS } from "./constants";

export interface Shape {
    id: number;
    // checks if the cursor is witin the shape (including whether it is on the control points)
    checkIfCursorWithin: (mouseX: number, mouseY: number) => boolean;
    // checks if the cursor is on the shape controls and returns the corresponding Controls State
    // Returns None state if cursor is not any control point
    getControlCursorIsOn: (mouseX: number, mouseY: number) => ControlStates;
    currentState: ShapeStates;
    drawShape: (canvasRef: React.RefObject<HTMLCanvasElement>) => void;
    // moves the shape when mouse is displaced by dx, dy
    moveShape: (dx: number, dy: number) => void;
    // resizes the shape in a certain direction (East, West, SouthEast etc.), when
    // mouse is displaced by dx and dy
    resizeShape: (dx: number, dy: number, direction: ShapeStates) => void;
}

export enum ShapeStates {
    // Possible states shape can be in
    Normal = 'normal',
    Selected = 'selected',
    Pressed = 'pressed',
    PressedControlE = 'pressed_control_E',
    PressedControlW = 'pressed_control_W',
    PressedControlN = 'pressed_control_N',
    PressedControlS = 'pressed_control_S',
    PressedControlSE = 'pressed_control_SE',
    PressedControlSW = 'pressed_control_SW',
    PressedControlNE = 'pressed_control_NE',
    PressedControlNW = 'pressed_control_NW',
    DEBUGGING = 'debugging',
}

export enum ControlStates {
    // which control point the cursor is on
    East = 'east',
    West = 'west',
    North = 'north',
    South = 'south',
    NorthEast = 'north-east',
    NorthWest = 'north-west',
    SouthEast = 'south-east',
    SouthWest = 'south-west',
    None = 'not_on_controls',
}

export const drawSmallSquare = (x: number, y: number, color: string, context: CanvasRenderingContext2D) => {
    const length = CONSTANTS.controlSquareLength;
    context.fillStyle = color;
    context.fillRect(x - length / 2, y - length / 2, length, length);
}