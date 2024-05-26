import { Modal } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useContext, useEffect, useState } from "react";
import ThumbnailView from "../ThumbnailView/ThumbnailView";

import VideoRecorder from "../VideoRecorder/VideoRecorder";
import styles from "./AddVideoModal.module.scss";

const VIEW_TYPES = {
	RECORDER: "record",
	THUMBNAIL: "thumbnail",
};

const AddVideoModal = ({
	isModal,
	onClose,
	showOpenTemplatesOption,
	openTemplatesClickHandler,
	mailInput,
	setMailInput,
	signature,
	user,
	setUploadVideoLink,
	setVideoId,
	videoId,
	showGenerateLink = false,
	setVideoModal,
}) => {
	const { addError } = useContext(MessageContext);
	//states
	const [view, setView] = useState(VIEW_TYPES.RECORDER);
	const [video, setVideo] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [isTimer, setIsTimer] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [recDuration, setRecDuration] = useState(null);
	const [uploadVideoFile, setUploadVideoFile] = useState(null);
	const [videoLoading, setVideoLoading] = useState(false);

	const urltoFile = (url, filename, mimeType) => {
		return fetch(url)
			.then(function (res) {
				return res.arrayBuffer();
			})
			.then(function (buf) {
				return new File([buf], filename, { type: mimeType });
			})
			.catch(() => setVideoLoading(false));
	};

	// import video
	const importVideohandler = e => {
		const file = e.target.files[0];

		if (file.type === "video/webm " || file.type === "video/mp4") {
			if (file?.size > 100 * 1048576) {
				addError({ text: "Video size too big. File size should be less than 100MB" });
				setView(VIEW_TYPES.RECORDER);
			} else {
				const reader = new FileReader();
				reader.readyState;
				reader.onload = e => {
					setVideoLoading(true);
					setVideo(e.target.result);
					urltoFile(e.target.result, file.name, file.type).then(file => {
						setUploadVideoFile(file);
						setVideoLoading(false);
					});
				};
				reader.readAsDataURL(file);
				setRecDuration(null);
				setView(VIEW_TYPES.THUMBNAIL);
			}
		} else {
			addError({ text: "File Format Not supported" });
			setView(VIEW_TYPES.RECORDER);
		}
	};

	// timer
	const minuteTimeinMs = 3 * 60 * 1000;
	const currentTime = new Date().getTime();
	const timeAfterMinutes = currentTime + minuteTimeinMs;

	useEffect(() => {
		setView(VIEW_TYPES.RECORDER);
		setVideo(null);
	}, [isModal]);

	return (
		<Modal
			className={styles.addVideoModal}
			isModal={isModal}
			onClose={onClose}
			disableOutsideClick
		>
			{view === VIEW_TYPES.RECORDER && (
				<VideoRecorder
					showOpenTemplatesOption={showOpenTemplatesOption}
					openTemplatesClickHandler={openTemplatesClickHandler}
					startTimer={setIsTimer}
					isTimer={isTimer}
					views={VIEW_TYPES}
					setView={setView}
					setVideo={setVideo}
					onClose={onClose}
					importVideohandler={importVideohandler}
					setRecDuration={setRecDuration}
					setIsRecording={setIsRecording}
					setUploadVideoFile={setUploadVideoFile}
				/>
			)}
			{view === VIEW_TYPES.THUMBNAIL && (
				<ThumbnailView
					setThumbnail={setThumbnail}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					video={video}
					views={VIEW_TYPES}
					setView={setView}
					recDuration={recDuration}
					thumbnail={thumbnail}
					onClose={onClose}
					setVideo={setVideo}
					isRecording={isRecording}
					showGenerateLink={showGenerateLink}
					mailInput={mailInput}
					setMailInput={setMailInput}
					signature={signature}
					setUploadVideoLink={setUploadVideoLink}
					user={user}
					onAddVideoModalClose={onClose}
					setVideoId={setVideoId}
					uploadVideoFile={uploadVideoFile}
					videoId={videoId}
					videoLoading={videoLoading}
					setVideoModal={setVideoModal}
				/>
			)}
		</Modal>
	);
};

export default AddVideoModal;
