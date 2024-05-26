import styles from "./Timer.module.scss";
import { useEffect, useState } from "react";

const Timer = ({ running, startTimer, setTimerEnded }) => {
	const [countDown, setCountDown] = useState(180000);
	const [days, hours, minutes, seconds] = getReturnValues(countDown);
	useEffect(() => {
		const interval = setInterval(() => {
			if (running) {
				setCountDown(prev => prev - 1000);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [countDown, running]);
	useEffect(() => {
		startTimer(false);
	}, []);

	useEffect(() => {
		if (days + hours + minutes + seconds <= 0) {
			setTimerEnded(true);
		}
	}, [minutes]);

	return (
		<div className={styles.timer} style={{ fontWeight: "600" }}>
			{!running && (
				<>
					<div className={styles.redDot}></div>
					<div className={styles.time}>
						{/* <span>00</span> */}
						{/* <span>:</span> */}
						<span>03</span>
						<span>:</span>
						<span>00</span>
					</div>
				</>
			)}
			{running && (
				<>
					<div className={styles.redDot}></div>
					<div className={styles.time}>
						{/* <span> */}
						{/* 	{hours && "0"} */}
						{/* 	{hours} */}
						{/* </span> */}
						{/* <span>:</span> */}
						<span>
							{minutes && "0"}
							{minutes}
						</span>
						<span>:</span>
						<span>
							{seconds < 10 && "0"}
							{seconds}
						</span>
					</div>
				</>
			)}
		</div>
	);
	// }
};

const getReturnValues = countDown => {
	// calculate time left
	const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
	const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
	return [days, hours, minutes, seconds];
};

export default Timer;
