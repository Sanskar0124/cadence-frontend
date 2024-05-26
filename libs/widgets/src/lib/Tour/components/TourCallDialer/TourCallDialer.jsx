import { useEffect, useState } from "react";
import styles from "./TourCallDialer.module.scss";
import { Call } from "@cadence-frontend/icons";
import { Button } from "@cadence-frontend/components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { tourInfo, userInfo } from "@cadence-frontend/atoms";

const CALL_RECORDING_URL = {
	ENGLISH: "https://cdn.ringover.com/sounds/1/ca4ef609-8daa-4dea-9700-b6108e3b8ca0.mp3",
	FRENCH: "https://cdn.ringover.com/sounds/1/004e109d-2918-412c-a4f1-dae9d4091532.mp3",
	SPANISH: "https://cdn.ringover.com/sounds/1/db25bffa-2843-41e0-ad4f-1138a96c3585.mp3",
};

const TourCallDialer = ({ dialer, setDialer, markTaskAsComplete }) => {
	const user = useRecoilValue(userInfo);
	const [duration, setDuration] = useState(0);
	const [callStatus, setCallStatus] = useState("connecting");
	const [tour, setTour] = useRecoilState(tourInfo);

	const onHangUp = () => {
		if (!tour?.currentStepCompleted)
			setTour(prev => ({ ...prev, currentStepCompleted: true }));
		markTaskAsComplete({
			isSampleTaskForTour: true,
			from_number: dialer?.from_number,
			to_number: dialer?.to_number,
		});
		setDialer(null);
	};

	useEffect(() => {
		if (duration === 0 && callStatus === "connecting") {
			setTimeout(() => {
				setCallStatus("connected");
			}, 2000);
			return;
		}
		if (duration > 12) return onHangUp();
		const timeout = setTimeout(() => {
			setDuration(prev => prev + 1);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [duration, callStatus]);

	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<div>
					<span>{dialer?.name}</span>
					<p>{dialer?.job_position}</p>
					<p>{dialer?.email}</p>
				</div>
				<div>
					<span>{dialer?.to_number}</span>
					<span>
						{callStatus === "connecting"
							? "connecting..."
							: `00:${duration.toString().padStart(2, "0")}`}
					</span>
				</div>
			</div>
			<img
				src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/dialer_controls.png"
				alt="controls"
			/>
			<div className={styles.button}>
				<Button onClick={onHangUp} id="hangup-call-btn">
					<Call size="2rem" />
				</Button>
			</div>
			{callStatus === "connected" && (
				<audio src={CALL_RECORDING_URL[user?.language?.toUpperCase()]} autoPlay />
			)}
		</div>
	);
};
export default TourCallDialer;
