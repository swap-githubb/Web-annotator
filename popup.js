// Function to display annotations
function displayAnnotations(filter = '') {
    chrome.runtime.sendMessage({ type: "get_annotations" }, (response) => {
      const annotationsList = document.getElementById("annotations-list");
      annotationsList.innerHTML = ""; // Clear existing annotations
  
      const filteredAnnotations = response.annotations.filter(annotation => 
        annotation.text.toLowerCase().includes(filter) || annotation.note.toLowerCase().includes(filter)
      );
  
      filteredAnnotations.forEach((annotation) => {
        const item = document.createElement("div");
        item.className = "annotation-item";
        item.innerHTML = `<strong>Text:</strong> ${annotation.text}<br><strong>Note:</strong> ${annotation.note}<br><strong>Color:</strong> ${annotation.color}<br><strong>URL:</strong> <a href="${annotation.url}" target="_blank">${annotation.url}</a><br><strong>Date:</strong> ${new Date(annotation.date).toLocaleString()}`;
        annotationsList.appendChild(item);
      });
  
      annotationsList.style.display = filteredAnnotations.length > 0 ? 'block' : 'none';
    });
  }
  
  // Event listener to change highlight color
  document.getElementById("highlight-color").addEventListener("change", (event) => {
    const color = event.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "set_highlight_color", color: color });
    });
  });
  
  // Event listener to view annotations
  document.getElementById("view-annotations").addEventListener("click", () => {
    displayAnnotations();
  });
  
  // Event listener to export annotations
  document.getElementById("export-annotations").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "get_annotations" }, (response) => {
      const annotations = response.annotations;
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      annotations.forEach((annotation, index) => {
        let yPosition = 10 + (index * 60);
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(`Annotation ${index + 1}`, 10, yPosition);
        doc.text(`Text: ${annotation.text}`, 10, yPosition + 10);
        doc.text(`Note: ${annotation.note}`, 10, yPosition + 20);
        doc.text(`Color: ${annotation.color}`, 10, yPosition + 30);
        doc.text(`URL: ${annotation.url}`, 10, yPosition + 40);
        doc.text(`Date: ${new Date(annotation.date).toLocaleString()}`, 10, yPosition + 50);
      });
  
      doc.save("annotations.pdf");
    });
  });
  
  // Event listener to search annotations
  document.getElementById("search-annotations").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    displayAnnotations(query);
  });
  
  // Initial display of annotations on popup load
  document.addEventListener("DOMContentLoaded", () => {
    displayAnnotations();
  });
  