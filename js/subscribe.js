

// Object to store arrays by email
const emailCollections = {};

document.addEventListener('DOMContentLoaded', function() {
  const subscribeBtn = document.getElementById('button-subscribe');
  const emailInput = document.querySelector('.Email input[type="email"]');

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', function() {
      const email = emailInput.value.trim();
      if (email) {
        if (!emailCollections[email]) {
          emailCollections[email] = [];
          console.log(`Created new array for: ${email}`);
        } else {
          console.log(`Array for ${email} already exists.`);
        }
      } else {
        console.log('Please enter a valid email.');
      }
    });
  }
});
