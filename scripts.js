const saveButton = document.getElementById('save-button');
const textbox = document.getElementById('expandable-textbox');

const authToken = '';
const owner = 'arunk1234';
const repo = 'notes';
const path = 'history.txt';
const baseurl = 'https://api.github.com';
let serverSha; // Declare a variable to store the 'sha' value of the file on the server

// Get the current 'sha' value and content of the 'history.txt' file on the server
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
})
.then(response => response.json())
.then(data => {
  serverSha = data.sha; // Store the 'sha' value of the file on the server in the variable
  const content = atob(data.content); // Decode the file content from Base64
  
  // Display the file content in the text box
  textbox.value = content;
  textbox.style.height = 'auto';
  textbox.style.height = textbox.scrollHeight + 'px';
  
  // Add an event listener to the 'Save' button
  saveButton.addEventListener('click', function() {
    const text = textbox.value;
    
    // Check whether the 'sha' value of the file on the server matches the 'sha' value in your local copy of the repository
    
      // Send a PUT request to update the file with the new content
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Add new entry',
          content: btoa(text),
          branch: 'master',
          sha: serverSha // Use the 'sha' value from the server in your request
        })
      })
      .then(response => {
        if (response.ok) {
          alert('Text saved to history!');
          location.reload(); // Reload the page to pull changes from the server
        } else {
          alert('Error saving text to history!');
        }
      })
      .catch(error => {
        console.error('Error updating file:', error);
        alert('Error updating file. Please try again later.');
      });
  });
})
.catch(error => {
  console.error('Error getting file:', error);
  alert('Error getting file. Please try again later.');
});

textbox.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

// Calculate the SHA-1 hash of a string
function sha1(str) {
  const buffer = new TextEncoder().encode(str);
  return crypto.subtle.digest('SHA-1', buffer)
  .then(hash => {
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  });
  
}
