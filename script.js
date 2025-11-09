const pictures = document.querySelectorAll('.Picture, .Picture-video');
var previousTouch = undefined;

function updateElementPosition(element, event) {
    var movementX, movementY;

    if (event.type === 'touchmove') {
        const touch = event.touches[0];
        movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
        movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
        previousTouch = touch;
    } else {
        movementX = event.movementX;
        movementY = event.movementY;
    }

    // Get current position (parse from current style or use center position)
    const currentY = parseInt(element.style.top) || (window.innerHeight / 2);
    const currentX = parseInt(element.style.left) || (window.innerWidth / 2);

    const elementY = currentY + movementY;
    const elementX = currentX + movementX;

    element.style.top = elementY + "px";
    element.style.left = elementX + "px";
    
    // Remove the centering transform when dragging, keep only rotation
    const currentRotation = element.dataset.rotation || 0;
    element.style.transform = `rotate(${currentRotation}deg)`;
}

function startDrag(element, event) {
    event.preventDefault();
    const updateFunction = (event) => updateElementPosition(element, event);
    const stopFunction = () => stopDrag({ update: updateFunction, stop: stopFunction });
    
    document.addEventListener("mousemove", updateFunction);
    document.addEventListener("touchmove", updateFunction);
    document.addEventListener("mouseup", stopFunction);
    document.addEventListener("touchend", stopFunction);
}

function stopDrag(functions) {
    previousTouch = undefined;
    document.removeEventListener("mousemove", functions.update);
    document.removeEventListener("touchmove", functions.update);
    document.removeEventListener("mouseup", functions.stop);
    document.removeEventListener("touchend", functions.stop);
}

// Initialize all pictures with random rotation
pictures.forEach((picture, index) => {
    const randomRotate = Math.random() * 20 - 10; // -10 to 10 degrees
    
    // Store rotation in dataset for later use
    picture.dataset.rotation = randomRotate;
    
    // Apply initial rotation while keeping centered
    picture.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
    
    const startFunction = (event) => startDrag(picture, event);
    
    picture.addEventListener("mousedown", startFunction);
    picture.addEventListener("touchstart", startFunction);
    
    // Bring current picture to front when interacting
    picture.addEventListener("mousedown", () => {
        picture.style.zIndex = 1000;
    });
    
    picture.addEventListener("touchstart", () => {
        picture.style.zIndex = 1000;
    });
});
