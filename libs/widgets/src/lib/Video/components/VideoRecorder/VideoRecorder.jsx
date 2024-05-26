import { Stop, Video, VideoRecording } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useLocalStorage } from "@cadence-frontend/utils";
import { Button, Spinner } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import React, { useRef, useState, useEffect, useCallback, useContext } from "react";
import Webcam from "react-webcam";
import Timer from "../Timer/Timer";
import styles from "./VideoRecorder.module.scss";

const VideoRecorder = ({
	onClose,
	setView,
	views,
	setVideo,
	importVideohandler,
	startTimer,
	isTimer,
	setRecDuration,
	setIsRecording,
	showOpenTemplatesOption,
	openTemplatesClickHandler,
	setUploadVideoFile,
}) => {
	const [loading, setLoading] = useState(true);

	const webcamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const isInitialMount = useRef(true);

	const { addError } = useContext(MessageContext);

	const [webcamActive, setWebcamActive] = useLocalStorage("webcam-active");

	const [capturing, setCapturing] = useState(false);
	const [recordedChunks, setRecordedChunks] = useState([]);
	const [startTime, setStartTime] = useState();
	const [stopTime, setStopTime] = useState();
	const [timerEnded, setTimerEnded] = useState(false);

	useEffect(() => {
		// console.log("state", webcamActive);
		navigator.permissions.query({ name: "camera" }).then(res => {
			if (res.state == "granted") {
				// console.log("WEB CAM WORKS");
				setWebcamActive(true);
			} else {
				if (webcamActive === undefined || webcamActive === true) {
					addError({
						text: "Failed to start webcam. Please enable webcam access and try again.",
					});
				}
				// console.log("WEB CAM FAILED");
				setWebcamActive(false);
			}
		});
	}, []);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (!capturing) {
				handleDownload();
			}
		}
	}, [recordedChunks]);

	const urltoFile = (url, filename, mimeType) => {
		return fetch(url)
			.then(function (res) {
				return res.arrayBuffer();
			})
			.then(function (buf) {
				return new File([buf], filename, { type: mimeType });
			});
	};

	const handleStartCaptureClick = React.useCallback(() => {
		setCapturing(true);
		mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
			mimeType: "video/webm",
		});
		mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
		mediaRecorderRef.current.start();
		startTimer(true);
	}, [webcamRef, setCapturing, mediaRecorderRef]);

	const handleDataAvailable = React.useCallback(
		({ data }) => {
			if (data.size > 0) {
				setRecordedChunks(prev => prev.concat(data));
			}
		},
		[setRecordedChunks]
	);

	useEffect(() => {
		if (timerEnded) {
			mediaRecorderRef.current?.stop();
			setStopTime(new Date().getTime());
			setCapturing(false);
		}
	}, [timerEnded]);

	const handleStopCaptureClick = React.useCallback(() => {
		mediaRecorderRef.current.stop();
		setCapturing(false);
	}, [mediaRecorderRef, webcamRef, setCapturing]);

	const handleDownload = React.useCallback(() => {
		if (recordedChunks.length) {
			const blob = new Blob(recordedChunks, {
				type: "video/webm",
			});
			// const url = URL.createObjectURL(blob);
			setRecDuration(stopTime - startTime);
			var reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function () {
				var base64data = reader.result;
				setVideo(base64data);
				urltoFile(base64data, "recording.webm", "video/webm").then(file => {
					// console.log(file);
					setUploadVideoFile(file);
				});
			};
			setView(views.THUMBNAIL);
			setRecordedChunks([]);
		}
	}, [recordedChunks]);

	const videoConstraints = {
		height: 600, //set pic resolution
		width: 900, //set pic resolution
		facingMode: "user", //use front camera
	};

	return (
		<div className={styles.videoRecorder}>
			<div className={styles.header}>
				<ThemedButton
					width="fit-content"
					theme={ThemedButtonThemes.TRANSPARENT}
					onClick={onClose}
				>
					Back
				</ThemedButton>
				<Timer
					running={isTimer}
					onTimerEnd={handleStopCaptureClick}
					setTimerEnded={setTimerEnded}
					startTimer={startTimer}
				/>

				<div className={styles.right}>
					{showOpenTemplatesOption && (
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.TRANSPARENT}
							onClick={() => {
								openTemplatesClickHandler();
								mediaRecorderRef.current?.stop();
							}}
						>
							Open Templates
						</ThemedButton>
					)}
					<input
						type="file"
						style={{ display: "none" }}
						accept="video/"
						id="video-file"
						onChange={e => importVideohandler(e)}
					/>
					<label
						onClick={() => setIsRecording(false)}
						className={`${styles.importvideo} ${capturing ? styles.disabled : ""}`}
						htmlFor="video-file"
					>
						Import Video
					</label>
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.video}>
					{webcamActive
						? loading && <Spinner className={styles.spinner} />
						: loading && <h3 className={styles.spinner}>Webcam not enabled</h3>}
					<Webcam
						style={{ display: loading ? "none" : "flex" }}
						audio={true}
						muted={true}
						ref={webcamRef}
						videoConstraints={videoConstraints}
						height="100%"
						width="100%"
						onUserMedia={() => setLoading(false)}
						onUserMediaError={() => {
							// addError("Failed to start webcam. Please refresh and try again.");
						}}
					/>
				</div>

				<div style={{ display: loading ? "none" : "flex" }} className={styles.backdrop}>
					{!capturing ? (
						<div className={styles.ring}>
							<button
								themes={ThemedButtonThemes.RED}
								className={styles.recButton}
								onClick={() => {
									setStartTime(new Date().getTime());
									handleStartCaptureClick();
									setIsRecording(true);
								}}
							>
								<VideoRecording height={25} width={25} />
							</button>
						</div>
					) : (
						<button
							className={styles.stopButton}
							onClick={() => {
								setStopTime(new Date().getTime());
								handleStopCaptureClick();
							}}
						>
							<Stop height={25} width={25} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default VideoRecorder;
