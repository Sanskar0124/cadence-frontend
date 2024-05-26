import moment from "moment-timezone";
import React, { useEffect, useState } from "react";

const EachDates = ({
	current,
	x,
	theme,
	setEventShown,
	eventsEachDay,
	styles,
	eventShown,
	todayDateClassName,
	THEMES,
	name,
	setValue,
	value,
	index,
}) => {
	const [validDate, setValidDate] = useState(false);

	const getDaysBetweenDates = (startDate, endDate) => {
		let dates = [];
		if (startDate && endDate) {
			let parseStartDate = moment(`${startDate.YYYY}-${startDate.MM}-${startDate.DD}`); // now
			let parseEndDate = moment(`${endDate.YYYY}-${endDate.MM}-${endDate.DD}`);

			while (parseStartDate.isSameOrBefore(parseEndDate)) {
				dates.push(parseStartDate.format("YYYY/DD/MM"));
				parseStartDate.add(1, "days");
			}
			return dates?.map(d => {
				if (d) {
					let date = d.split("/");
					return { DD: date[1], MM: date[2], YYYY: Number(date[0]) };
				} else {
					return d;
				}
			});
		} else {
			return dates;
		}
	};

	const dateHandle = x => {
		if (setValue) {
			if (typeof value === "number")
				setValue(
					moment(current)
						.add(x - 1, "days")
						.unix() * 1000
				);
			// setValue(prev => ({
			// 	...prev,
			// 	[name]: {
			// 		...prev[name],
			// 		DD: moment(current)
			// 			.add(x - 1, "days")
			// 			.format("DD"),
			// 		MM: moment(current).format("MM"),
			// 		YYYY: current?.year(),
			// 	},
			// }));
			else
				setValue(prev => {
					if (!value?.starts && !value?.ends) {
						return {
							...prev,
							[name]: {
								...prev[name],
								starts: {
									DD: moment(current)
										.add(x - 1, "days")
										.format("DD"),
									MM: moment(current).format("MM"),
									YYYY: current?.year(),
								},
							},
						};
					} else if (value?.starts && value?.ends) {
						const currentDate = `${moment(current).format("MM")}-${moment(current)
							.add(x - 1, "days")
							.format("DD")}-${current?.year()}`;
						const parseStartsSelectedDate = `${value?.starts?.MM}-${value?.starts?.DD}-${value?.starts?.YYYY}`;
						const parseEndsSelectedDate = `${value?.ends?.MM}-${value?.ends?.DD}-${value?.ends?.YYYY}`;

						if (new Date(currentDate) < new Date(parseStartsSelectedDate)) {
							return { ...prev, [name]: { starts: "", ends: "" } };
						} else if (
							JSON.stringify(value.starts) <
								JSON.stringify({
									DD: moment(current)
										.add(x - 1, "days")
										.format("DD"),
									MM: moment(current).format("MM"),
									YYYY: current?.year(),
								}) &&
							JSON.stringify(value.ends) <
								JSON.stringify({
									DD: moment(current)
										.add(x - 1, "days")
										.format("DD"),
									MM: moment(current).format("MM"),
									YYYY: current?.year(),
								})
						) {
							return {
								...prev,
								[name]: {
									...prev[name],
									ends: {
										DD: moment(current)
											.add(x - 1, "days")
											.format("DD"),
										MM: moment(current).format("MM"),
										YYYY: current?.year(),
									},
								},
							};
						} else if (
							new Date(parseEndsSelectedDate) < new Date(parseStartsSelectedDate)
						) {
							return { ...prev, [name]: { starts: "", ends: "" } };
						} else if (
							new Date(currentDate) > new Date(parseStartsSelectedDate) &&
							new Date(currentDate) > new Date(parseEndsSelectedDate)
						) {
							return {
								...prev,
								[name]: {
									...prev[name],
									ends: {
										DD: moment(current)
											.add(x - 1, "days")
											.format("DD"),
										MM: moment(current).format("MM"),
										YYYY: current?.year(),
									},
								},
							};
						} else if (
							new Date(currentDate) > new Date(parseStartsSelectedDate) &&
							new Date(currentDate) < new Date(parseEndsSelectedDate)
						) {
							return {
								...prev,
								[name]: {
									...prev[name],
									starts: {
										DD: moment(current)
											.add(x - 1, "days")
											.format("DD"),
										MM: moment(current).format("MM"),
										YYYY: current?.year(),
									},
								},
							};
						} else {
							const parseStartsSelectedDate = `${value?.starts?.MM}-${value?.starts?.DD}-${value?.starts?.YYYY}`;
							const parseEndsSelectedDate = `${value?.ends?.MM}-${value?.ends?.DD}-${value?.ends?.YYYY}`;

							if (
								parseStartsSelectedDate &&
								JSON.stringify(value.starts).includes(
									JSON.stringify({
										DD: moment(current)
											.add(x - 1, "days")
											.format("DD"),
										MM: moment(current).format("MM"),
										YYYY: current?.year(),
									})
								)
							) {
								return { ...prev, [name]: { starts: "", ends: "" } };
							} else if (
								parseEndsSelectedDate &&
								JSON.stringify(value.ends).includes(
									JSON.stringify({
										DD: moment(current)
											.add(x - 1, "days")
											.format("DD"),
										MM: moment(current).format("MM"),
										YYYY: current?.year(),
									})
								)
							) {
								return { ...prev, [name]: { ...prev[name], ends: "" } };
							} else {
								return { ...prev, [name]: { starts: "", ends: "" } };
							}
						}
					} else {
						const currentDate = `${moment(current).format("MM")}-${moment(current)
							.add(x - 1, "days")
							.format("DD")}-${current?.year()}`;

						const parseStartsSelectedDate = `${value?.starts?.MM}-${value?.starts?.DD}-${value?.starts?.YYYY}`;

						if (
							parseStartsSelectedDate &&
							new Date(parseStartsSelectedDate) > new Date(currentDate)
						) {
							return { ...prev, [name]: { starts: "", ends: "" } };
						}

						return {
							...prev,
							[name]: {
								...prev[name],
								ends: {
									DD: moment(current)
										.add(x - 1, "days")
										.format("DD"),
									MM: moment(current).format("MM"),
									YYYY: current?.year(),
								},
							},
						};
					}
				});
		}
	};

	return (
		<div
			onClick={() => {
				if (THEMES.ARROW_MONTH_YEAR == theme) {
					dateHandle(x);
				}
				setEventShown({
					date: moment(current).date(x).toISOString(),
					events: eventsEachDay[x - 1],
				});
			}}
			className={`${styles.day} ${
				(JSON.stringify(value.starts)?.includes(
					JSON.stringify({
						DD: moment(current)
							.add(x - 1, "days")
							.format("DD"),
						MM: moment(current).format("MM"),
						YYYY: current?.year(),
					})
				) ||
					JSON.stringify(value.ends)?.includes(
						JSON.stringify({
							DD: moment(current)
								.add(x - 1, "days")
								.format("DD"),
							MM: moment(current).format("MM"),
							YYYY: current?.year(),
						})
					)) &&
				styles.active
			} 
            
           
            ${
							getDaysBetweenDates(value.starts, value.ends)?.some(
								(date, i, array) =>
									i !== 0 &&
									i !== array.length - 1 &&
									JSON.stringify(date)?.includes(
										JSON.stringify({
											DD: moment(current)
												.add(x - 1, "days")
												.format("DD"),
											MM: moment(current).format("MM"),
											YYYY: current?.year(),
										})
									)
							)
								? styles.ranges
								: ""
						}
            
            `}
			key={`day-${x}`}
		>
			<span>{x}</span>

			{eventsEachDay[x - 1]?.length >= 5 && (
				<div
					className={`${styles.event} ${
						eventShown.date === moment(current).date(x).toISOString() && styles.active
					}`}
					tabIndex="0"
				/>
			)}
		</div>
	);
};

export default EachDates;

// ${todayDateClassName ? todayDateClassName : ""}
