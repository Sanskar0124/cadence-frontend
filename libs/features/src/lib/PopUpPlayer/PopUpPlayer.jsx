import { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

import { Pause, Play, RingoverLogoWithText } from "@cadence-frontend/icons";
import { Skeleton, Spinner } from "@cadence-frontend/components";
import { useVideoTemplate } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import { ENV } from "@cadence-frontend/environments";

import styles from "./PopUpPlayer.module.scss";

const PopUpPlayer = ({ height = "90vh", width = "85%" }) => {
	const params = useParams();
	const video_tracking_id = params.video_tracking_id;

	const { addError } = useContext(MessageContext);

	const videoElement = useRef(null);

	const { updateVideoStats, getVideo } = useVideoTemplate();

	const [videosrc, setVideosrc] = useState(null);
	const [showControls, setShowControls] = useState(false);
	const [seekedTime, setSeekedTime] = useState("00:00");
	const [videoDuration, setVideoDuration] = useState("00:00");
	const [playerLoading, setPlayerLoading] = useState(true);
	const [bufferLoading, setBufferLoading] = useState(false);
	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		progress: 0,
	});

	useEffect(() => {
		const payload = { video_tracking_id: video_tracking_id };
		getVideo(payload, {
			onSuccess: data => {
				setVideosrc(
					`${ENV.BACKEND}/v2/sales/department/video/stream/${data.data.video_id}`
				);
				setVideoDuration(data?.data?.video_duration);
			},
		});
	}, []);

	const togglePlay = () => {
		setPlayerState({
			...playerState,
			isPlaying: !playerState.isPlaying,
		});
	};

	const handleOnTimeUpdate = progress => {
		setPlayerState({
			...playerState,
			progress,
		});
	};

	const handleVideoProgress = event => {
		const manualChange = Number(event.target.value);
		if (manualChange === 100) {
			videoElement.current.seekTo(videoDuration, "seconds");
		} else {
			const progress = (manualChange / 100) * videoDuration;
			videoElement.current.seekTo(progress, "seconds");
		}
		setPlayerState({
			...playerState,
			progress: manualChange,
		});
	};

	const updateStats = () => {
		const obj = {
			video_tracking_id: video_tracking_id,
			watch_duration: seekedTime,
		};
		updateVideoStats(obj, {
			onSuccess: data => {
				console.log(data);
			},
		});
	};

	const getTimeFromSeconds = seconds => {
		var hh = 0,
			mm = 0,
			ss = 0,
			t = "";

		if (seconds > 0) {
			// Multiply by 1000 because Date() requires miliseconds

			var date = new Date(seconds * 1000);
			hh = date.getUTCHours();
			mm = date.getUTCMinutes();
			ss = date.getSeconds();
		}

		// Make sure there are two-digits
		if (hh != 0) {
			if (hh < 10) {
				t += "0" + hh + ":";
			} else {
				t += hh + ":";
			}
		}
		if (mm < 10) {
			t += "0" + mm + ":";
		} else {
			t += mm + ":";
		}
		if (ss < 10) {
			t += "0" + ss;
		} else {
			t += ss;
		}
		return t;
	};

	const handleKeyDown = e => {
		if (e.key == " " || e.code == "Space") togglePlay();
	};

	// const handleClickFullscreen = () => {
	// 	console.log("click");
	// 	if (screenfull.isEnabled) {
	// 		screenfull.request(videoElement.current.wrapper);
	// 	}
	// };

	return (
		<div className={styles.popUpPlayer} onKeyDown={handleKeyDown} tabIndex="0">
			<div className={styles.wrapper}>
				<div className={styles.logo}>
					<RingoverLogoWithText />
				</div>
				<div
					className={`${styles.player}  ${playerState.isPlaying ? styles.playing : ""}`}
					onClick={togglePlay}
				>
					{bufferLoading && (
						<div
							style={{
								width: width,
								height: height,
							}}
							className={styles.spinnerWrapper}
						>
							<Spinner
								style={{ height: height, width: width }}
								className={styles.bufferLoading}
							/>
						</div>
					)}
					{/* <FullScreen
							style={{ display: !playerLoading ? "flex" : "none" }}
							// onClick={handleClickFullscreen}
							height={30}
							width={30}
							className={styles.fullScreenIcon}
						/> */}
					{playerLoading && <Skeleton className={styles.loader} />}
					<ReactPlayer
						onReady={() => {
							setPlayerLoading(false);
							setShowControls(true);
						}}
						style={{
							display: !playerLoading ? "flex" : "none",
							overflow: "hidden",
							borderRadius: "10px",
						}}
						onBuffer={() => {
							setShowControls(false);
							setBufferLoading(true);
						}}
						onBufferEnd={() => {
							setShowControls(true);
							setBufferLoading(false);
						}}
						onProgress={seekedTime => {
							const progress =
								(Math.floor(seekedTime.playedSeconds) / Math.floor(videoDuration)) * 100;

							handleOnTimeUpdate(progress);
							setSeekedTime(seekedTime.playedSeconds);
						}}
						onDuration={duration => {
							// setVideoDuration(duration);
						}}
						onPlay={() => {
							setPlayerState({ ...playerState, isPlaying: true });
						}}
						onPause={() => {
							updateStats();
							setPlayerState({ ...playerState, isPlaying: false });
						}}
						playing={playerState.isPlaying}
						onEnded={() => updateStats()}
						onError={e => {
							addError({ text: "An error occured try again later" });
						}}
						url={videosrc}
						ref={videoElement}
						id="v"
						height="100%"
						// width="100vh"
						width="100%"
						playIcon={<Play style={{ height: "60px", width: "60px", color: "white" }} />}
						config={{
							options: {
								allowfullscreen: true,
							},
						}}
					/>
					{showControls && (
						<div className={`${styles.controls}`}>
							<button onClick={togglePlay}>
								{!playerState.isPlaying ? (
									<Play className={styles.actions} />
								) : (
									<Pause className={styles.actions} />
								)}
							</button>
							<input
								type="range"
								min="0"
								max="100"
								value={playerState.progress}
								onChange={e => handleVideoProgress(e)}
							/>
							<div className={styles.time}>
								00:{getTimeFromSeconds(seekedTime)} / 00:
								{getTimeFromSeconds(videoDuration)}
							</div>
							{/* <div className={styles.fullScreen}></div> */}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PopUpPlayer;
