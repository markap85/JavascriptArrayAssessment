


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
// Global function to update the Collections section
window.updateCollectionsSection = function() {
  const collectionsSection = document.querySelector('.Collections');
  if (collectionsSection) {
    // Remove any previous list
    let oldList = collectionsSection.querySelector('.collections-list');
    if (oldList) oldList.remove();

    // Create a new list
    const list = document.createElement('ul');
    list.className = 'collections-list';
    Object.keys(window.emailCollections).forEach(function(key) {
      const li = document.createElement('li');
      li.textContent = key;
      // If there are images in the array, display them below the email
      const images = window.emailCollections[key];
      if (images && images.length > 0) {
        const imgList = document.createElement('div');
        imgList.style.display = 'flex';
        imgList.style.flexWrap = 'wrap';
        imgList.style.gap = '8px';
        images.forEach(function(url) {
          const img = document.createElement('img');
          img.src = url;
          img.alt = 'Collection image';
          img.style.width = '80px';
          img.style.height = '60px';
          img.style.objectFit = 'cover';
          imgList.appendChild(img);
        });
        li.appendChild(imgList);
      }
      list.appendChild(li);
    });
    collectionsSection.appendChild(list);
  }
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
