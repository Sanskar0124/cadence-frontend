import { Close, Pause, Play } from "@cadence-frontend/icons";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { Skeleton, Spinner, Tooltip } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./TemplateSidebarPlayer.module.scss";

const TemplateSidebarPlayer = ({
	videosrc,
	thumbnailSrc,
	duration,
	onClose,
	templateLevel,
	showCloseButton = false,
	leftCloseIcon = false,
	height = "100%",
	width = "100%",
}) => {
	const videoElement = useRef(null);

	const [showControls, setShowControls] = useState(false);
	const [seekedTime, setSeekedTime] = useState("00:00");
	const [playerLoading, setPlayerLoading] = useState(true);
	const [bufferLoading, setBufferLoading] = useState(false);
	const { addError } = useContext(MessageContext);
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
			videoElement.current.seekTo(duration, "seconds");
		} else {
			const progress = (manualChange / 100) * duration;
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

	useEffect(() => {
		setShowControls(false);
		setPlayerLoading(true);
		setPlayerState({ ...playerState, isPlaying: false });
	}, [videosrc]);

	return (
		<div className={styles.templateSidebarPlayer}>
			{/* <div className={styles.player}> */}
			<div className={styles.videoPlayer}>
				<Skeleton
					style={{
						display: playerLoading ? "flex" : "none",
						width: "350px",
						height: "200px",
					}}
					className={styles.loader}
				/>
				{bufferLoading && (
					<div
						// style={{
						// 	width: "350px",
						// 	height: "200px",
						// }}
						className={styles.spinnerWrapper}
					>
						<Spinner className={styles.bufferLoading} />
					</div>
				)}
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
				<ReactPlayer
					onReady={() => {
						console.log("running");
						setPlayerLoading(false);
						setShowControls(true);
					}}
					style={{
						display: !playerLoading ? "flex" : "none",
						overflow: "hidden",
						borderRadius: "10px",
					}}
					onBuffer={() => {
						console.log("buffering");
						setShowControls(false);
						setBufferLoading(true);
					}}
					onBufferEnd={() => {
						console.log("no buffering");
						setShowControls(true);
						setBufferLoading(false);
					}}
					onProgress={seekedTime => {
						const progress =
							(Math.floor(seekedTime.playedSeconds) / Math.floor(duration)) * 100;

						handleOnTimeUpdate(progress);
						setSeekedTime(seekedTime.playedSeconds);
					}}
					onDuration={duration => {
						console.log(duration);
						// setVideoDuration(duration);
					}}
					onPlay={() => {
						setPlayerState({ ...playerState, isPlaying: true });
					}}
					onPause={() => {
						setPlayerState({ ...playerState, isPlaying: false });
					}}
					playing={playerState.isPlaying}
					onError={e => {
						console.log(e);
						addError({ text: "An error occured try again later" });
					}}
					url={videosrc}
					ref={videoElement}
					id="v"
					playIcon={<Play style={{ height: "60px", width: "60px", color: "white" }} />}
					config={{
						options: {
							allowfullscreen: true,
						},
					}}
					height={height}
					width={width}
				/>
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
							00:{getTimeFromSeconds(seekedTime)} / 00:
							{getTimeFromSeconds(duration)}
						</div>
						<div className={styles.fullScreen}></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TemplateSidebarPlayer;
