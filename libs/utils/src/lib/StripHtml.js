const StripHtml = (html, maintainLineBreaks = false) => {
	let text = html;
	if (maintainLineBreaks) text = text?.replaceAll("</p>", "</p>\n");
	else text = text?.replaceAll("</p>", "</p>&nbsp;");
	let div = document.createElement("div");
	div.innerHTML = text;
	return div.textContent || div.innerText || "";
};

export default StripHtml;
