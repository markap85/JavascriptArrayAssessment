// Collections Management
window.emailCollections = {};
window.lastCreatedEmail = null;

document.addEventListener('DOMContentLoaded', function() {
  const deleteCollectionBtn = document.getElementById('button-delete-collection');
  const deleteAllBtn = document.getElementById('button-delete-all');
  const createCollectionBtn = document.getElementById('button-create-collection');
  const emailInput = document.querySelector('.Email input[type="email"]');

  // Show notification message
  function showNotification(message, type = 'success') {
    const emailContainer = document.querySelector('.Email');
    
    // Remove existing message
    const oldMsg = emailContainer.querySelector('.email-error, .email-success, .email-info');
    if (oldMsg) oldMsg.remove();

    // Create new message
    const notifyMsg = document.createElement('div');
    notifyMsg.className = `email-${type}`;
    notifyMsg.textContent = message;
    emailContainer.appendChild(notifyMsg);

    // Auto-remove after 3 seconds
    setTimeout(() => notifyMsg.remove(), 3000);
  }

  // Create new collection
  if (createCollectionBtn && emailInput) {
    createCollectionBtn.addEventListener('click', function() {
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email || !emailPattern.test(email)) {
        showNotification('Please enter a valid email.', 'error');
        return;
      }

      if (!window.emailCollections[email]) {
        window.emailCollections[email] = [];
        window.lastCreatedEmail = email;
        showNotification(`Created new collection for: ${email}`, 'success');
        window.updateCollectionsSection(email);
      } else {
        window.lastCreatedEmail = email;
        showNotification(`Collection for ${email} already exists.`, 'info');
        window.updateCollectionsSection();
      }
    });
  }

  // Delete entire collection
  if (deleteCollectionBtn) {
    deleteCollectionBtn.addEventListener('click', function() {
      const dropdown = document.querySelector('.collections-dropdown');
      const selectedEmail = dropdown?.value;
      
      if (selectedEmail && window.emailCollections[selectedEmail]) {
        delete window.emailCollections[selectedEmail];
        
        // Update lastCreatedEmail if needed
        if (window.lastCreatedEmail === selectedEmail) {
          const keys = Object.keys(window.emailCollections);
          window.lastCreatedEmail = keys.length > 0 ? keys[keys.length - 1] : null;
        }
        
        window.updateCollectionsSection();
      }
    });
  }

  // Clear all images from collection
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', function() {
      const dropdown = document.querySelector('.collections-dropdown');
      const selectedEmail = dropdown?.value;
      
      if (selectedEmail && window.emailCollections[selectedEmail]) {
        window.emailCollections[selectedEmail] = [];
        window.updateCollectionsSection();
      }
    });
  }
});

// Update Collections UI
window.updateCollectionsSection = function(forceSelectEmail) {
  const collectionsSection = document.querySelector('.Collections');
  if (!collectionsSection) return;

  const emails = Object.keys(window.emailCollections);
  let dropdown = collectionsSection.querySelector('.collections-dropdown');
  
  // Create dropdown if it doesn't exist
  if (!dropdown) {
    dropdown = document.createElement('select');
    dropdown.className = 'collections-dropdown';
    collectionsSection.insertBefore(dropdown, collectionsSection.querySelector('.button-container'));
  }

  const prevSelected = dropdown.value;
  dropdown.innerHTML = '';

  // Populate dropdown
  if (emails.length === 0) {
    dropdown.innerHTML = '<option value="">No collections yet</option>';
  } else {
    emails.forEach(email => {
      const option = document.createElement('option');
      option.value = email;
      option.textContent = email;
      dropdown.appendChild(option);
    });

    // Set selection priority: forced > previous > lastCreated > first
    dropdown.value = forceSelectEmail && emails.includes(forceSelectEmail) ? forceSelectEmail :
                    prevSelected && emails.includes(prevSelected) ? prevSelected :
                    window.lastCreatedEmail && emails.includes(window.lastCreatedEmail) ? window.lastCreatedEmail :
                    emails[0];
  }

  // Render images for selected collection
  function renderImages(selectedEmail) {
    // Remove existing list
    const oldList = collectionsSection.querySelector('.collections-list');
    if (oldList) oldList.remove();
    
    if (!selectedEmail) return;
    
    const imageIds = window.emailCollections[selectedEmail] || [];
    if (imageIds.length === 0) return;

    // Create image grid
    const list = document.createElement('ul');
    list.className = 'collections-list';
    
    const li = document.createElement('li');
    const imgGrid = document.createElement('div');
    imgGrid.className = 'image-grid';

    imageIds.forEach((id, idx) => {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'image-wrapper';

      const img = document.createElement('img');
      img.src = `https://picsum.photos/id/${id}/200/100`;
      img.alt = 'Collection image';

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.title = 'Remove image';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.emailCollections[selectedEmail].splice(idx, 1);
        window.updateCollectionsSection(selectedEmail);
      });

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(removeBtn);
      imgGrid.appendChild(imgWrapper);
    });

    li.appendChild(imgGrid);
    list.appendChild(li);
    collectionsSection.appendChild(list);
  }

  // Initial render and dropdown change listener
  renderImages(dropdown.value);
  dropdown.addEventListener('change', () => renderImages(dropdown.value));
};
