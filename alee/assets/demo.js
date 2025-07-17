(function() {
  const container = setupContainer();
  const demo = getOrCreateDiv(container, "demo", "div");

  const tabBlocks = loadTabBlocks(container);
  handleTabs(container, tabBlocks);

  function setupContainer() {
    const container = getOrCreateDiv(document.body, "container", "div");

    const tabs = document.createElement("ul");
    tabs.className = 'tabs';
    tabs.innerHTML = '<li class="tab selected">Demo</li>';
    container.insertBefore(tabs, container.firstChild);

    return container;
  }

  function loadTabBlocks(container) {
    const scripts = document.querySelectorAll('script[type="text/babel"]');
    const tabBlocks = [demo];
    for(let m = 0; m < scripts.length; m++) {
      const script = scripts[m];
      if (script.id) {
        const highlighted = hljs.highlight('javascript', script.innerText);
        const codeBlock = createCodeBlock(highlighted.value);
        codeBlock.style.display = "none";
        container.appendChild(codeBlock);
        tabBlocks.push(codeBlock);
        addTab(container, script.id);
      }
    };
    return tabBlocks;
  }

  function createCodeBlock(html) {
    const codeBlock = document.createElement("code");
    codeBlock.innerHTML = html;
    const preBlock = document.createElement("pre");
    preBlock.className = "code";
    preBlock.appendChild(codeBlock);
    return preBlock;
  }

  function addTab(container, name) {
    const tabs = container.querySelector('.tabs');
    const newTab = document.createElement("li");
    newTab.className = "tab";
    newTab.innerText = name;
    tabs.appendChild(newTab);
    return newTab;
  }

  function handleTabs(container, tabContent) {
    const tabs = container.querySelectorAll('.tabs .tab');
    function handleTab(index) {
      tabs[index].addEventListener('click', function() {
        for(let m = 0; m < tabs.length; m++) {
          tabs[m].className = "tab" + (m == index ? " selected" : "");
        }
        for(let m = 0; m < tabContent.length; m++) {
          tabContent[m].style.display = m == index ? "" : "none";
        }
      });
    }

    for(let n = 0; n < tabs.length; n++) {
      handleTab(n);
    }
  }

  function getOrCreateDiv(container, className) {
    const existingDiv = container.querySelector(`.${className}`);
    if (existingDiv) return existingDiv;

    const newDiv = document.createElement("div");
    newDiv.className = className;
    container.appendChild(newDiv);
    return newDiv;
  }
})();
