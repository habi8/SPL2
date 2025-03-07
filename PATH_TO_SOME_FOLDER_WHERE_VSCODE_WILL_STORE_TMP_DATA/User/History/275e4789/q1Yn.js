// Function to randomly position garbage items
function positionGarbage() {
    const garbageItems = document.querySelectorAll('.garbage');
    garbageItems.forEach(item => {
      const randomY = Math.random() * 20; // Random vertical position (within water level)
      const randomDelay = Math.random() * 10; // Random animation delay
      item.style.bottom = `${randomY}%`;
      item.style.animationDelay = `-${randomDelay}s`;
    });
  }
  
  // Call the function to position garbage items
  positionGarbage();