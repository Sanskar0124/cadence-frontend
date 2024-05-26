import { userInfo } from "@cadence-frontend/atoms";
import { ErrorBoundary } from "@cadence-frontend/components";
import { Input, Select } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { convertFromMinutes, convertToMinutes, getWaitTimeOptions } from "./constants";

const Duration = ({ mins, setValue }) => {
	const [time, setTime] = useState(0);
	const [duration, setDuration] = useState("days");
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		const { time: initialTime, duration: initialDuration } = convertFromMinutes(mins);
		setTime(initialTime);
		setDuration(initialDuration);
	}, []);

	useEffect(() => {
		const mins = convertToMinutes(time, duration);
		setValue(parseInt(mins));
	}, [time, duration]);

	return (
		<ErrorBoundary>
			<>
				<Input
					type="number"
					width="56px"
					height="40px"
					value={time}
					setValue={setTime}
					minValue={0}
				/>
				<Select
					height="40px"
					width="130px"
					options={getWaitTimeOptions(user)}
					value={duration}
					setValue={setDuration}
				/>
			</>
		</ErrorBoundary>
	);
};

export default Duration;
