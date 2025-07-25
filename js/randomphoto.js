// Fetch Image Metadata First
async function setRandomPhoto() {
  const randomBtn = document.getElementById('button-random');
  const img = document.querySelector('.primary-container img');
  const imageNameElement = document.getElementById('imagename');
  if (!randomBtn || !img) return;

  randomBtn.textContent = 'Loading...';

  try {
    const page = Math.floor(Math.random() * 10) + 1;
    const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      const photo = data[Math.floor(Math.random() * data.length)];
      
      img.onload = () => { 
        randomBtn.textContent = 'Random Photo';
        // Trigger button state check after image is fully loaded
        if (typeof window.checkAddButtonState === 'function') {
          window.checkAddButtonState();
        }
      };
      img.onerror = () => { randomBtn.textContent = 'Random Photo'; };
      img.src = `https://picsum.photos/id/${photo.id}/800/600`;
      img.setAttribute('data-picsum-id', photo.id);
      if (imageNameElement) imageNameElement.textContent = `Photo by ${photo.author}`;
    } else {
      randomBtn.textContent = 'Random Photo';
    }
  } catch {
    randomBtn.textContent = 'Random Photo';
  }
}

// Main script to randomise image

document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('button-random');
  if (randomBtn) {
    randomBtn.addEventListener('click', setRandomPhoto);
  }

  // Set a random photo on page load
  const img = document.querySelector('.primary-container img');
  if (img && !img.hasAttribute('data-picsum-id')) {
    setRandomPhoto();
  }
});
