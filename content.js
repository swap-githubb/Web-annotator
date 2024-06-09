let currentHighlightColor = "yellow";

document.addEventListener("mouseup", () => {
  let selectedText = window.getSelection().toString();
  if (selectedText) {
    let range = window.getSelection().getRangeAt(0);
    let highlight = document.createElement("span");
    highlight.style.backgroundColor = currentHighlightColor;
    highlight.textContent = selectedText;
    range.deleteContents();
    range.insertNode(highlight);

    let note = prompt("Add a note for this highlight:", "");
    if (note) {
      highlight.setAttribute("data-note", note);
      let annotation = {
        text: selectedText,
        note: note,
        color: currentHighlightColor,
        url: window.location.href,
        date: new Date().toISOString()
      };
      chrome.runtime.sendMessage({ type: "save_annotation", annotation: annotation });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "set_highlight_color") {
    currentHighlightColor = message.color;
  }
});
