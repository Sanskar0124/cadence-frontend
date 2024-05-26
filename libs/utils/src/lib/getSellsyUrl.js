export default function (integration_id) {
	if (!integration_id) return "";
	return `https://www.sellsy.com/peoples/${integration_id}`;
}
