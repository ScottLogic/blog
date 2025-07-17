function loadCss(path){
	fetch(path)
		.then(response => response.text())
		.then(applyStyles);
}

function applyStyles(css){
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.getElementsByTagName('head')[0].appendChild(style);
}

