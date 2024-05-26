export default function (integration_id, instance_url) {
	if (!integration_id || !instance_url) return "";
	return `${instance_url}/person/${integration_id}`;
}
