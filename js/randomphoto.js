
// Event listener for the 'New Photo' button
document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('button-random');
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      // Find the image element in the same container as the button
      const container = randomBtn.closest('.container');
      const img = container ? container.querySelector('img') : null;
      if (img) {
        // Add a random query param to force a new image
        img.src = 'https://picsum.photos/800/600?random=' + Date.now();
      }
    });
  }
});
