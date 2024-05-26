export default function (sheetId) {
	let url = "";
	if (sheetId) url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
	return url;
}
