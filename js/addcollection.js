
// Event listener for the 'New Photo' button
document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('button-add');
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      // TODO: Add logic to fetch and display a new random photo
      console.log('Add Photo button clicked');
    });
  }
});
