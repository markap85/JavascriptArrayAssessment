

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
    console.log('Button reset to: Add to Collection');
  }

  function setAddButtonToAdded() {
    addBtn.textContent = 'Added';
    addBtn.dataset.added = 'already';
    addBtn.classList.add('already-in-library');
    console.log('Button set to: Added (disabled)');
  }

  function checkButtonState() {
    const img = document.querySelector('.primary-container img');
    const dropdown = document.querySelector('.collections-dropdown');
    const selectedEmail = dropdown?.value || window.lastCreatedEmail;
    const imageId = img?.getAttribute('data-picsum-id');
    
    if (!selectedEmail || !imageId || !window.emailCollections[selectedEmail]) {
      resetAddButton();
      return;
    }
    
    // Check if image is already in the selected collection
    const collection = window.emailCollections[selectedEmail];
    if (collection.includes(imageId)) {
      setAddButtonToAdded();
    } else {
      resetAddButton();
    }
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
    
    // Check if image is already in this collection
    if (collection.includes(imageId)) {
      console.log(`Image ${imageId} already exists in ${selectedEmail}`);
      setAddButtonToAdded();
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
    
    // Check if already added to current collection
    const collection = window.emailCollections[selectedEmail];
    if (collection && collection.includes(imageId)) {
      console.log(`Image ${imageId} already in collection ${selectedEmail}`);
      return; // Don't do anything if already added
    }
    
    addBtn.textContent = 'Adding...';
    addBtn.dataset.added = 'true';
    addImageToCollection(imageId, selectedEmail);
  });

  // Hook into the global updateCollectionsSection function to check button state
  if (typeof window.updateCollectionsSection === 'function') {
    const originalUpdate = window.updateCollectionsSection;
    window.updateCollectionsSection = function(forceSelectEmail) {
      const result = originalUpdate.call(this, forceSelectEmail);
      // Check button state after collections are updated
      setTimeout(checkButtonState, 100);
      return result;
    };
  }

  // Reset button when random photo is clicked
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      resetAddButton();
      // Check state after a brief delay to allow image to load
      setTimeout(checkButtonState, 100);
    });
  }

  // Check button state when dropdown changes (need to listen for dropdown changes)
  document.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('collections-dropdown')) {
      checkButtonState();
    }
  });

  // Listen for when collections are updated
  const dropdown = document.querySelector('.collections-dropdown');
  if (dropdown) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Dropdown content or selection changed, check button state
          setTimeout(checkButtonState, 50);
        }
      });
    });
    
    observer.observe(dropdown, {
      childList: true,
      attributes: true,
      attributeFilter: ['value']
    });
  }

  // Also listen for when the dropdown is replaced (in updateCollectionsSection)
  const collectionsSection = document.querySelector('.Collections');
  if (collectionsSection) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          // Check if a new dropdown was added
          const newDropdown = collectionsSection.querySelector('.collections-dropdown');
          if (newDropdown && !newDropdown.hasAttribute('data-observed')) {
            newDropdown.setAttribute('data-observed', 'true');
            setTimeout(checkButtonState, 50);
          }
        }
      });
    });
    
    observer.observe(collectionsSection, {
      childList: true,
      subtree: true
    });
  }

  // Initial button state check
  setTimeout(checkButtonState, 100);
});
