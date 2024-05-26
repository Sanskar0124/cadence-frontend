export default function (link) {
	if (!link) return "";

	if (link.startsWith("https://") || link.startsWith("http://")) return link;
	else return `https://${link}`;
}
