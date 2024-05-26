const parseFetchedEmail = rawEmail => {
	//map attachments
	/* rawEmail?.payload?.parts
		?.filter(part => {
			return part.mimeType.includes("image");
		})
		.map(part => {
			const mapData = {
				attachmentId: part.body.attachmentId,
				filename: part.filename,
				mimeType: part.mimeType,
				contentID: part.headers.filter(header => {
					return header.name === "Content-ID";
				})[0]?.value,
				encoding: part.headers.filter(header => {
					return header.name === "Content-Transfer-Encoding";
				})[0]?.value,
			};
			return mapData;
		})
		.forEach(mapData => {
			const attachmentData =
				rawEmail.attachments.filter(attachment => {
					return mapData.attachmentId === attachment.attachmentId;
				})[0]?.data ?? "";
			const replaceThis = `cid:${mapData?.contentID?.substring(
				1,
				mapData.contentID.length - 1
			)}`;
			const replaceTo = `data:${mapData.mimeType};${mapData.encoding},${attachmentData
				.replace(/-/g, `+`)
				.replace(/_/g, `/`)}`;
			rawEmail.textHtml = rawEmail.textHtml.replace(replaceThis, replaceTo);
		}); */
	return rawEmail;
};

export default parseFetchedEmail;
