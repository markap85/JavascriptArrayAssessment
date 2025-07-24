

// Helper to set a new random image by fetching metadata first
function setRandomPhoto() {
  // Fetch a large list of images and pick a random one
  const page = Math.floor(Math.random() * 10) + 1;
  fetch('https://picsum.photos/v2/list?page=' + page + '&limit=100')
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const photo = data[Math.floor(Math.random() * data.length)];
        const img = document.querySelector('.container img');
        const imageNameElement = document.getElementById('imagename');
        
        if (img) {
          img.src = `https://picsum.photos/id/${photo.id}/800/600`;
          img.setAttribute('data-picsum-id', photo.id);
        }
        
        // Update the image name/description with metadata
        if (imageNameElement) {
          imageNameElement.textContent = `Photo by ${photo.author}`;
        }
      }
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('button-random');
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      setRandomPhoto();
    });
  }

  // Set a random photo on page load if needed
  const img = document.querySelector('.container img');
  if (img && !img.hasAttribute('data-picsum-id')) {
    setRandomPhoto();
  }
});
