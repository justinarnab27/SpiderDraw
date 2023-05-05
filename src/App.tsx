import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Rectangle from './rectangle';
import {ShapeStates} from './shape';
import { State } from './state';

function App() {
  const boardState = useRef<State>(new State());
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    function processCanvasMouseMove(e: MouseEvent): void {
      console.log(renderCount);
      let [mouseX, mouseY] = getMouseCoordinate(e);
      if (boardState.current.lastMousePos !== null && boardState.current.currentPressedState !== null) {
        let dx = mouseX - boardState.current.lastMousePos[0];
        let dy = mouseY - boardState.current.lastMousePos[1];
        boardState.current.moveShape(boardState.current.currentPressedState, dx, dy);
        boardState.current.lastMousePos = [mouseX, mouseY];
      }
      setRenderCount((val) => val + 1);
    }
    function processCanvasMouseUp(e: MouseEvent) {
      // console.log("UUUU" , renderCount);
      if (!boardState.current.isMouseDown) return;
      boardState.current.isMouseDown = false;
      if (boardState.current.currentPressedState !== null) {
        boardState.current.modifyShapeState(boardState.current.currentPressedState, 
                                            ShapeStates.Normal);
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
    // console.log("FFF: ", renderCount);
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
    // console.log("GGG");
    boardState.current.isMouseDown = true;
    if (e.button !== 0) return;
    let [mouseX, mouseY]= getMouseCoordinate(e);
    const shapeCursorIsOn = boardState.current.shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY)).at(-1)?.id;
    if (boardState.current.currentSelectedShape !== null) {
      boardState.current.modifyShapeState(boardState.current.currentSelectedShape,
                                          ShapeStates.Normal);
      boardState.current.currentSelectedShape = null;
    }
    if (shapeCursorIsOn !== undefined) {
      boardState.current.currentPressedState = shapeCursorIsOn;
      boardState.current.modifyShapeState(shapeCursorIsOn, ShapeStates.Pressed);
      boardState.current.lastMousePos = [mouseX, mouseY];
    }
    setRenderCount((val) => val + 1);
  }

  return (
    <div
      id='container'
      onMouseMove={ (e) => {
        // printMouseCoordinate(e);
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
