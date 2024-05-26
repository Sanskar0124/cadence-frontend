import { Close, Pause, Play } from "@cadence-frontend/icons";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { Tooltip } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./VideoPlayer.module.scss";

const VideoPlayer = ({
	videosrc,
	thumbnail,
	showControls,
	setShowControls,
	recDuration,
	height = "600px",
	width = "900px",
	showCloseButton = false,
	leftCloseIcon = false,
	onClose,
}) => {
	const videoElement = useRef(null);
	const [seekedTime, setSeekedTime] = useState("00:00");
	const [videoDuration, setVideoDuration] = useState("00:00");

	const [playerState, setPlayerState] = useState({
		isPlaying: false,
		progress: 0,
	});

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

	return (
		<div style={{ height: height, width: width }} className={styles.videoPlayer}>
			{showCloseButton && (
				<ThemedButton
					className={`${styles.closeIcon} ${leftCloseIcon ? styles.leftClose : ""} `}
					onClick={onClose}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text="Close" theme={TooltipThemes.BOTTOM} span>
						<Close color={"#567191"} />
					</Tooltip>
				</ThemedButton>
			)}
			<div onClick={togglePlay}>
				<ReactPlayer
					onReady={() => {
						console.log("running");
					}}
					onProgress={seekedTime => {
						const progress = recDuration
							? (Math.ceil(seekedTime.playedSeconds) / Math.floor(videoDuration)) * 100
							: (Math.floor(seekedTime.playedSeconds) / Math.floor(videoDuration)) * 100;
						// console.log(progress);
						handleOnTimeUpdate(progress);
						setSeekedTime(seekedTime.playedSeconds);
					}}
					onDuration={duration => {
						if (recDuration) {
							// console.log(recDuration);
							setVideoDuration(recDuration / 1000);
						} else {
							setVideoDuration(duration);
						}
					}}
					onPlay={() => {
						setPlayerState({ ...playerState, isPlaying: true });
					}}
					onPause={() => {
						setPlayerState({ ...playerState, isPlaying: false });
					}}
					onClick={() => {
						if (!showControls) {
							setShowControls(true);
							setPlayerState({ ...playerState, isPlaying: true });
						} else console.log(null);
					}}
					playing={playerState.isPlaying}
					// playing={true}
					url={videosrc}
					ref={videoElement}
					id="v"
					light={thumbnail ? thumbnail : null}
					height={height}
					width={width}
					playIcon={<Play style={{ height: "60px", width: "60px", color: "white" }} />}
				/>
			</div>

			{showControls && (
				<div className={styles.controls}>
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
						00:{getTimeFromSeconds(seekedTime)} / 00:{getTimeFromSeconds(videoDuration)}
					</div>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
