import { useRecoilValue } from "recoil";
import { InputThemes } from "@cadence-frontend/themes";
import { Input, Select } from "@cadence-frontend/widgets";
import React, { useEffect, useState } from "react";
import { getWaitTimeOptions } from "../../constants";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./WaitTime.module.scss";
import { ErrorBoundary } from "@cadence-frontend/components";
const ConvertFromMinutes = mins => {
	let h = Math.floor(mins / 60);
	let d = Math.floor(h / 24);
	h = h - d * 24;
	let m = Math.floor(mins % 60);
	if (mins % 1440 === 0) return { time: d, duration: "days" };
	else if (mins % 60 === 0) return { time: h, duration: "hours" };
	return { time: m, duration: "mins" };
};

const convertToMinutes = (t, d) => {
	if (d === "mins") return t;
	else if (d === "hours") return t * 60;
	return t * 1440;
};

const WaitTime = ({ mins, name, setValue }) => {
	const [time, setTime] = useState(0);
	const [duration, setDuration] = useState("days");
	const user = useRecoilValue(userInfo);
	useEffect(() => {
		const { time: initialTime, duration: initialDuration } = ConvertFromMinutes(mins);
		setTime(initialTime);
		setDuration(initialDuration);
	}, []);

	useEffect(() => {
		const mins = convertToMinutes(time, duration);

		setValue(prev => {
			return {
				...prev,
				[name]: parseInt(mins),
			};
		});
	}, [time, duration]);

	return (
		<ErrorBoundary>
			<>
				<Input
					type="number"
					width="30px"
					height="30px"
					value={time}
					setValue={setTime}
					theme={InputThemes.GREY}
					className={styles.input}
				/>
				<Select
					height="32px"
					width="114px"
					borderRadius={"5px"}
					className={styles.select}
					border={false}
					options={getWaitTimeOptions(user)}
					background={"rgba(122, 142, 231, 0.05)"}
					value={duration}
					setValue={setDuration}
				/>
			</>
		</ErrorBoundary>
	);
};

export default WaitTime;
