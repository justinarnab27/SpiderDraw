import { ControlStates, ShapeStates } from "./shape";
import { CursorStates } from "./state";

export function getCursorTypeForControls(controlState: ControlStates): CursorStates {
    switch (controlState) {
        case ControlStates.East:
            return CursorStates.RESIZE_E;
        case ControlStates.West:
            return CursorStates.RESIZE_W;
        case ControlStates.South:
            return CursorStates.RESIZE_S;
        case ControlStates.North:
            return CursorStates.RESIZE_N;
        case ControlStates.NorthEast:
            return CursorStates.RESIZE_NE;
        case ControlStates.NorthWest:
            return CursorStates.RESIZE_NW
        case ControlStates.SouthEast:
            return CursorStates.RESIZE_SE;
        case ControlStates.SouthWest:
            return CursorStates.RESIZE_SW;
        default:
            return CursorStates.Default;
    }
}

export function getShapeStatesForControlStates(controlState: ControlStates): ShapeStates {
    switch (controlState) {
        case ControlStates.East:
            return ShapeStates.PressedControlE;
        case ControlStates.West:
            return ShapeStates.PressedControlW;
        case ControlStates.South:
            return ShapeStates.PressedControlS;
        case ControlStates.North:
            return ShapeStates.PressedControlN;
        case ControlStates.NorthEast:
            return ShapeStates.PressedControlNE;
        case ControlStates.NorthWest:
            return ShapeStates.PressedControlNW;
        case ControlStates.SouthEast:
            return ShapeStates.PressedControlSE;
        case ControlStates.SouthWest:
            return ShapeStates.PressedControlSW;
        default:
            return ShapeStates.Normal;
    }
}