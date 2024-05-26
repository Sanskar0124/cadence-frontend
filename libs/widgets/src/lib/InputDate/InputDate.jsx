/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Select } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import { DateData } from "./utils";

import { MONTH_TYPE_OPTIONS, YEAR_TYPE_OPTIONS } from "@cadence-frontend/constants";
import moment from "moment-timezone";
import "./InputDate.scss";

const InputDate = ({ value, setValue, aheadOfDate = false, className, ...rest }) => {
	const currentDate = new Date();

	const [aheadDateOptions, setAheadDateOptions] = useState([]);
	// const { addError } = useContext(MessageContext);

	let year = currentDate.getFullYear(); // yyyy
	let month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // mm
	let day = ("0" + currentDate.getDate()).slice(-2); // dd

	const getEpochTime = () => {
		const { DD, MM, YYYY, time } = value;
		try {
			if (!DD || !MM || !YYYY || !time) throw new Error();
			return Math.floor(
				new Date(
					moment(`${DD}${MM}${YYYY}${time}`, "DDMMYYYYHH:mm").toISOString()
				).getTime()
			);
		} catch (err) {
			// addError("Please select a valid date and time");
			return null;
		}
	};

	useEffect(() => {
		if (aheadOfDate) {
			const dateConst = getEpochTime();
			if (dateConst === 0) return;
			if (dateConst <= Date.now()) {
				setValue(prevValue => ({
					...prevValue,
					MM: month,
					DD: day,
				}));
			}
		}
	}, [aheadDateOptions]);

	const getDaysInMonth = (currentDate, selectedDate) => {
		const { YYYY, MM } = selectedDate;

		if (MM === "MM") return null;

		var firstDayOfMonth = new Date(YYYY, MM - 1, 1).getDate();
		var lastDayOfMonth = new Date(YYYY, MM, 0).getDate();

		const DATE_MAP_OPTIONS = new Array(lastDayOfMonth - firstDayOfMonth + 1)
			.fill(0)
			.map((_, index) => {
				return {
					label: `${index + 1}`,
					value: `0${index + 1}`.slice(-2),
				};
			});

		if (+YYYY === +year && +MM === +month) {
			return DATE_MAP_OPTIONS.filter(
				option => Number(option.label) >= Number(currentDate.getDate())
			);
		}

		return DATE_MAP_OPTIONS;
	};

	// const firstRender = useRef(true);

	useEffect(() => {
		setAheadDateOptions([
			{
				name: "DD",
				options: getDaysInMonth(currentDate, value),
			},
			{
				name: "MM",
				options:
					+value.YYYY === +year
						? MONTH_TYPE_OPTIONS.filter(
								option => Number(option.value) >= Number(currentDate.getMonth()) + 1
						  )
						: MONTH_TYPE_OPTIONS,
			},
			{
				name: "YYYY",
				options: YEAR_TYPE_OPTIONS,
			},
		]);
	}, [value.MM]);

	useEffect(() => {
		setAheadDateOptions([
			{
				name: "DD",
				options: getDaysInMonth(currentDate, value),
			},
			{
				name: "MM",
				options:
					+value.YYYY === +year
						? MONTH_TYPE_OPTIONS.filter(
								option => Number(option.value) >= Number(currentDate.getMonth()) + 1
						  )
						: MONTH_TYPE_OPTIONS,
			},
			{
				name: "YYYY",
				options: YEAR_TYPE_OPTIONS,
			},
		]);
	}, [value.YYYY]);

	// useEffect(() => {
	// 	setAheadDateOptions(prevOptions => [
	// 		{
	// 			name: "DD",
	// 			options: [{ label: "DD", value: "-1" }].concat(
	// 				getDaysInMonth(currentDate, value)
	// 			),
	// 		},
	// 		{
	// 			name: "MM",
	// 			options:
	// 				+value.YYYY === +year
	// 					? MONTH_TYPE_OPTIONS.filter(
	// 							option => Number(option.value) >= Number(currentDate.getMonth()) + 1
	// 					  )
	// 					: MONTH_TYPE_OPTIONS,
	// 		},
	// 		{
	// 			name: "YYYY",
	// 			options: YEAR_TYPE_OPTIONS,
	// 		},
	// 	]);
	// }, [value.MM]);

	function resetDate(inputDate) {
		const { YYYY } = inputDate;
		if (YYYY) {
			if (inputDate) {
				if (+YYYY === +currentDate.getFullYear()) {
					return {
						...inputDate,
						MM: `0${currentDate.getMonth() + 1}`.slice(-2),
					};
				} else {
					return {
						...inputDate,
						MM: `01`,
					};
				}
			}
		}
	}

	return (
		<div className={`input-date ${className}`} {...rest}>
			<div className="input-fields">
				{!aheadOfDate &&
					DateData.map(obj => {
						return (
							<div className={obj.name} key={obj.name}>
								<Select
									name={obj.name}
									options={obj.options}
									value={value}
									setValue={setValue}
									placeholder={obj.name}
									{...rest}
								/>
							</div>
						);
					})}
				{aheadOfDate &&
					aheadDateOptions?.map(obj => {
						return (
							<div className={obj.name} key={obj.name}>
								<Select
									name={obj.name}
									options={obj.options}
									value={value}
									setValue={setValue}
									placeholder={obj.name}
									{...rest}
								/>
							</div>
						);
					})}
			</div>{" "}
		</div>
	);
};

export default InputDate;
