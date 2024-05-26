import { useMutation } from "react-query";
import { AuthorizedApi } from "./api";
import { useState } from "react";

const useAttachments = () => {
	const [attUploadProgress, setAttUploadProgress] = useState({});

	const onAttProgress = (progressEvent, file) => {
		let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
		setAttUploadProgress(prev => ({
			...prev,
			[file.name]: percentCompleted,
		}));
	};
	//get attachments
	const getAttachmentApi = async body => {
		return await AuthorizedApi.post(`/v2/sales/attachments/`, body).then(res => res.data);
	};
	const { mutate: getAttachment } = useMutation(getAttachmentApi);

	///upload attachments
	const uploadAttachmentsApi = async ({ formData, file }) => {
		return await AuthorizedApi.post("/v1/sales/attachments", formData, {
			onUploadProgress: progressEvent => onAttProgress(progressEvent, file),
		}).then(res => res.data);
	};

	const { mutate: uploadAttachments, isLoading: attachmentsLoading } =
		useMutation(uploadAttachmentsApi);

	const downloadAttachmentApi = attachment_id =>
		AuthorizedApi.get(`v2/sales/attachments/download/${attachment_id}`).then(
			res => res?.data?.data
		);

	const { mutate: downloadAttachmentURL } = useMutation(downloadAttachmentApi);

	// Delete cdn images
	const deleteCDNApi = async body => {
		return await AuthorizedApi.post("/v2/google/delete-image", body).then(
			res => res.data
		);
	};

	const { mutate: deleteCDN } = useMutation(deleteCDNApi);

	const deleteAttachmentApi = async attachment_id => {
		return await AuthorizedApi.delete(`/v2/sales/attachments/${attachment_id}`).then(
			res => res.data
		);
	};

	const { mutate: deleteAttachment } = useMutation(deleteAttachmentApi);

	return {
		uploadAttachments,
		getAttachment,
		attachmentsLoading,
		attUploadProgress,
		downloadAttachmentURL,
		deleteCDN,
		deleteAttachment,
	};
};

export default useAttachments;
