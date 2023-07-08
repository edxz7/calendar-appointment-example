// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.querySelector('.create-calendar').addEventListener('click', function() {
  fetch('/calendar')
      .then(response => response.text())
      .then(data => {
        console.log('data: ', data)
          // Update the modal content with the fetched data
          document.querySelector('.modal-body').innerHTML = data;
      });
  });
