document.getElementById("save-options").addEventListener("click", () => {
    let color = document.getElementById("default-highlight-color").value;
    chrome.storage.sync.set({ defaultHighlightColor: color }, () => {
      alert("Options saved.");
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("defaultHighlightColor", (data) => {
      if (data.defaultHighlightColor) {
        document.getElementById("default-highlight-color").value = data.defaultHighlightColor;
      }
    });
  });
  