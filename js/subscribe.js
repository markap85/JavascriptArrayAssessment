// Event listeners for delete buttons in Collections section
document.addEventListener('DOMContentLoaded', function() {
  const deleteCollectionBtn = document.getElementById('button-delete-collection');
  const deleteAllBtn = document.getElementById('button-delete-all');

  if (deleteCollectionBtn) {
    deleteCollectionBtn.addEventListener('click', function() {
      const dropdown = document.querySelector('.collections-dropdown');
      const selectedEmail = dropdown ? dropdown.value : null;
      if (selectedEmail && window.emailCollections[selectedEmail]) {
        delete window.emailCollections[selectedEmail];
        // Update lastCreatedEmail if needed
        if (window.lastCreatedEmail === selectedEmail) {
          const keys = Object.keys(window.emailCollections);
          window.lastCreatedEmail = keys.length > 0 ? keys[keys.length - 1] : null;
        }
        if (typeof window.updateCollectionsSection === 'function') {
          window.updateCollectionsSection();
        }
      }
    });
  }

  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', function() {
      const dropdown = document.querySelector('.collections-dropdown');
      const selectedEmail = dropdown ? dropdown.value : null;
      if (selectedEmail && window.emailCollections[selectedEmail]) {
        window.emailCollections[selectedEmail] = [];
        if (typeof window.updateCollectionsSection === 'function') {
          window.updateCollectionsSection();
        }
      }
    });
  }
});



// Object to store arrays by email (global)
window.emailCollections = {};
window.lastCreatedEmail = null;

document.addEventListener('DOMContentLoaded', function() {
  const subscribeBtn = document.getElementById('button-subscribe');
  const emailInput = document.querySelector('.Email input[type="email"]');

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', function() {
      const email = emailInput.value.trim();
      // Remove any existing notification or error message

      const emailContainer = document.querySelector('.Email');
      const emailForm = emailContainer.querySelector('.email-form');
      let oldMsg = emailContainer.querySelector('.email-error, .email-success, .email-info');
      if (oldMsg) {
        oldMsg.remove();
      }

      // Email format validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && emailPattern.test(email)) {
        let notifyMsg = document.createElement('div');
        notifyMsg.style.marginTop = '0.5rem';
        if (!window.emailCollections[email]) {
          window.emailCollections[email] = [];
          window.lastCreatedEmail = email;
          notifyMsg.className = 'email-success';
          notifyMsg.style.background = '#48bb78'; // soft green
          notifyMsg.style.color = 'white';
          notifyMsg.style.borderRadius = '5px';
          notifyMsg.style.padding = '0.5rem 1rem';
          notifyMsg.textContent = `Created new collection for: ${email}`;
          emailContainer.appendChild(notifyMsg); // Insert after the subscribe box
          // Update the Collections section and force select the new collection
          if (typeof window.updateCollectionsSection === 'function') {
            window.updateCollectionsSection(email);
          }
        } else {
          window.lastCreatedEmail = email;
          notifyMsg.className = 'email-info';
          notifyMsg.style.background = '#f6ad55'; // soft orange
          notifyMsg.style.color = '#333';
          notifyMsg.style.borderRadius = '5px';
          notifyMsg.style.padding = '0.5rem 1rem';
          notifyMsg.textContent = `Collection for ${email} already exists.`;
          emailContainer.appendChild(notifyMsg); // Insert after the subscribe box
          // Just update the Collections section (no force select)
          if (typeof window.updateCollectionsSection === 'function') {
            window.updateCollectionsSection();
          }
        }
      } else {
        // Inject error message after the subscribe box
        let errorMsg = document.createElement('div');
        errorMsg.className = 'email-error';
        errorMsg.style.background = '#fee2e2'; // soft red
        errorMsg.style.color = '#dc2626';
        errorMsg.style.borderRadius = '5px';
        errorMsg.style.padding = '0.5rem 1rem';
        errorMsg.style.marginTop = '0.5rem';
        errorMsg.textContent = 'Please enter a valid email.';
        emailContainer.appendChild(errorMsg); // Insert after the subscribe box
      }
    });
  }
});

// Global function to update the Collections section with dropdown
window.updateCollectionsSection = function(forceSelectEmail) {
  const collectionsSection = document.querySelector('.Collections');
  if (!collectionsSection) return;

  // Find existing dropdown
  let dropdown = collectionsSection.querySelector('.collections-dropdown');
  if (!dropdown) {
    // Create dropdown if it doesn't exist
    dropdown = document.createElement('select');
    dropdown.className = 'collections-dropdown';
    dropdown.style.marginBottom = '1rem';
    collectionsSection.insertBefore(dropdown, collectionsSection.querySelector('.button-container'));
  }

  // Store current selection
  let prevSelected = dropdown.value;

  // Remove existing event listeners by cloning the dropdown
  const newDropdown = dropdown.cloneNode(false);
  newDropdown.className = dropdown.className;
  newDropdown.style.marginBottom = dropdown.style.marginBottom;
  dropdown.parentNode.replaceChild(newDropdown, dropdown);
  dropdown = newDropdown;

  // Remove any previous list
  let oldList = collectionsSection.querySelector('.collections-list');
  if (oldList) oldList.remove();

  const emails = Object.keys(window.emailCollections);
  
  // Always clear and repopulate dropdown
  dropdown.innerHTML = '';
  
  if (emails.length === 0) {
    // No collections - show placeholder
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No collections yet';
    dropdown.appendChild(option);
  } else {
    // Add all email options
    emails.forEach(function(email) {
      const option = document.createElement('option');
      option.value = email;
      option.textContent = email;
      dropdown.appendChild(option);
    });

    // Set dropdown to forced selection (for new collection), previous selection, lastCreatedEmail, or first
    if (forceSelectEmail && emails.includes(forceSelectEmail)) {
      dropdown.value = forceSelectEmail;
    } else if (prevSelected && prevSelected !== '' && emails.includes(prevSelected)) {
      dropdown.value = prevSelected;
    } else if (window.lastCreatedEmail && emails.includes(window.lastCreatedEmail)) {
      dropdown.value = window.lastCreatedEmail;
    } else {
      dropdown.value = emails[0];
    }
  }

  // Function to render images for selected email
  function renderImagesForEmail(selectedEmail) {
    let oldList = collectionsSection.querySelector('.collections-list');
    if (oldList) oldList.remove();
    
    if (!selectedEmail) return; // No email selected
    
    const imageIds = window.emailCollections[selectedEmail] || [];
    const list = document.createElement('ul');
    list.className = 'collections-list';
    const li = document.createElement('li');
    li.textContent = selectedEmail;
    if (imageIds.length > 0) {
      const imgList = document.createElement('div');
      imgList.style.display = 'flex';
      imgList.style.flexWrap = 'wrap';
      imgList.style.gap = '8px';
      imageIds.forEach(function(id, idx) {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.position = 'relative';
        imgWrapper.style.display = 'inline-block';

        const img = document.createElement('img');
        img.src = `https://picsum.photos/id/${id}/80/60`;
        img.alt = 'Collection image';
        img.style.width = '80px';
        img.style.height = '60px';
        img.style.objectFit = 'cover';

        // Add remove (x) button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove image';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '0';
        removeBtn.style.right = '0';
        removeBtn.style.background = 'rgba(0,0,0,0.6)';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '16px';
        removeBtn.style.lineHeight = '18px';
        removeBtn.style.padding = '0';

        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          window.emailCollections[selectedEmail].splice(idx, 1);
        if (typeof window.updateCollectionsSection === 'function') {
          window.updateCollectionsSection(window.lastCreatedEmail);
        }
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(removeBtn);
        imgList.appendChild(imgWrapper);
      });
      li.appendChild(imgList);
    }
    list.appendChild(li);
    collectionsSection.appendChild(list);
  }

  // Initial render for selected email
  let selectedEmail = dropdown.value;
  renderImagesForEmail(selectedEmail);

  // Add change event listener
  dropdown.addEventListener('change', function() {
    renderImagesForEmail(dropdown.value);
  });
};
