import { Play } from "@cadence-frontend/icons";
import styles from "./ThumbnailDisplay.module.scss";

const ThumbnailDisplay = ({
	setVideoSrc,
	videoData,
	setShowVideoPlayer,
	setVideoDuration,
}) => {
	const thumbnailClickHandler = () => {
		setVideoDuration(videoData?.video_duration);
		setVideoSrc(videoData?.video_url);
		setShowVideoPlayer(true);
	};
	return (
		<div className={styles.thumbnailDisplay} onClick={() => thumbnailClickHandler()}>
			<img src={videoData?.thumbnail_url} alt="thumbnail" />
			<Play className={styles.playIcon} />
		</div>
	);
};

export default ThumbnailDisplay;
