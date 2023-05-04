import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Rectangle from './rectangle';
import {Shape, ShapeStates} from './shape';

function App() {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const [shapesArray, setShapesArray] = useState<Shape[]>([]);
  const [cursorType, setCursorType] = useState<string>("default");
  const [currentSelectedShape, setCurrentSelectedShape] = useState<number | null>(null);
  const [lastMousePos, setLastMousePos] = useState<[number, number] | null>(null);
  const [renderCount, setRenderCount] = useState<number>(0);
  const [currentPressedState, setCurrentPressedState] = useState<number | null>(null);
  const [shapeCount, setShapeCount] = useState<number>(1);

  const modifyShapeState = useCallback((id: number, newState: ShapeStates, arr: Shape[]): Shape[] => {
    let shapeArrayCopy = arr.slice();
    for (let [ix, shape] of shapeArrayCopy.entries()) {
      if (shape.id === id) {
        shapeArrayCopy[ix].currentState = newState;
      }
    }
    return shapeArrayCopy;
  }, [])

  const moveShape = (id: number, dx: number, dy: number, arr: Shape[]): Shape[] => {
    let shapeArrayCopy = arr.slice();
    for (let [ix, shape] of shapeArrayCopy.entries()) {
      if (shape.id === id) {
        shapeArrayCopy[ix].moveShape(dx, dy);
      }
    }
    return shapeArrayCopy;
  } 

  useEffect(() => {
    function processCanvasMouseMove(e: MouseEvent): void {
      let [mouseX, mouseY] = getMouseCoordinate(e);
      if (lastMousePos !== null && currentPressedState !== null) {
        let dx = mouseX - lastMousePos[0];
        let dy = mouseY - lastMousePos[1];
        // console.log("HHHHH", mouseX, mouseY);
        setShapesArray(moveShape(currentPressedState, dx, dy, shapesArray));
        setLastMousePos([mouseX, mouseY]);
      }
      setRenderCount((val) => val + 1);
    }
    function processCanvasMouseUp() {
      if (currentPressedState) {
        // console.log(currentPressedState);
        setShapesArray(arr => modifyShapeState(currentPressedState, ShapeStates.Normal, arr));
        setCurrentSelectedShape(currentPressedState);
        setCurrentPressedState(null);
      }
    }
    document.addEventListener("mousemove", processCanvasMouseMove);
    document.addEventListener("mouseup", processCanvasMouseUp);
    return () => document.removeEventListener("mousemove", processCanvasMouseMove);
  }, [shapesArray, lastMousePos, modifyShapeState, currentPressedState])

  useEffect(() => {
    const drawAllShapes = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        shapesArray.forEach(
          (shape) => shape.drawShape(canvasRef)
        )
      }
    }
    drawAllShapes();
  }, [shapesArray, renderCount])
  

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

  const printMouseCoordinate = (e: React.MouseEvent) => {
    let [mouseX, mouseY]= getMouseCoordinate(e);
    if (shapesArray.length > 0) {
      shapesArray[0].checkIfCursorWithin(mouseX, mouseY, setCursorType);
    }
  } 

  

  const processCanvasClick = (e: React.MouseEvent) => {
    let [mouseX, mouseY]= getMouseCoordinate(e);
    const shapeCursorIsOn = shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY, setCursorType)).at(-1)?.id;
    if (currentSelectedShape) {
      // console.log("FFF");
      setShapesArray(arr => modifyShapeState(currentSelectedShape, ShapeStates.Normal, arr));
      // console.log(currentSelectedShape);
      setCurrentSelectedShape(null);
    }
    if (shapeCursorIsOn !== undefined) {
      setShapesArray(arr => modifyShapeState(shapeCursorIsOn, ShapeStates.Selected, arr));
      setCurrentSelectedShape(shapeCursorIsOn);
    }
    setRenderCount((val) => val + 1);
  }

  const processCanvasMouseDown = (e: React.MouseEvent) => {
    let [mouseX, mouseY]= getMouseCoordinate(e);
    const shapeCursorIsOn = shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY, setCursorType)).at(-1)?.id;
    if (currentSelectedShape) {
      setShapesArray(arr => modifyShapeState(currentSelectedShape, ShapeStates.Normal, arr));
      setCurrentSelectedShape(null);
    }
    if (shapeCursorIsOn !== undefined) {
      setCurrentPressedState(shapeCursorIsOn);
      setShapesArray(arr => modifyShapeState(shapeCursorIsOn, ShapeStates.Pressed, arr));
      setLastMousePos([mouseX, mouseY]);
    }
    setRenderCount((val) => val + 1);
  }

  const createShapeId = () : number =>  {
    let x = shapeCount;
    console.log(x);
    setShapeCount((c) => c + 1);
    console.log(shapeCount);
    return x;
  }

  return (
    <div
      id='container'
      onMouseMove={ (e) => {
        printMouseCoordinate(e);
      }}
      >
      <h1>SpiderPad</h1>
      <canvas 
        id="canvas"
        width="1200"
        height="600"
        
        onClick = {(e) => processCanvasClick(e)}
        onMouseDown = {(e) => processCanvasMouseDown(e)}
        style = {{cursor: cursorType}}
        ref={canvasRef}/>
      <div className='controls'>
        <button onClick={() => {
          setShapesArray((s) => [...s, new Rectangle(createShapeId(), 0, 0, 100, 100, canvasRef)])}}>
          Box
        </button>
      </div>
    </div>
  );
}

export default App;
