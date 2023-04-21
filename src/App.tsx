import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Rectangle from './rectangle';
import {Shape, ShapeStates} from './shape';

function App() {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const [shapesArray, setShapesArray] = useState<Shape[]>([]);
  const [cursorType, setCursorType] = useState<string>("default");
  const [currentSelectedShape, setCurrentSelectedShape] = useState<Shape | null>(null);
  const [lastMousePos, setLastMousePos] = useState<[number, number] | null>(null);
  const [renderCount, setRenderCount] = useState<number>(0);
  const [currentPressedState, setCurrentPressedState] = useState<Shape | null>(null);

  

  useEffect(() => {
    function processCanvasMouseMove(e: MouseEvent): void {
      let [mouseX, mouseY]= getMouseCoordinate(e);
      // const shapeInPressedState = shapesArray.filter((shape) =>
      //   shape.currentState === ShapeStates.Pressed).at(-1);
      if (lastMousePos !== null && currentPressedState !== null) {
        let dx = mouseX - lastMousePos[0];
        let dy = mouseY - lastMousePos[1];
        currentPressedState.moveShape(dx, dy);
        setLastMousePos([mouseX, mouseY]);
      }
      // if (lastMousePos !== null && shapeInPressedState !== undefined) {
      //   let dx = mouseX - lastMousePos[0];
      //   let dy = mouseY - lastMousePos[1];
      //   console.log(dx, dy);
      //   shapeInPressedState.moveShape(dx, dy);
      //   setLastMousePos([mouseX, mouseY]);
      // }

      setRenderCount((val) => val + 1);
    }
    function processCanvasMouseUp() {
      if (currentPressedState) {
        currentPressedState.currentState = ShapeStates.Selected;
        setCurrentSelectedShape(currentPressedState);
        setCurrentPressedState(null);
      }
    }
    document.addEventListener("mousemove", processCanvasMouseMove);
    document.addEventListener("mouseup", processCanvasMouseUp);
    return () => document.removeEventListener("mousemove", processCanvasMouseMove);
    // const draw = (ctx: CanvasRenderingContext2D) => {
    //   ctx.fillStyle = '#000000'
    //   ctx.beginPath()
    //   ctx.arc(50, 100, 20, 0, 2*Math.PI)
    //   ctx.fill()
    // }

    // const canvas = canvasRef.current;
    // const context = canvas?.getContext('2d');

    // if (context) {
    //   context.fillStyle = '#f00'
    //   // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    //   draw(context)
    // }

 
  }, [shapesArray, lastMousePos])

  useEffect(() => 
  {drawAllShapes();}, [shapesArray, renderCount])

  // const drawRect = () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas?.getContext('2d');
  //   if (context) {
  //     context.fillStyle = '#f00';
  //     context.fillRect(0, 0, 100, 100)
  //     setShapesArray([new Rectangle(0, 0, 100, 100)]);
  //   }
  // }

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
    // console.log("HI");
    // const canvas = canvasRef.current;
    // let rect = canvas?.getBoundingClientRect();
    // let mouseX = 0;
    // let mouseY = 0;
    // if (rect && rect.left && rect?.top) {
    //   mouseX = e.clientX - rect?.left;
    //   mouseY = e.clientY - rect?.top;
    // }
    let [mouseX, mouseY]= getMouseCoordinate(e);
    // console.log(rect1);
    if (shapesArray.length > 0) {
      // console.log("Bye");
      shapesArray[0].checkIfCursorWithin(mouseX, mouseY, setCursorType);
    }
    // console.log(mouseX, mouseY);
  } 

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context && canvas) {
      // console.log(shapesArray);
      // console.log("gg");
      context.clearRect(0, 0, canvas.width, canvas.height);
      shapesArray.forEach(
        (shape) => shape.drawShape(canvasRef)
      )
    }
  }

  const processCanvasClick = (e: React.MouseEvent) => {
    // console.log("Ente ISal");
    let [mouseX, mouseY]= getMouseCoordinate(e);
    const shapeCursorIsOn = shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY, setCursorType)).at(-1);
    // console.log(shapeCursorIsOn);
    if (currentSelectedShape) {
      currentSelectedShape.currentState = ShapeStates.Normal;
      setCurrentSelectedShape(null);
    }
    if (shapeCursorIsOn !== undefined) {
      shapeCursorIsOn.currentState = ShapeStates.Selected;
      setCurrentSelectedShape(shapeCursorIsOn);
    }
    setRenderCount((val) => val + 1);
  }

  const processCanvasMouseDown = (e: React.MouseEvent) => {
    let [mouseX, mouseY]= getMouseCoordinate(e);
    const shapeCursorIsOn = shapesArray.filter((shape) =>
       shape.checkIfCursorWithin(mouseX, mouseY, setCursorType)).at(-1);
    // console.log(shapeCursorIsOn);
    if (currentSelectedShape) {
      currentSelectedShape.currentState = ShapeStates.Normal;
      setCurrentSelectedShape(null);
    }
    if (shapeCursorIsOn !== undefined) {
      shapeCursorIsOn.currentState = ShapeStates.Pressed;
      setCurrentSelectedShape(shapeCursorIsOn);
      setCurrentPressedState(shapeCursorIsOn);
      setLastMousePos([mouseX, mouseY]);
    }
    setRenderCount((val) => val + 1);
  }

  

  return (
    <div
      id='container'
      onMouseMove={ (e) => {
        printMouseCoordinate(e);
      //   processCanvasMouseMove(e);
      //   drawAllShapes();
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
          setShapesArray([new Rectangle(0, 0, 100, 100, canvasRef)])}}>
          Box
        </button>
      </div>
    </div>
  );
}

export default App;
