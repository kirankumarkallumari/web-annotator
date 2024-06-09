// content.js

document.addEventListener('mouseup', function() {
  let selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    chrome.storage.sync.get('highlightColor', function(data) {
      let highlightColor = data.highlightColor || 'yellow';
      let range = window.getSelection().getRangeAt(0);
      let span = document.createElement('span');
      span.style.backgroundColor = highlightColor;
      span.textContent = selectedText;

      // Saving the annotation
      saveAnnotation({
        text: selectedText,
        color: highlightColor,
        page: window.location.href,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        containerXPath: getXPathForElement(range.startContainer.parentNode)
      });

      range.deleteContents();
      range.insertNode(span);
    });
  }
});

function saveAnnotation(annotation) {
  chrome.storage.sync.get({ annotations: [] }, function(data) {
    let annotations = data.annotations;
    annotations.push(annotation);
    chrome.storage.sync.set({ annotations: annotations });
  });
}

function loadAnnotations() {
  chrome.storage.sync.get({ annotations: [] }, function(data) {
    data.annotations.forEach(annotation => {
      if (annotation.page === window.location.href) {
        let containerElement = getElementByXPath(annotation.containerXPath);
        if (containerElement) {
          let range = document.createRange();
          range.setStart(containerElement.childNodes[0], annotation.startOffset);
          range.setEnd(containerElement.childNodes[0], annotation.endOffset);

          let span = document.createElement('span');
          span.style.backgroundColor = annotation.color;
          span.textContent = annotation.text;

          range.deleteContents();
          range.insertNode(span);
        }
      }
    });
  });
}

window.addEventListener('load', loadAnnotations);

function getXPathForElement(element) {
  const idx = (sib, name) => sib ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name) : 1;
  const segs = el => !el || el.nodeType !== 1 ? [''] : el.id && document.getElementById(el.id) === el ? [`id("${el.id}")`] : [...segs(el.parentNode), `${el.localName.toLowerCase()}[${idx(el)}]`];
  return segs(element).join('/');
}

function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
