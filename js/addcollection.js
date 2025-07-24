

// Assumes emailCollections and lastCreatedEmail are available globally
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.getElementById('button-add');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      // Find the image element in the same container as the button
      const container = addBtn.closest('.container');
      const img = container ? container.querySelector('img') : null;
      if (img && window.emailCollections && window.lastCreatedEmail) {
        const imgUrl = img.src;
        const arr = window.emailCollections[window.lastCreatedEmail];
        if (arr) {
          arr.push(imgUrl);
          console.log(`Added image to ${window.lastCreatedEmail}: ${imgUrl}`);
          if (typeof window.updateCollectionsSection === 'function') {
            window.updateCollectionsSection();
          }
        } else {
          console.log('No array found for last created email.');
        }
      } else {
        console.log('No image or email array available.');
      }
    });
  }
});
