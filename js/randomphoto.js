
// Event listener for the 'New Photo' button
document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('button-random');
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      // TODO: Add logic to fetch and display a new random photo
      console.log('Random Photo button clicked');
    });
  }
});
