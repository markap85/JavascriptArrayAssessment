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
      let oldMsg = emailContainer.querySelector('.email-error, .email-success, .email-info');
      if (oldMsg) {
        oldMsg.remove();
      }

      if (email) {
        let notifyMsg = document.createElement('div');
        notifyMsg.style.marginBottom = '0.5rem';
        if (!window.emailCollections[email]) {
          window.emailCollections[email] = [];
          window.lastCreatedEmail = email;
          notifyMsg.className = 'email-success';
          notifyMsg.style.color = 'green';
          notifyMsg.textContent = `Created new array for: ${email}`;
        } else {
          window.lastCreatedEmail = email;
          notifyMsg.className = 'email-info';
          notifyMsg.style.color = 'orange';
          notifyMsg.textContent = `Array for ${email} already exists.`;
        }
        emailContainer.insertBefore(notifyMsg, emailInput);

        // Update the Collections section in the DOM
        if (typeof window.updateCollectionsSection === 'function') {
          window.updateCollectionsSection();
        }
// Global function to update the Collections section with dropdown
window.updateCollectionsSection = function() {
  const collectionsSection = document.querySelector('.Collections');
  if (!collectionsSection) return;

  // Store current selection
  let oldDropdown = collectionsSection.querySelector('.collections-dropdown');
  let prevSelected = oldDropdown ? oldDropdown.value : null;

  // Remove any previous dropdown or list
  if (oldDropdown) oldDropdown.remove();
  let oldList = collectionsSection.querySelector('.collections-list');
  if (oldList) oldList.remove();

  const emails = Object.keys(window.emailCollections);
  if (emails.length === 0) return;

  // Create dropdown
  const dropdown = document.createElement('select');
  dropdown.className = 'collections-dropdown';
  dropdown.style.marginBottom = '1rem';
  emails.forEach(function(email, idx) {
    const option = document.createElement('option');
    option.value = email;
    option.textContent = email;
    dropdown.appendChild(option);
  });
  collectionsSection.appendChild(dropdown);

  // Set dropdown to previous selection if possible, else lastCreatedEmail, else first
  if (prevSelected && emails.includes(prevSelected)) {
    dropdown.value = prevSelected;
  } else if (window.lastCreatedEmail && emails.includes(window.lastCreatedEmail)) {
    dropdown.value = window.lastCreatedEmail;
  } else {
    dropdown.value = emails[0];
  }

  // Function to render images for selected email
  function renderImagesForEmail(selectedEmail) {
    let oldList = collectionsSection.querySelector('.collections-list');
    if (oldList) oldList.remove();
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
            window.updateCollectionsSection();
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

  // Update images on dropdown change
  dropdown.addEventListener('change', function() {
    renderImagesForEmail(dropdown.value);
  });
};
      } else {
        // Inject error message above the subscribe box
        let errorMsg = document.createElement('div');
        errorMsg.className = 'email-error';
        errorMsg.style.color = 'red';
        errorMsg.style.marginBottom = '0.5rem';
        errorMsg.textContent = 'Please enter a valid email.';
        emailContainer.insertBefore(errorMsg, emailInput);
      }
    });
  }
});
