

// Add to Collection functionality
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.getElementById('button-add');
  const randomBtn = document.getElementById('button-random');
  
  if (!addBtn) return;

  // Button state management
  function updateButtonState() {
    const img = document.querySelector('.primary-container img');
    const dropdown = document.querySelector('.collections-dropdown');
    const selectedEmail = dropdown?.value || window.lastCreatedEmail;
    const imageId = img?.getAttribute('data-picsum-id');
    
    // Reset to default if missing data
    if (!selectedEmail || !imageId || !window.emailCollections?.[selectedEmail]) {
      addBtn.textContent = 'Add to Collection';
      addBtn.classList.remove('already-in-library');
      return;
    }
    
    // Check if image is already in collection
    const isInCollection = window.emailCollections[selectedEmail].includes(imageId);
    addBtn.textContent = isInCollection ? 'Added' : 'Add to Collection';
    addBtn.classList.toggle('already-in-library', isInCollection);
  }

  // Make globally available for other scripts
  window.checkAddButtonState = updateButtonState;

  // Show warning message
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

  // Add image to collection
  addBtn.addEventListener('click', function() {
    const img = document.querySelector('.primary-container img');
    const dropdown = document.querySelector('.collections-dropdown');
    const selectedEmail = dropdown?.value || window.lastCreatedEmail;
    const imageId = img?.getAttribute('data-picsum-id');
    
    // Validation
    if (!selectedEmail) {
      showWarning('Please select or create a collection first.');
      return;
    }
    
    if (!imageId || !window.emailCollections?.[selectedEmail]) {
      console.log('Missing image ID or collection');
      return;
    }
    
    const collection = window.emailCollections[selectedEmail];
    
    // Don't add if already in collection
    if (collection.includes(imageId)) {
      return;
    }
    
    // Add to collection
    addBtn.textContent = 'Adding...';
    collection.push(imageId);
    console.log(`Added image ${imageId} to ${selectedEmail}`);
    
    // Update UI
    if (typeof window.updateCollectionsSection === 'function') {
      window.updateCollectionsSection();
    }
    
    setTimeout(() => {
      addBtn.textContent = 'Added';
      addBtn.classList.add('already-in-library');
    }, 1000);
  });

  // Event listeners for state changes
  document.addEventListener('change', function(e) {
    if (e.target?.classList.contains('collections-dropdown')) {
      updateButtonState();
    }
  });

  // Reset button on random photo click
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      addBtn.textContent = 'Add to Collection';
      addBtn.classList.remove('already-in-library');
    });
  }

  // Hook into collections update to refresh button state
  if (typeof window.updateCollectionsSection === 'function') {
    const originalUpdate = window.updateCollectionsSection;
    window.updateCollectionsSection = function(forceSelectEmail) {
      const result = originalUpdate.call(this, forceSelectEmail);
      setTimeout(updateButtonState, 100);
      return result;
    };
  }

  // Initial state check
  setTimeout(updateButtonState, 100);
});
