

// Assumes emailCollections and lastCreatedEmail are available globally
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.getElementById('button-add');
  const randomBtn = document.getElementById('button-random');
  
  if (!addBtn) return;

  // Helper functions
  function resetAddButton() {
    addBtn.textContent = 'Add to Collection';
    addBtn.dataset.added = '';
    addBtn.classList.remove('already-in-library');
  }

  function setAddButtonToAdded() {
    addBtn.textContent = 'Add again?';
    addBtn.dataset.added = 'already';
    addBtn.classList.add('already-in-library');
  }

  function showWarning(message) {
    const warningElem = document.getElementById('add-warning');
    if (!warningElem) return;
    
    warningElem.textContent = message;
    warningElem.className = 'warning-visible';
    
    setTimeout(() => {
      warningElem.className = 'warning-hidden';
      warningElem.textContent = 'Placeholder text';
    }, 2000);
  }

  function addImageToCollection(imageId, selectedEmail) {
    const collection = window.emailCollections[selectedEmail];
    if (!collection) {
      console.log('No array found for selected email.');
      return;
    }
    
    collection.push(imageId);
    console.log(`Added image id ${imageId} to ${selectedEmail}`);
    
    if (typeof window.updateCollectionsSection === 'function') {
      window.updateCollectionsSection();
    }
    
    setTimeout(setAddButtonToAdded, 2000);
  }

  // Add to collection click handler
  addBtn.addEventListener('click', function() {
    addBtn.textContent = 'Adding...';
    addBtn.dataset.added = 'true';
    
    const img = document.querySelector('.primary-container img');
    const dropdown = document.querySelector('.collections-dropdown');
    const selectedEmail = dropdown?.value || window.lastCreatedEmail;
    const imageId = img?.getAttribute('data-picsum-id');
    
    // Validate requirements
    if (!img || !window.emailCollections) {
      resetAddButton();
      console.log('No image or email array available.');
      return;
    }
    
    if (!selectedEmail) {
      showWarning('Please select or create a collection first.');
      resetAddButton();
      return;
    }
    
    if (!imageId) {
      resetAddButton();
      console.log('No image id found on image element.');
      return;
    }
    
    addImageToCollection(imageId, selectedEmail);
  });

  // Reset button when random photo is clicked
  if (randomBtn) {
    randomBtn.addEventListener('click', resetAddButton);
  }
});
