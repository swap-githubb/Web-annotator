chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ annotations: [] });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "save_annotation") {
      chrome.storage.sync.get("annotations", (data) => {
        let annotations = data.annotations || [];
        annotations.push(message.annotation);
        chrome.storage.sync.set({ annotations: annotations }, () => {
          sendResponse({ status: "success" });
        });
      });
      return true;
    } else if (message.type === "get_annotations") {
      chrome.storage.sync.get("annotations", (data) => {
        sendResponse({ annotations: data.annotations });
      });
      return true;
    }
  });
  