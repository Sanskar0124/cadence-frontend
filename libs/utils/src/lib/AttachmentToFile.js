export default function AttachmentToFile(attachment) {
	const { content, content_type, original_name } = attachment;
	const { data } = content;
	return new File(data, original_name, { type: content_type });
}
