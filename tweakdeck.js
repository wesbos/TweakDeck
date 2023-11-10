// ==UserScript==
// @name     TweakDeck
// @version  1
// @grant    none
// ==/UserScript==

async function attachClasses() {
  // 	the main div for content
  const main = document.querySelector('[role="main"]');
  const columnWrapper = main.firstChild.firstChild.firstChild;
  const columns = columnWrapper.childNodes;
  columns.forEach((column, i) => {
    column.classList.add('tweakdeck-column', `tweakdeck-column-${i}`);
  });
}

function selectElementsByText(searchText, matches) {
  // const xpathSelector = `//*[contains(text(), "${searchText}")]`;
  const xpathSelector = `//*[text() = "${searchText}"]`;
  const matchingElements = document.evaluate(
    xpathSelector,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  const elementsArray = [];
  let element = matchingElements.iterateNext();
  while (element) {
    elementsArray.push(element);
    element = matchingElements.iterateNext();
  }
  return elementsArray;
}

function tagItemsAfterHeading(headingText, slug) {
  console.log('Running', headingText, slug);
  const headings = selectElementsByText(headingText);

  headings.forEach((heading) => {
    // find the parent div
    const parent = heading.closest('[data-testid="cellInnerDiv"]');
    parent.classList.add(slug, `${slug}-heading`);
    let nextSibling = parent.nextElementSibling;
    while (nextSibling) {
      nextSibling.classList.add(slug, `${slug}-item`);
      nextSibling = nextSibling.nextElementSibling;
    }
  });
}

setInterval(() => tagItemsAfterHeading('Discover more', 'discover-more'), 500);
setInterval(() => tagItemsAfterHeading('Who to follow', 'hide'), 500);
setInterval(() => tagItemsAfterHeading('Creators for you', 'hide'), 500);
setInterval(attachClasses, 1500);

const customStyles = /*css*/ `
  /* Hide Verified Tab */
  div:has(> a[role="tab"][href*="verified"]) {
    display: none;
  }

  .discover-more,
  .hide {
    opacity: 0.1;
  }

  /* Remove Chirp Font */
  * {
     font-family: system-ui !important;
  }
  /* Thin Scrollbars */
  .tweakdeck-column :is([data-viewportview="true"]) {
    scrollbar-width: thin;
  }
  /* Spacing for DMs */
  .tweakdeck-column:has([data-testid*="DmActivityViewport"]) {
      margin-bottom: 30px;
  }
`;

const style = document.createElement('style');
style.textContent = customStyles;
document.body.appendChild(style);
