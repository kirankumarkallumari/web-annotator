// popup.js

// Function to display saved notes in the popup
function displayNotes() {
  const notesList = document.getElementById('notes-list');
  // Clear previous notes
  notesList.innerHTML = '';
  // Retrieve notes from localStorage
  const notes = JSON.parse(localStorage.getItem('webAnnotatorNotes')) || [];
  // Display each note in a list item
  notes.forEach(note => {
    const listItem = document.createElement('li');
    listItem.textContent = note;
    notesList.appendChild(listItem);
  });
}

// Saving note button event listener
document.getElementById('save-note-btn').addEventListener('click', function() {
  const noteInput = document.getElementById('note-input');
  const note = noteInput.value.trim();
  if (note) {
    // Saving the note to localStorage
    const notes = JSON.parse(localStorage.getItem('webAnnotatorNotes')) || [];
    notes.push(note);
    localStorage.setItem('webAnnotatorNotes', JSON.stringify(notes));
    // Displaying the updated notes list
    displayNotes();
    // Clearing  the input field
    noteInput.value = '';
  }
});

// Loading the  saved notes when popup is opened
document.addEventListener('DOMContentLoaded', () => {
  displayNotes();
});

// Export notes to PDF
document.getElementById('export-btn').addEventListener('click', function() {
  const notes = JSON.parse(localStorage.getItem('webAnnotatorNotes')) || [];
  if (notes.length === 0) {
    alert('No notes to export');
    return;
  }

  // Creating a PDF document using jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('My Notes', 10, 10);
  notes.forEach((note, index) => {
    doc.text(`${index + 1}. ${note}`, 10, 20 + (index * 10));
  });


  doc.save('notes.pdf');
});
