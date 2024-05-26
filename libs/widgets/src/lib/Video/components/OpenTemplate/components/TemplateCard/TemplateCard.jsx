import { InputRadio } from "@cadence-frontend/widgets";
import { forwardRef } from "react";
import ThumbnailDisplay from "../ThumbnailDisplay/ThumbnailDisplay";
import styles from "./TemplateCard.module.scss";

const TemplateCard = forwardRef(
	({
		data,
		setVideoSrc,
		setShowVideoPlayer,
		setVideoDuration,
		selected,
		setSelected,
		ref,
	}) => {
		return (
			<div
				ref={ref}
				className={`${styles.templateCard} ${
					selected?.vt_id === data?.vt_id ? styles.selected : null
				}`}
			>
				<div className={styles.thumbnail}>
					<ThumbnailDisplay
						videoData={data?.Video}
						setVideoSrc={setVideoSrc}
						setShowVideoPlayer={setShowVideoPlayer}
						setVideoDuration={setVideoDuration}
					/>
				</div>
				<div className={styles.about}>
					<div className={styles.title}>
						<h3>{data?.name}</h3>
						<InputRadio
							value={data}
							checked={selected?.vt_id === data?.vt_id}
							onChange={() => {
								setSelected(data);
							}}
							className={styles.radio}
						/>
					</div>
					<div className={styles.link}>
						<div>Link</div>
						<div style={{ fontWeight: "400", fontSize: "14px" }}>
							{data?.Video?.video_url}
						</div>
					</div>
				</div>
			</div>
		);
	}
);

export default TemplateCard;
