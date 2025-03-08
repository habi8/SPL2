const sky = document.querySelector('.water');

let activeStar = null;
let offsetX = 0;
let offsetY = 0;

// Create 100 stars dynamically
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.classList.add('pearl');

    const randomTop = Math.random() * 95; 
    const randomLeft = Math.random() * 95; 
    const randomSize = Math.random() * 3 + 2; 
    const randomDuration = Math.random() * 2 + 1; 

    star.style.top = `${randomTop}%`;
    star.style.left = `${randomLeft}%`;
    star.style.width = `${randomSize}px`;
    star.style.height = `${randomSize}px`;
    star.style.animationDuration = `${randomDuration}s`;

    // Add mouse listeners for dragging
    star.addEventListener('mousedown', (e) => {
        activeStar = star;
        offsetX = e.clientX - star.getBoundingClientRect().left;
        offsetY = e.clientY - star.getBoundingClientRect().top;
        star.style.transition = 'none'; 
    });

    sky.appendChild(star);
}

// Listen for mouse movement
document.addEventListener('mousemove', (e) => {
    if (activeStar) {
        const skyRect = sky.getBoundingClientRect();
        let newLeft = e.clientX - skyRect.left - offsetX;
        let newTop = e.clientY - skyRect.top - offsetY;

        // Keep the stars within the sky container
        newLeft = Math.min(Math.max(newLeft, 0), skyRect.width);
        newTop = Math.min(Math.max(newTop, 0), skyRect.height);

        activeStar.style.left = `${newLeft}px`;
        activeStar.style.top = `${newTop}px`;
    }
});

// Release star when mouse button is released
document.addEventListener('mouseup', () => {
    activeStar = null;
});
