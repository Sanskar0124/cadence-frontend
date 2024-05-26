import React, { useState, useEffect } from "react";
import styles from "./Timezone.module.scss";
import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Close, Tick } from "@cadence-frontend/icons";
import { getBusinessHour, FILTER_ENUMS } from "../../constants";
import { getGMTtext, convert12HourTo24Hour } from "./constants";
import moment from "moment";

const Timezone = ({
	open,
	setOpen,
	leadTimezones,
	leadTimezoneLoading,
	filters,
	handleMultiselectTimezone,
}) => {
	const [showOverlay, setShowOverlay] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [timezones, setTimezone] = useState([]);

	useEffect(() => {
		if (leadTimezones) setTimezone(leadTimezones);
	}, [leadTimezones]);

	useEffect(() => {
		if (open) setShowOverlay(true);
	}, [open]);

	const onAnimationEnd = () => {
		if (!open) setShowOverlay(false);
	};
	const onClose = () => {
		setOpen(false);
	};

	return (
		showOverlay && (
			<div className={`${styles.wrapper} ${open ? styles.open : ""}`}>
				<div
					className={`${styles.container} ${open ? styles.open : styles.close}`}
					onAnimationEnd={onAnimationEnd}
				>
					<ThemedButton
						onClick={onClose}
						className={styles.closeBtn}
						theme={ThemedButtonThemes.ICON}
					>
						<Close color={"#000"} />
					</ThemedButton>
					<div className={styles.title}>Select a timezone</div>

					<SearchBar
						width="100%"
						height="50px"
						value={searchValue}
						setValue={setSearchValue}
					/>

					<div className={styles.timezonesList}>
						{timezones
							.filter(tz =>
								tz.Task.Lead.Lead_phone_numbers[0]?.timezone
									.toLowerCase()
									?.includes(searchValue.toLowerCase())
							)
							.map((item, i) => (
								<div
									className={`${styles.singleTimezone} ${
										filters.lead_timezones?.includes(
											item.Task.Lead.Lead_phone_numbers[0]?.timezone
										)
											? styles.selected
											: ""
									}`}
									onClick={() =>
										handleMultiselectTimezone(
											item.Task.Lead.Lead_phone_numbers[0]?.timezone,
											FILTER_ENUMS.LEAD_TIMEZONES
										)
									}
									key={i}
								>
									<div className={styles.header}>
										<div className={styles.timezoneTitle}>
											<div className={styles.top}>
												<p>
													{convert12HourTo24Hour(
														item.Task.Lead.Lead_phone_numbers[0]?.time
													)}
													,{" "}
													{item.Task.Lead.Lead_phone_numbers[0]?.timezone
														.split("/")
														.pop()}{" "}
													(GMT
													{moment()
														.tz(item.Task.Lead.Lead_phone_numbers[0]?.timezone)
														.format("Z")}
													)
												</p>
												<span
													className={`${styles.dot} ${
														getBusinessHour(item.Task.Lead.Lead_phone_numbers[0]?.time)
															? styles.active
															: styles.unactive
													}`}
												></span>
											</div>
											<p className={styles.taskDone}>{item.count} tasks</p>
										</div>
										{filters.lead_timezones?.includes(
											item.Task.Lead.Lead_phone_numbers[0]?.timezone
										) && (
											<div className={styles.tick}>
												<Tick />
											</div>
										)}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		)
	);
};

export default Timezone;
