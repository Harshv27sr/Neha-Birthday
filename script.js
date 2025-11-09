const pictures = document.querySelectorAll('.Picture, .Picture-video');
var isDragging = false;
var currentElement = null;
var startX, startY, initialX, initialY;

// Initialize all pictures with random positions and rotations
function initializePictures() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    pictures.forEach((picture, index) => {
        // Get the actual dimensions of the picture
        const rect = picture.getBoundingClientRect();
        const pictureWidth = rect.width || 300;
        const pictureHeight = rect.height || 400;
        
        // Calculate random position around center
        // Use smaller range for mobile, larger for desktop
        const range = Math.min(window.innerWidth, window.innerHeight) * 0.15;
        const randomX = (Math.random() - 0.5) * range;
        const randomY = (Math.random() - 0.5) * range;
        const randomRotate = Math.random() * 30 - 15; // -15 to 15 degrees
        
        // Set initial position (account for element's own dimensions)
        picture.style.left = (centerX + randomX - pictureWidth/2) + 'px';
        picture.style.top = (centerY + randomY - pictureHeight/2) + 'px';
        picture.style.transform = `rotate(${randomRotate}deg)`;
        picture.style.zIndex = index + 1;
        
        // Add drag events
        addDragEvents(picture);
    });
}

function addDragEvents(element) {
    // Remove existing events first to avoid duplicates
    element.removeEventListener('mousedown', startDrag);
    element.removeEventListener('touchstart', startDrag);
    
    // Mouse events
    element.addEventListener('mousedown', startDrag);
    
    // Touch events
    element.addEventListener('touchstart', startDrag, { passive: false });
}

function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    currentElement = this;
    isDragging = true;
    
    // Bring to front
    const highestZ = Math.max(...Array.from(pictures).map(p => parseInt(p.style.zIndex) || 0));
    currentElement.style.zIndex = highestZ + 1;
    
    // Get initial positions
    if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else {
        startX = e.clientX;
        startY = e.clientY;
    }
    
    initialX = parseInt(currentElement.style.left) || 0;
    initialY = parseInt(currentElement.style.top) || 0;
    
    // Add move and end events
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchcancel', stopDrag);
}

function drag(e) {
    if (!isDragging || !currentElement) return;
    
    e.preventDefault();
    
    let currentX, currentY;
    
    if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    } else {
        currentX = e.clientX;
        currentY = e.clientY;
    }
    
    // Calculate new position
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    const newX = initialX + deltaX;
    const newY = initialY + deltaY;
    
    // Update position
    currentElement.style.left = newX + 'px';
    currentElement.style.top = newY + 'px';
}

function stopDrag() {
    isDragging = false;
    currentElement = null;
    
    // Remove event listeners
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    document.removeEventListener('touchcancel', stopDrag);
}

// Video autoplay handling
// Video autoplay handling (no “Tap to play” overlay)
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('birthdayVideo');
  if (!video) return;

  // Don’t autoplay immediately — wait for user tap
  video.muted = false;
  video.autoplay = false;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  // Add a one-time tap listener to start video with sound
  const startVideo = () => {
    video.play().catch(err => console.log('Play failed:', err));
    document.removeEventListener('click', startVideo);
    document.removeEventListener('touchstart', startVideo);
  };

  document.addEventListener('click', startVideo, { once: true });
  document.addEventListener('touchstart', startVideo, { once: true });

  // Initialize pictures after setup
  initializePictures();
});


// Handle window resize and orientation change
window.addEventListener('resize', initializePictures);
window.addEventListener('orientationchange', function() {
    setTimeout(initializePictures, 100);
});

// Prevent context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});
