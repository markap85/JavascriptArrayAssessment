

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
          // Show a visible error message in the element with id add-warning
          const warningElem = document.getElementById('add-warning');
          if (warningElem) {
            warningElem.textContent = 'Please select or create a collection first.';
            warningElem.style.color = '#dc2626';
            warningElem.style.background = '#fee2e2'; // soft red
            warningElem.style.borderRadius = '5px';
            warningElem.style.padding = '0.5rem 1rem';
            warningElem.style.marginTop = '0.5rem';
            warningElem.style.marginBottom = '0.5rem';
            warningElem.style.transition = 'color 0.3s ease';
            setTimeout(function() {
              warningElem.style.color = 'transparent';
              warningElem.style.backgroundColor = 'transparent';
              warningElem.style.borderRadius = '5px';
              warningElem.style.padding = '0.5rem 1rem';
              warningElem.style.marginTop = '0.5rem';
              warningElem.style.marginBottom = '0.5rem';
              warningElem.style.transition = 'color 0.3s ease';
              warningElem.textContent = 'Placeholder text'; // Reset to placeholder text after 2 seconds
            }, 2000);
          }
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
