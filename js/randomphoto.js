// Random Photo Generator
async function setRandomPhoto() {
  const randomBtn = document.getElementById('button-random');
  const img = document.querySelector('.primary-container img');
  const imageNameElement = document.getElementById('imagename');
  
  if (!randomBtn || !img) return;

  randomBtn.textContent = 'Loading...';

  try {
    // Fetch random photo data
    const page = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
    const photos = await response.json();

    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error('No photos available');
    }

    // Select random photo
    const photo = photos[Math.floor(Math.random() * photos.length)];
    
    // Update image with loading handlers
    img.onload = () => {
      randomBtn.textContent = 'Random Photo';
      // Update add button state after image loads
      window.checkAddButtonState?.();
      // Clear add button loading state
      window.clearAddButtonLoading?.();
    };
    
    img.onerror = () => {
      randomBtn.textContent = 'Random Photo';
      console.error('Failed to load image');
      // Clear add button loading state
      window.clearAddButtonLoading?.();
    };

    // Set new image
    img.src = `https://picsum.photos/id/${photo.id}/800/600`;
    img.setAttribute('data-picsum-id', photo.id);
    
    // Update photo credit
    if (imageNameElement) {
      imageNameElement.textContent = `Photo by ${photo.author}`;
    }

  } catch (error) {
    console.error('Error fetching photo:', error);
    randomBtn.textContent = 'Random Photo';
    // Clear add button loading state
    window.clearAddButtonLoading?.();
  }
}

// Initialize random photo functionality
document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('button-random');
  const img = document.querySelector('.primary-container img');

  // Add click handler
  if (randomBtn) {
    randomBtn.addEventListener('click', setRandomPhoto);
  }

  // Load initial random photo if none exists
  if (img && !img.hasAttribute('data-picsum-id')) {
    setRandomPhoto();
  }
});
