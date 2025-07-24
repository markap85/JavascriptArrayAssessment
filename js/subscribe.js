

// Object to store arrays by email
const emailCollections = {};

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
        if (!emailCollections[email]) {
          emailCollections[email] = [];
          notifyMsg.className = 'email-success';
          notifyMsg.style.color = 'green';
          notifyMsg.textContent = `Created new array for: ${email}`;
        } else {
          notifyMsg.className = 'email-info';
          notifyMsg.style.color = 'orange';
          notifyMsg.textContent = `Array for ${email} already exists.`;
        }
        emailContainer.insertBefore(notifyMsg, emailInput);

        // Update the Collections section in the DOM
        const collectionsSection = document.querySelector('.Collections');
        if (collectionsSection) {
          // Remove any previous list
          let oldList = collectionsSection.querySelector('.collections-list');
          if (oldList) oldList.remove();

          // Create a new list
          const list = document.createElement('ul');
          list.className = 'collections-list';
          Object.keys(emailCollections).forEach(function(key) {
            const li = document.createElement('li');
            li.textContent = key + ': [' + emailCollections[key].join(', ') + ']';
            list.appendChild(li);
          });
          collectionsSection.appendChild(list);
        }
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
