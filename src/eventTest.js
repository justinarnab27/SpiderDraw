// Click event
const clickEvent = new MouseEvent("click", {
    clientX: 104,
    clientY: 139,
  	bubbles: true,
    cancelable: true
  });
document.getElementById('canvas').dispatchEvent(clickEvent);

// MouseMove event
const mouseDownEvent = new MouseEvent("mousedown", {
    clientX: 104,
    clientY: 139,
  	bubbles: true,
    cancelable: true
  });
  document.getElementById('canvas').dispatchEvent(mouseDownEvent);
const mouseMoveEvent = new MouseEvent("mousemove", {
    clientX: 204,
    clientY: 239,
  	bubbles: true,
    cancelable: true
  });
document.getElementById('canvas').dispatchEvent(mouseMoveEvent);