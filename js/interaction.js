"use strict";

let isDragging = false;
let offsetX, offsetY;

const audioControls = document.getElementById('audio-controls');

audioControls.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - audioControls.getBoundingClientRect().left;
    offsetY = e.clientY - audioControls.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        // Ensure the audio controls stay within the viewport
        left = Math.min(window.innerWidth - audioControls.clientWidth, Math.max(0, left));
        top = Math.min(window.innerHeight - audioControls.clientHeight, Math.max(0, top));

        audioControls.style.left = left + 'px';
        audioControls.style.top = top + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
