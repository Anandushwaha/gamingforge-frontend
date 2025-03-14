// Gun Cursor JavaScript - Add this to your website's JavaScript file

// DOM references
let cursor;
let gameArea;
let cursorX = 0;
let cursorY = 0;
let actualMouseX = 0;
let actualMouseY = 0;
const cursorFollowSpeed = 0.2; // Lag effect (0-1)

// Initialize the gun cursor
function initGunCursor() {
  // Create cursor elements
  cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.innerHTML = `
        <div class="cursor-gun">
            <div class="gun-body"></div>
            <div class="gun-barrel"></div>
            <div class="gun-handle"></div>
            <div class="gun-sight"></div>
        </div>
    `;

  // Add cursor to body
  document.body.appendChild(cursor);
  gameArea = document.body;

  // Set up event listeners
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("click", handleClick);

  // Start animation loop
  requestAnimationFrame(gameLoop);
}

// Handle mouse movement
function handleMouseMove(e) {
  actualMouseX = e.clientX;
  actualMouseY = e.clientY;
}

// Game loop for cursor movement
function gameLoop() {
  // Update cursor position with lag effect
  cursorX += (actualMouseX - cursorX) * cursorFollowSpeed;
  cursorY += (actualMouseY - cursorY) * cursorFollowSpeed;

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;

  requestAnimationFrame(gameLoop);
}

// Handle click to shoot
function handleClick(e) {
  // Don't shoot when clicking on links or buttons
  if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
    return;
  }

  const clickX = e.clientX;
  const clickY = e.clientY;

  // Calculate angle from gun to click position
  const angle = Math.atan2(clickY - cursorY, clickX - cursorX);

  // Create bullet
  createBullet(cursorX, cursorY, angle);

  // Create muzzle flash
  createMuzzleFlash(cursorX, cursorY, angle);
}

// Create a bullet
function createBullet(x, y, angle) {
  const bullet = document.createElement("div");
  const bulletTrail = document.createElement("div");
  bulletTrail.className = "bullet-trail";
  bullet.className = "bullet";
  bullet.appendChild(bulletTrail);

  // Position bullet
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  bullet.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

  // Add to DOM
  gameArea.appendChild(bullet);

  // Animation variables
  const startTime = performance.now();
  const bulletSpeed = 1000; // pixels per second
  const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
  const velocityX = Math.cos(angle) * bulletSpeed;
  const velocityY = Math.sin(angle) * bulletSpeed;

  // Animation function
  function animateBullet(timestamp) {
    const elapsed = (timestamp - startTime) / 1000; // seconds

    // Calculate new position
    const newX = x + velocityX * elapsed;
    const newY = y + velocityY * elapsed;

    // Update position
    bullet.style.left = `${newX}px`;
    bullet.style.top = `${newY}px`;

    // Remove if off-screen or if traveled max distance
    const distance = Math.sqrt(Math.pow(newX - x, 2) + Math.pow(newY - y, 2));
    if (
      distance > maxDistance ||
      newX < 0 ||
      newX > window.innerWidth ||
      newY < 0 ||
      newY > window.innerHeight
    ) {
      if (bullet.parentNode) {
        gameArea.removeChild(bullet);
      }
      return;
    }

    requestAnimationFrame(animateBullet);
  }

  requestAnimationFrame(animateBullet);
}

// Create muzzle flash
function createMuzzleFlash(x, y, angle) {
  const flash = document.createElement("div");
  flash.className = "muzzle-flash";

  // Position at barrel tip
  const barrelLength = 30;
  const flashX = x + Math.cos(angle) * barrelLength;
  const flashY = y + Math.sin(angle) * barrelLength;

  flash.style.left = `${flashX}px`;
  flash.style.top = `${flashY}px`;

  // Add to DOM
  gameArea.appendChild(flash);

  // Animation
  flash.style.opacity = "1";

  // Remove after animation
  setTimeout(() => {
    flash.style.opacity = "0";
    setTimeout(() => {
      if (flash.parentNode) {
        gameArea.removeChild(flash);
      }
    }, 200);
  }, 50);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initGunCursor);
