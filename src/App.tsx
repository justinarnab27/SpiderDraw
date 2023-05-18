import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Rectangle from './rectangle';
import {ControlStates, ShapeStates} from './shape';
import { CursorStates, State } from './state';
import { getCursorTypeForControls, getShapeStatesForControlStates } from './utility';

function App() {
  const boardState = useRef<State>(new State());
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    function processCanvasMouseMove(e: MouseEvent): void {
      console.log("Move");
      let [mouseX, mouseY] = getMouseCoordinate(e);
      // If mouse is moved while being in a pressed state, the shape is moved
      // the displacement is the change is mouse position 
      // records current mouse position afterwards
      if (boardState.current.lastMousePos !== null && boardState.current.currentPressedState !== null) {
        let dx = mouseX - boardState.current.lastMousePos[0];
        let dy = mouseY - boardState.current.lastMousePos[1];
        boardState.current.moveShape(boardState.current.currentPressedState, dx, dy);
        boardState.current.lastMousePos = [mouseX, mouseY];
      }
      

      // If mouse is moved while in resized pressed state, resize the shape
      // records the mouse position afterwards
      if (boardState.current.lastMousePos !== null && boardState.current.currentResizeState !== null) {
        let dx = mouseX - boardState.current.lastMousePos[0];
        let dy = mouseY - boardState.current.lastMousePos[1];
        boardState.current.resizeShape(boardState.current.currentResizeState,
                                        dx,
                                        dy,
                                        boardState.current.shapesArray[boardState.current.currentResizeState].currentState);
        boardState.current.lastMousePos = [mouseX, mouseY];
      }



      setRenderCount((val) => val + 1);
    }
    function processCanvasMouseUp(e: MouseEvent) {
      if (!boardState.current.isMouseDown) return;     // Ensures the mouse up event isn't processed multiple times
      console.log("Up!");
      boardState.current.isMouseDown = false;
      boardState.current.disableClickAfterMouseUp = true;    // Disables the click right after mouseup

      // Reverse resize state if there is resize shape
      // reverts back the mouse cursor type
      if (boardState.current.currentResizeState !== null) {
        console.log("POOPO");
        boardState.current.modifyShapeState(boardState.current.currentResizeState, ShapeStates.Selected);
        boardState.current.currentSelectedShape = boardState.current.currentResizeState;
        boardState.current.currentResizeState = null;
        boardState.current.cursorType = CursorStates.Default;
      }


      // Reverse pressed state (on mousedown) if there is a pressed shape
      if (boardState.current.currentPressedState !== null) {
        console.log("XYXYXY");
        boardState.current.modifyShapeState(boardState.current.currentPressedState, 
                                            ShapeStates.Selected);
        boardState.current.currentSelectedShape = boardState.current.currentPressedState;
        boardState.current.currentPressedState = null;
      }
      setRenderCount((val) => val + 1);
    }
    document.addEventListener("mousemove", processCanvasMouseMove);
    document.addEventListener("mouseup", processCanvasMouseUp);
    return () => document.removeEventListener("mousemove", processCanvasMouseMove);
  }) 

  useEffect(() => {
    const drawAllShapes = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        boardState.current.shapesArray.forEach(
          (shape) => shape.drawShape(canvasRef)
        )
      }
    }
    drawAllShapes();
  }, [renderCount])
  

  const getMouseCoordinate = (e: React.MouseEvent | MouseEvent): [number, number] => {
    const canvas = canvasRef.current;
    let rect = canvas?.getBoundingClientRect();
    let mouseX = 0;
    let mouseY = 0;
    if (rect && rect.left && rect?.top) {
      mouseX = e.clientX - rect?.left;
      mouseY = e.clientY - rect?.top;
    }
    return [mouseX, mouseY];
  }


  const processCanvasClick = (e: React.MouseEvent) => {
    console.log("Click!");
    // Ensures there is no click event right after mouseup event
    if (boardState.current.disableClickAfterMouseUp === true) {
      boardState.current.disableClickAfterMouseUp = false;
      return;
    }
    let [mouseX, mouseY]= getMouseCoordinate(e);
    const shapeCursorIsOn = boardState.current.shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY)).at(-1)?.id;
    if (boardState.current.currentSelectedShape !== null) {
      boardState.current.modifyShapeState(boardState.current.currentSelectedShape,
                                          ShapeStates.Normal);
      boardState.current.currentSelectedShape = null;
    }
    if (shapeCursorIsOn !== undefined) {
      boardState.current.modifyShapeState(shapeCursorIsOn, ShapeStates.Selected);
      boardState.current.currentSelectedShape = shapeCursorIsOn;
    }
    setRenderCount((val) => val + 1);
  }

  const processCanvasMouseDown = (e: React.MouseEvent) => {
    console.log("Down!");
    boardState.current.isMouseDown = true;
    if (e.button !== 0) return;     // Ensures that only left mouse downs are considered
    let [mouseX, mouseY]= getMouseCoordinate(e);


    // If there is a selected shape and cursor is on one of its controls,
    // change the state to one of the resize states also remove selection
    // also changed the cursor type to a resize one
    if (boardState.current.currentSelectedShape !== null) {
      let controlCursorType = boardState.current.shapesArray[boardState.current.currentSelectedShape]
                .getControlCursorIsOn(mouseX, mouseY);
      if (controlCursorType !== ControlStates.None) {
        boardState.current.modifyShapeState(boardState.current.currentSelectedShape, getShapeStatesForControlStates(controlCursorType));
        boardState.current.currentResizeState = boardState.current.currentSelectedShape;
        boardState.current.currentSelectedShape = null;
        boardState.current.cursorType = getCursorTypeForControls(controlCursorType);
        boardState.current.lastMousePos = [mouseX, mouseY];
        setRenderCount((val) => val + 1);
        return;
      }
    }



    const shapeCursorIsOn = boardState.current.shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY)).at(-1)?.id;
    // Removes all previous selections (whether it is the shape cursor is on or some other shape)
    if (boardState.current.currentSelectedShape !== null) {
      boardState.current.modifyShapeState(boardState.current.currentSelectedShape,
                                          ShapeStates.Normal);
      boardState.current.currentSelectedShape = null;
    }
    // If the cursor is on a shape, then change shapes state to Pressed, and
    // record the mouse position
    if (shapeCursorIsOn !== undefined) {
      boardState.current.currentPressedState = shapeCursorIsOn;
      boardState.current.modifyShapeState(shapeCursorIsOn, ShapeStates.Pressed);
    }

    boardState.current.lastMousePos = [mouseX, mouseY];
    setRenderCount((val) => val + 1);
  }

  const changeCursorOnHover = (e: React.MouseEvent) => {
    console.log("hover");
    let [mouseX, mouseY]= getMouseCoordinate(e);
    // Skips all below if the cursor is in resize state
    if (boardState.current.currentResizeState !== null) return;
    // If there is a selected shape, then if cursor is on its control points, then 
    // cursor should be changed to resizing cursors
    if (boardState.current.currentSelectedShape !== null) {
      let controlCursorType = boardState.current.shapesArray[boardState.current.currentSelectedShape]
                .getControlCursorIsOn(mouseX, mouseY);
      if (controlCursorType !== ControlStates.None) {
        boardState.current.cursorType = getCursorTypeForControls(controlCursorType);
        return;
      }
    }
    // If there is no selected shape or if cursor not on control points of selected shape then
    // cursor should be either move or default depending on whether it is on the shape
    const shapesCursorIsOn = boardState.current.shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY));
    boardState.current.cursorType = shapesCursorIsOn.length > 0 ? CursorStates.Move : CursorStates.Default;
  }

  return (
    <div
      id='container'
      onMouseMove={ (e) => {
        changeCursorOnHover(e);
      }}
      >
      <h1>SpiderPad</h1>
      <canvas 
        id="canvas"
        width="1200"
        height="600"
        
        onClick = {(e) => processCanvasClick(e)}
        onMouseDown = {(e) => processCanvasMouseDown(e)}
        style = {{cursor: boardState.current.cursorType}}
        ref={canvasRef}/>
      <div className='controls'>
        <button onClick={() => {
          boardState.current.shapesArray.push(new Rectangle(boardState.current.shapeCount, 0, 0, 100, 100, canvasRef));
          setRenderCount(val => val + 1);
          boardState.current.shapeCount++;}}>
          Box
        </button>
      </div>
    </div>
  );
}

export default App;
