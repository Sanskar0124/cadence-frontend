import styles from "./ThumbnailView.module.scss";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Close2, CropIcon, Delete, Tick } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import ReactPlayer from "react-player";
import ThumbnailSelector from "./components/ThumbnailSelector";
import { Spinner } from "@cadence-frontend/components";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { MessageContext } from "@cadence-frontend/contexts";
import EmbedLinkModal from "../Embed Link Modal/EmbedLinkModal";
import { useVideoTemplate } from "@cadence-frontend/data-access";
import ThemedButton from "../../../ThemedButton/ThemedButton";
import { Colors } from "@cadence-frontend/utils";

const THUMBNAIL_VIEWS = {
	CROP: "crop",
	PLAYER: "play",
	FRAMES: "frames",
	PREVIEW: "preview",
};

const ACCEPTED_THUMBNAIL_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

const ThumbnailView = ({
	video,
	setVideo,
	selectedImage,
	setSelectedImage,
	setThumbnail,
	thumbnail,
	views,
	recDuration,
	isRecording,
	setView,
	showGenerateLink,
	onClose,
	mailInput,
	setMailInput,
	signature,
	onAddVideoModalClose,
	setUploadVideoLink,
	setVideoId,
	uploadVideoFile,
	videoLoading,
	setVideoModal,
}) => {
	const { addError } = useContext(MessageContext);
	const [imageRef, setImageRef] = useState(null);
	const [toBeCropped, setToBeCropped] = useState(false);
	const [crop, setCrop] = useState();
	const [thumbnailView, setThumbnailView] = useState(THUMBNAIL_VIEWS.PLAYER);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showCustomControls, setShowCustomControls] = useState(false);
	const [generateLinkModal, setGenerateLinkModal] = useState(false);
	const [thumbnailLink, setThumbnailLink] = useState(null);
	const [thumbnailName, setThumbnailName] = useState(null);
	const [thumbnailType, setThumbnailType] = useState(null);
	const [uploadThumbnailFile, setUploadThumbnailFile] = useState(null);
	// const [videoId, setVideoId] = useState(null);
	const [deleteVideoId, setDeleteVideoId] = useState(null);
	const [embedLink, setEmbedLink] = useState(null);
	const [duration, setDuration] = useState(null);
	const { uploadVideo, uploadThumbnail, embedLinkLoading, uploadThumbnailLoading } =
		useVideoTemplate();
	const videoRef = useRef(null);
	let snaps = [];

	console.log(crop);

	useEffect(() => {
		setLoading(videoLoading);
	}, [videoLoading]);

	async function cropImage(crop) {
		if (imageRef && crop.width && crop.height) {
			const croppedImage = await getCroppedImage(
				imageRef,
				crop,
				"croppedImage.jpeg" // destination filename
			);
			setThumbnail(croppedImage);
		}
	}
	function getCroppedImage(sourceImage, cropConfig, fileName) {
		const canvas = document.createElement("canvas");
		const scaleX = sourceImage.naturalWidth / sourceImage.width;
		const scaleY = sourceImage.naturalHeight / sourceImage.height;
		canvas.width = cropConfig.width;
		canvas.height = cropConfig.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(
			sourceImage,
			cropConfig.x * scaleX,
			cropConfig.y * scaleY,
			cropConfig.width * scaleX,
			cropConfig.height * scaleY,
			0,
			0,
			cropConfig.width,
			cropConfig.height
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob(blob => {
				if (!blob) {
					reject(new Error("Canvas is empty"));
					return;
				}
				blob.name = fileName;
				const croppedImageUrl = window.URL.createObjectURL(blob);
				resolve(croppedImageUrl);
			}, "image/jpeg");
		});
	}

	useEffect(() => {
		setShowCustomControls(false);
	}, [setThumbnailView]);
	// capture snaps
	const timeStamps = [];
	const capture = (video, scaleFactor) => {
		if (scaleFactor == null) {
			scaleFactor = 1;
		}
		var w = video.videoWidth * scaleFactor;
		var h = video.videoHeight * scaleFactor;
		var canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, w, h);
		return canvas;
	};
	const getTimeStamps = () => {
		const duration = isRecording ? recDuration / 1000 : videoRef.current.getDuration();
		const interval = duration / 7;
		let timeStamp = 0;
		while (timeStamp + interval <= duration) {
			timeStamps.push(timeStamp);
			timeStamp += interval;
		}
		timeStamps.splice(0, 1);
		timeStamps.push(duration);
	};

	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	const captureSnapsHandler = () => {
		getTimeStamps();
		// console.log(timeStamps);
		for (let i = 0; i < timeStamps.length; i++) {
			setTimeout(() => {
				// console.log(videoRef.current);
				videoRef.current.getInternalPlayer().currentTime = timeStamps[i];
				snaps.push(capture(videoRef.current.getInternalPlayer()).toDataURL("image/jpeg"));
			}, (i + 1) * 500);
		}
		setTimeout(() => {
			setImages(snaps);
		}, 5000);
	};

	const checkVideoDuration = () => {
		if (isRecording) {
			if (Math.floor(recDuration / 1000) > 3 * 60 + 1) {
				addError({ text: "Video Length should be within 3 min" });
				setView(views.RECORDER);
			}
		} else {
			if (videoRef.current.getDuration() > 3 * 60 + 1) {
				addError({ text: "Video Length should be within 3 min" });
				setView(views.RECORDER);
			}
		}
	};

	const generateLinkModalCloseHandler = () => {
		setGenerateLinkModal(false);
	};

	const uploadThumbnailHandler = (videoId, fileName) => {
		const formData = new FormData();
		formData.append("file", uploadThumbnailFile);
		formData.append("video_id", videoId);
		formData.append("file_name", fileName);
		// setVideoId(videoId);
		uploadThumbnail(formData, {
			onSuccess: data => {
				if (showGenerateLink === true) {
					setThumbnailLink(data?.msg);
					setGenerateLinkModal(true);
				} else {
					setLoading(false);
					setVideoId(videoId);
					// onClose();
					setVideoModal(false);
				}
			},
		});
	};

	const uploadVideoHandler = () => {
		const formData = new FormData();
		formData.append("file", uploadVideoFile);
		// formData.append("user_id", user?.user_id);
		formData.append("video_duration", duration);
		uploadVideo(formData, {
			onSuccess: data => {
				if (!showGenerateLink) setUploadVideoLink(data?.msg?.url);
				else setEmbedLink(data?.msg?.url);
				// setVideoId(data?.msg?.video_id);
				setDeleteVideoId(data?.msg?.video_id);
				uploadThumbnailHandler(data?.msg?.video_id, data?.msg?.file_name);
			},
			onError: () => {
				addError({ text: "Error while uploading video , try again later !" });
			},
		});
	};

	const urltoFile = (url, filename, mimeType) => {
		return fetch(url)
			.then(function (res) {
				return res.arrayBuffer();
			})
			.then(function (buf) {
				return new File([buf], filename, { type: mimeType });
			});
	};

	const onTickHandler = () => {
		setThumbnailView(THUMBNAIL_VIEWS.PREVIEW);
		if (toBeCropped === false) {
			setThumbnail(selectedImage);
		}
	};

	const importThumbnailHandler = e => {
		const file = e.target.files[0];
		if (ACCEPTED_THUMBNAIL_FORMATS.includes(file.type)) {
			setSelectedImage(URL.createObjectURL(file));
			setThumbnailName(file.name);
			setThumbnailType(file.type);
			setToBeCropped(false);
			setCrop(null);
			setThumbnailView(THUMBNAIL_VIEWS.CROP);
		} else {
			addError({ text: "Please select one fo following formats: jpeg/jpg/png." });
			setThumbnailView(THUMBNAIL_VIEWS.FRAMES);
		}
	};

	useEffect(() => {
		if (thumbnailName === null) setThumbnailName("cropped_image.jpeg");
		if (thumbnailType === null) setThumbnailType("image/jpeg");
		urltoFile(thumbnail, thumbnailName, thumbnailType).then(file => {
			setUploadThumbnailFile(file);
		});
	}, [thumbnailName, thumbnail, thumbnailType, setThumbnail]);

	return (
		<div className={styles.thumbnailView}>
			{!loading && (
				<div className={styles.header}>
					{thumbnailView === THUMBNAIL_VIEWS.PLAYER && (
						<>
							<ThemedButton
								className={styles.addButton}
								width="fit-content"
								theme={ThemedButtonThemes.TRANSPARENT}
								onClick={() => {
									onClose();
									// setVideo(null);
								}}
							>
								Back
							</ThemedButton>
							<div className={styles.rightContainer}>
								<ThemedButton
									className={styles.thumbnail}
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => {
										captureSnapsHandler();
										setLoading(true);
										setTimeout(() => {
											setThumbnailView(THUMBNAIL_VIEWS.FRAMES);
											setLoading(false);
										}, 5500);
									}}
								>
									Set Thumbnail
								</ThemedButton>
								{/* Generate link button added to get link without setting thumbnail */}
								{showGenerateLink && (
									<div className={styles.generateLink}>
										{uploadThumbnailLoading && (
											<Spinner className={styles.circleLoading} />
										)}
										{embedLinkLoading && <Spinner className={styles.circleLoading} />}
										<ThemedButton
											theme={ThemedButtonThemes.TRANSPARENT}
											onClick={() => uploadVideoHandler()}
											className={styles.thumbnail}
										>
											Generate Link
										</ThemedButton>
									</div>
								)}
								{/*  */}
								<ThemedButton
									className={styles.deleteButton}
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => {
										setVideo(null);
										setView(views.RECORDER);
									}}
								>
									Delete
								</ThemedButton>
							</div>
						</>
					)}
					{thumbnailView === THUMBNAIL_VIEWS.FRAMES && (
						<>
							<ThemedButton
								className={styles.addButton}
								width="fit-content"
								theme={ThemedButtonThemes.TRANSPARENT}
								onClick={() => setView(views.RECORDER)}
							>
								Cancel
							</ThemedButton>
							{/* <div className={styles.rightContainer}> */}
							<h3>Set Thumbnail</h3>
							<input
								type="file"
								style={{ display: "none" }}
								accept="image/"
								id="thumbnail-file"
								onChange={e => {
									importThumbnailHandler(e);
								}}
							/>
							<label className={styles.thumbnail} htmlFor="thumbnail-file">
								Upload Thumbnail
							</label>
							{/* </div> */}
						</>
					)}
					{thumbnailView === THUMBNAIL_VIEWS.CROP && (
						<>
							<div></div>
							{/* <div className={styles.rightContainer}> */}
							<h3>Set Thumbnail</h3>
							<input
								type="file"
								style={{ display: "none" }}
								accept="image/"
								id="thumbnail-file"
								onChange={e => {
									importThumbnailHandler(e);
								}}
							/>
							<label className={styles.thumbnail} htmlFor="thumbnail-file">
								Browse Files
							</label>
						</>
					)}
					{thumbnailView === THUMBNAIL_VIEWS.PREVIEW && (
						<>
							<ThemedButton
								className={styles.addButton}
								width="fit-content"
								theme={ThemedButtonThemes.TRANSPARENT}
								onClick={() => {
									if (showGenerateLink) {
										setView(views.RECORDER);
									} else {
										uploadVideoHandler();
										setLoading(true);
									}
								}}
							>
								{showGenerateLink ? "Back" : "Save Video"}
							</ThemedButton>
							<div className={styles.rightContainer}>
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => {
										setThumbnailView(THUMBNAIL_VIEWS.CROP);
										setShowCustomControls(false);
									}}
									className={styles.thumbnail}
								>
									Edit Thumbnail
								</ThemedButton>
								{showGenerateLink && (
									<div className={styles.generateLink}>
										{uploadThumbnailLoading && (
											<Spinner className={styles.circleLoading} />
										)}
										{embedLinkLoading && <Spinner className={styles.circleLoading} />}
										<ThemedButton
											theme={ThemedButtonThemes.TRANSPARENT}
											onClick={() => uploadVideoHandler()}
											className={styles.thumbnail}
										>
											Generate Link
										</ThemedButton>
									</div>
								)}

								<ThemedButton
									className={styles.deleteButton}
									width="fit-content"
									theme={ThemedButtonThemes.TRANSPARENT}
									onClick={() => setView(views.RECORDER)}
								>
									Delete
								</ThemedButton>
							</div>
						</>
					)}
				</div>
			)}
			<div className={styles.body}>
				{thumbnailView === THUMBNAIL_VIEWS.PLAYER && (
					<>
						{loading && <Spinner className={styles.spinner} />}
						<div
							className={recDuration ? null : styles.player}
							style={{ display: loading ? "none" : "flex" }}
						>
							<VideoPlayer
								recDuration={recDuration}
								showControls={true}
								// setShowControls={showCustomControls}
								videosrc={video}
							/>
							<ReactPlayer
								onReady={checkVideoDuration}
								onDuration={videoDuration =>
									recDuration
										? setDuration(recDuration / 1000)
										: setDuration(videoDuration)
								}
								url={video}
								ref={videoRef}
								muted
								style={{ display: "none" }}
							/>
						</div>
					</>
				)}
				{thumbnailView === THUMBNAIL_VIEWS.FRAMES && (
					<ThumbnailSelector
						images={images}
						setSelectedThumbnail={setSelectedImage}
						video={video}
						thumbnailViews={THUMBNAIL_VIEWS}
						setThumbnailView={setThumbnailView}
						recDuration={recDuration}
					/>
				)}
				{thumbnailView === THUMBNAIL_VIEWS.CROP && (
					<>
						<div className={styles.cropview}>
							{!toBeCropped && (
								<img
									src={selectedImage}
									className={styles.image}
									height="600px"
									width="900px"
									onLoad={e => {
										setImageRef(e.target);
									}}
									alt="crop"
								/>
							)}
							{toBeCropped && (
								<ReactCrop
									ruleOfThirds
									crossorigin="anonymous" // to avoid CORS-related problems
									onComplete={crop => cropImage(crop)}
									onChange={newCrop => setCrop(newCrop)}
									crop={crop}
								>
									<img
										src={selectedImage}
										className={styles.image}
										onLoad={e => {
											setImageRef(e.target);
										}}
										alt="crop"
									/>
								</ReactCrop>
							)}
						</div>

						<div className={styles.controls}>
							<button onClick={onTickHandler}>
								<Tick height={23} width={23} className={styles.tick} />
							</button>
							<button
								onClick={() => {
									if (!toBeCropped) {
										setToBeCropped(true);
										setCrop({
											x: 313.2890625,
											y: 200.828125,
											width: 265.2734375,
											height: 171.91796875,
											unit: "px",
										});
									} else {
										setToBeCropped(false);
										setCrop(null);
									}
								}}
							>
								{toBeCropped ? (
									<Close2 size={27} color={Colors.red} />
								) : (
									<CropIcon height={27} width={27} className={styles.crop} />
								)}
							</button>
							<button onClick={() => setThumbnailView(THUMBNAIL_VIEWS.PLAYER)}>
								<Delete height={23} width={23} className={styles.delete} />
							</button>
						</div>
					</>
				)}
				{thumbnailView === THUMBNAIL_VIEWS.PREVIEW && (
					<>
						{loading && <Spinner className={styles.spinner} />}
						<div
							classsName={styles.videoPlayer}
							style={{ display: loading ? "none" : "flex" }}
						>
							<VideoPlayer
								showControls={showCustomControls}
								setShowControls={setShowCustomControls}
								thumbnail={thumbnail}
								videosrc={video}
								width="900px"
								height="600px"
								recDuration={recDuration}
							/>
						</div>
					</>
				)}
			</div>
			<EmbedLinkModal
				isModal={generateLinkModal}
				onClose={generateLinkModalCloseHandler}
				embedLink={embedLink}
				thumbnailLink={thumbnailLink}
				mailInput={mailInput}
				setMailInput={setMailInput}
				signature={signature}
				onAddVideoModalClose={onAddVideoModalClose}
				videoId={deleteVideoId}
			/>
		</div>
	);
};

export default ThumbnailView;
