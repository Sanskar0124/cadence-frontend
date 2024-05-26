import { Tick } from "@cadence-frontend/icons";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import styles from "./ThumbnailSelector.module.scss";
const ThumbnailSelector = ({
	video,
	images,
	setSelectedThumbnail,
	thumbnailViews,
	setThumbnailView,
	recDuration,
}) => {
	var scaleFactor = 1;
	const videoElement = useRef(null);
	const [progress, setProgress] = useState(0);
	const [seekedTime, setSeekedTime] = useState("00:00");

	useEffect(() => {
		const interval = setTimeout(() => {
			if (videoElement) {
				if (videoElement.current.duration === Infinity) {
					// get the recording time and then use it to set the progress
					videoElement.current.currentTime = 100;
				} else {
					console.log(videoElement.current.duration);
					const val = Math.floor((videoElement.current.duration / 100) * progress);
					console.log(val);
					videoElement.current.currentTime = val;
				}
			}
		}, 200);
		return () => clearInterval(interval);
	}, [progress, videoElement]);

	const shoot = video => {
		var canvas = capture(video, scaleFactor);
		var img_data = canvas.toDataURL("image/jpg");
		setSelectedThumbnail(img_data);
	};

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
		setSeekedTime(t);
		// return t;
	};
	return (
		<div className={styles.thumbnailSelector}>
			<div className={styles.display}>
				<video
					className={styles.video}
					src={video}
					onTimeUpdate={() => {
						getTimeFromSeconds(videoElement.current.currentTime);
					}}
					ref={videoElement}
				/>
				<div className={styles.tooltip}>
					<div>{seekedTime}</div>
				</div>
				<ThemedButton
					className={styles.setThumbnail}
					theme={ThemedButtonThemes.TRANSPARENT}
					width="191px"
					height="56px"
					onClick={() => {
						shoot(videoElement.current);
						setThumbnailView(thumbnailViews.CROP);
					}}
				>
					<Tick />
					Set as Thumbnail
				</ThemedButton>
			</div>
			<div className={styles.slider}>
				<div className={styles.images}>
					{images &&
						images.map((image, index) => {
							return (
								<img
									key={index}
									style={{ width: images.length === 7 ? "14.28%" : "16.67%" }}
									className={styles.image}
									src={image}
									alt="snap"
								/>
							);
						})}
				</div>

				<input
					type="range"
					className="sliderbar"
					min="0"
					max="100"
					value={progress}
					onChange={e => {
						setProgress(e.target.value);
					}}
				/>
			</div>
		</div>
	);
};

export default ThumbnailSelector;
