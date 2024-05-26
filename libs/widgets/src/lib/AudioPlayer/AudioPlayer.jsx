import { useEffect, useRef, useState } from "react";
import { PauseGradient, PlayGradient } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import "./AudioPlayer.scss";

const AudioPlayer = ({ source, disabled }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [seekValue, setSeekValue] = useState("0");
	const [TotalDuration, setTotalDuration] = useState("0:00");
	const audio = useRef(null);
	const durationContainer = useRef(null);
	const seekSlider = useRef(null);
	const playIconContainer = useRef(null);

	const calculateTime = secs => {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${returnedSeconds}`;
	};

	const displayDuration = duration => {
		setTotalDuration(calculateTime(duration));
	};

	const setSliderMax = duration => {
		seekSlider.current.max = Math.floor(duration);
	};

	const handleControl = () => {
		if (isPlaying) {
			audio.current.pause();
		} else {
			audio.current.play();
		}
		setIsPlaying(curr => !curr);
	};

	const onTimeUpdate = () => {
		setSeekValue(Math.floor(audio.current.currentTime).toString());
	};

	const onSeekValueChange = e => {
		audio.current.currentTime = e.target.value;
		setSeekValue(e.target.value);
	};

	const onLoadedMetadata = () => {
		displayDuration(audio.current.duration);
		setSliderMax(audio.current.duration);
	};

	useEffect(() => {
		if (seekValue == Math.floor(audio.current.duration)) {
			setIsPlaying(false);
			setSeekValue("0");
		}
	}, [seekValue]);

	return (
		<div className="crm-audio-player">
			<audio
				className="audio-player"
				src={source}
				ref={audio}
				preload="metadata"
				onTimeUpdate={onTimeUpdate}
				type="audio/mpeg"
				onLoadedMetadata={onLoadedMetadata}
			/>
			<div className="controls">
				<div
					disabled={disabled}
					className={`control-button ${isPlaying ? "playing" : "paused"}`}
					onClick={handleControl}
					ref={playIconContainer}
					title={disabled ? "No Recording" : undefined}
				>
					{isPlaying ? <PauseGradient size="31px" /> : <PlayGradient size="22px" />}
				</div>
				<input
					type="range"
					value={seekValue}
					onChange={onSeekValueChange}
					className="seek-slider"
					max="100"
					ref={seekSlider}
					// hidden={isPlaying ? false : true}
				/>
				<span ref={durationContainer} className="duration">
					{`${calculateTime(seekValue)} / ${TotalDuration}`}
				</span>
			</div>
		</div>
	);
};

export default AudioPlayer;
