export default function (enumString) {
	if (!enumString) return "";
	let label = enumString;
	label = enumString.replaceAll("_", " ");
	label = label.charAt(0).toUpperCase() + label.slice(1);
	return label;
}
