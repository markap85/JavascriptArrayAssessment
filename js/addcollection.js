

// Assumes emailCollections and lastCreatedEmail are available globally
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.getElementById('button-add');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      // Find the image element in the same container as the button
      const container = addBtn.closest('.primary-container');
      const img = container ? container.querySelector('img') : null;
      if (img && window.emailCollections) {
        // Get selected email from dropdown
        const dropdown = document.querySelector('.collections-dropdown');
        const selectedEmail = dropdown ? dropdown.value : window.lastCreatedEmail;
        if (!selectedEmail) {
          console.log('No email selected.');
          return;
        }
        // Use the data-picsum-id attribute set by randomphoto.js
        const imageId = img.getAttribute('data-picsum-id');
        function addImageToCollection(id) {
          const arr = window.emailCollections[selectedEmail];
          if (arr) {
            arr.push(id);
            console.log(`Added image id ${id} to ${selectedEmail}`);
            if (typeof window.updateCollectionsSection === 'function') {
              window.updateCollectionsSection();
            }
          } else {
            console.log('No array found for selected email.');
          }
        }
        if (imageId) {
          addImageToCollection(imageId);
        } else {
          console.log('No image id found on image element.');
        }
      } else {
        console.log('No image or email array available.');
      }
    });
  }
});
