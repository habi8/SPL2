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

  // Function to create a ripple effect
function createRipple(event) {
    const ocean = document.querySelector('.ocean');
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
  
    // Position the ripple at the mouse pointer
    const rect = ocean.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left - 50}px`; // Center the ripple
    ripple.style.top = `${event.clientY - rect.top - 50}px`;
  
    ocean.appendChild(ripple);
  
    // Remove the ripple after the animation ends
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
  
  // Function to push the water on hover
  function pushWater(event) {
    const ocean = document.querySelector('.ocean');
    ocean.style.height = '35%'; // Increase water height slightly
  }
  
  // Function to reset the water height
  function resetWater() {
    const ocean = document.querySelector('.ocean');
    ocean.style.height = '30%'; // Reset water height
  }
  
  // Add event listeners
  const ocean = document.querySelector('.ocean');
  ocean.addEventListener('mousemove', createRipple);
  ocean.addEventListener('mouseenter', pushWater);
  ocean.addEventListener('mouseleave', resetWater);