/* eslint-disable no-self-assign */
/* eslint-disable no-console */
import { Calendar, DateTime, Smily, TriangleArrow } from "@cadence-frontend/icons";
import { Colors, useOutsideClickHandler } from "@cadence-frontend/utils";
import {
	InputDateCalendar,
	InputDateTimeCalendar,
	InputDateRangeCalendar,
	InputDateTimeRangeCalendar,
} from "@cadence-frontend/widgets";
import moment from "moment-timezone";
import { useRef, useState } from "react";
import styles from "../Input.module.scss";
import THEMES from "../themes";
import { isWholeNumStr, isDecimal, isInteger } from "../utils";
import EmojiPicker from "emoji-picker-react";

const InputMultiple = ({
	type,
	value,
	setValue,
	onClick,
	name,
	top = false,
	left = false,
	width = "100%",
	height = "40px",
	className,
	isDecimalAllowed = false,
	theme = "WHITE",
	maxValue = null,
	minValue = 0,
	disabled,
	showArrows = false,
	...rest
}) => {
	const [calendarDisplay, setCalendarDisplay] = useState(false);
	const [emoji, setEmoji] = useState(false);

	const modalRef = useRef();
	const emojiRef = useRef();
	const emojiDropdownRef = useRef();

	useOutsideClickHandler(
		modalRef,
		() => {
			setCalendarDisplay(false);
		},
		false
	);

	useOutsideClickHandler(
		emojiRef,
		() => {
			setEmoji(false);
		},
		false
	);

	useOutsideClickHandler(
		emojiDropdownRef,
		() => {
			setEmoji(false);
		},
		false
	);

	const emojiHandler = (emojiData, emojiObject) => {
		const emoji = emojiData?.emoji;
		setValue(prevState => {
			const prevValue = value.subject ? value.subject : "";
			return {
				...prevState,
				[name]: prevValue + emoji,
			};
		});
	};

	const onChange = e => {
		let value = e.target.value;
		if (type === "number") {
			if (value === "") {
				value = "";
			} else if (isDecimalAllowed && isDecimal(value)) {
				value = value;
			} else if (!isDecimalAllowed && isWholeNumStr(value)) {
				value = parseInt(value);
			} else {
				return;
			}

			if (maxValue && value > maxValue) value = maxValue;
			else if (value < minValue) value = minValue;
		}
		setValue(prevState => {
			return {
				...prevState,
				[e.target.name]: value,
			};
		});
	};
	switch (type) {
		case "textarea":
			return (
				<textarea
					value={value[name] || ""}
					onChange={onChange}
					style={{ width, height }}
					name={name}
					disabled={disabled}
					className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
					{...rest}
				/>
			);
		case "datetime":
			return (
				<div className={styles.dateContainer} ref={modalRef}>
					{calendarDisplay && (
						<InputDateTimeCalendar
							className={`${styles.calendar} ${top ? styles.top : styles.bottom} ${
								left && styles.left
							} ${rest.CalenderClassName && rest.CalenderClassName}`}
							theme={"arrowMonthYear"}
							calendarDisplay={calendarDisplay}
							setCalendarDisplay={setCalendarDisplay}
							value={value}
							setValue={setValue}
							name={name}
						/>
					)}
					<input
						value={
							value[name]?.DD !== "dd"
								? `${(value && value[name]?.DD) || moment().format("DD")}` +
								  " " +
								  `${
										(value &&
											value[name]?.MM &&
											moment(value[name]?.MM?.toString(), "MM").format("MMMM")) ||
										moment().format("MMMM")
								  }` +
								  " " +
								  `${(value && value[name]?.YYYY) || moment().format("YYYY")}` +
								  "," +
								  `${(value && value[name]?.time) || "00:00"}  `
								: ""
						}
						style={{ width, height }}
						name={name}
						onChange={() => null}
						type={"text"}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						onClick={() => {
							setCalendarDisplay(prev => !prev);
						}}
						disabled={disabled}
						{...rest}
					/>
					<div
						className={styles.calendarIcon}
						onClick={() => {
							!disabled && setCalendarDisplay(prev => !prev);
						}}
					>
						<DateTime color={Colors.lightBlue} size="1.3rem" />
					</div>
				</div>
			);
		case "datetimerange":
			return (
				<div className={styles.dateContainer} ref={modalRef}>
					{calendarDisplay && (
						<InputDateTimeRangeCalendar
							className={`${styles.calendar} ${top ? styles.top : styles.bottom} ${
								left && styles.left
							} ${rest.CalenderClassName && rest.CalenderClassName}`}
							theme={"arrowMonthYear"}
							calendarDisplay={calendarDisplay}
							setCalendarDisplay={setCalendarDisplay}
							value={value}
							setValue={setValue}
							name={name}
						/>
					)}
					<input
						placeholder={`DD/MM/YYYY - DD/MM/YYYY | HH:MM - HH:MM`}
						value={
							!value?.date.starts &&
							!value?.date.ends &&
							!value?.time.starts &&
							!value?.time.ends
								? `DD/MM/YYYY - DD/MM/YYYY | HH:MM - HH:MM`
								: value?.date.starts
								? `${value?.date.starts?.DD}/ ${value?.date.starts?.MM}/${
										value?.date.starts?.YYYY
								  } - ${
										value?.date.ends
											? `${value?.date.ends?.DD}/${value?.date.ends?.MM}/${value?.date.ends?.YYYY} |`
											: "DD/MM/YYYY"
								  } ${value?.time.starts ? value?.time.starts : "HH:MM"} - ${
										value?.time.ends ? value?.time.ends : "HH:MM"
								  }`
								: `DD/MM/YYYY - DD/MM/YYYY | HH:MM - HH:MM`
						}
						style={{ width, height }}
						name={name}
						onChange={() => null}
						type={"text"}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						onClick={() => {
							setCalendarDisplay(prev => !prev);
						}}
						disabled={disabled}
						{...rest}
					/>
					<div
						className={styles.calendarIcon}
						onClick={() => {
							!disabled && setCalendarDisplay(prev => !prev);
						}}
					>
						<DateTime color={Colors.lightBlue} size="1.3rem" />
					</div>
				</div>
			);
		case "number":
			return (
				<div className={styles.numberBox}>
					<div className={`${styles.changeCount} ${showArrows ? "" : styles.hide} `}>
						<TriangleArrow onClick={() => setValue(value + 1)} />
						<TriangleArrow
							style={{ transform: "rotate(180deg)" }}
							onClick={() => setValue(value > 0 ? value - 1 : 0)}
						/>
					</div>
					<input
						value={value[name]}
						onChange={onChange}
						style={{ width, height }}
						name={name}
						type={"text"}
						onBlur={e => {
							if (value === "") {
								setValue(0);
							}
						}}
						disabled={disabled}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						{...rest}
					/>
				</div>
			);
		case "integer":
			return (
				<div className={styles.numberBox}>
					<div className={`${styles.changeCount} ${showArrows ? "" : styles.hide} `}>
						<TriangleArrow onClick={() => setValue(value + 1)} />
						<TriangleArrow
							style={{ transform: "rotate(180deg)" }}
							onClick={() => setValue(value > 0 ? value - 1 : 0)}
						/>
					</div>
					<input
						value={value[name]}
						onChange={onChange}
						style={{ width, height }}
						name={name}
						type={"number"}
						onBlur={e => {
							if (value === "") {
								setValue(0);
							}
						}}
						disabled={disabled}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						{...rest}
					/>
				</div>
			);
		case "date":
			return (
				<div className={styles.dateContainer} ref={modalRef}>
					{calendarDisplay && (
						<InputDateCalendar
							className={`${styles.calendar} ${top ? styles.top : styles.bottom} ${
								left && styles.left
							}`}
							theme={"arrowMonthYear"}
							calendarDisplay={calendarDisplay}
							setCalendarDisplay={setCalendarDisplay}
							value={value}
							setValue={setValue}
							name={name}
						/>
					)}
					<input
						// value={`${value[name]?.DD}-${value[name]?.MM}-${value[name]?.YYYY}`}
						value={
							value[name]?.DD !== "dd"
								? `${value[name]?.DD || moment().format("DD")}` +
								  " " +
								  `${
										(value[name]?.MM &&
											moment(value[name]?.MM?.toString(), "MM").format("MMMM")) ||
										moment().format("MMMM")
								  }` +
								  " " +
								  `${value[name]?.YYYY || moment().format("YYYY")}`
								: ""
						}
						style={{ width, height }}
						name={name}
						onChange={() => null}
						type={"text"}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						onClick={() => {
							setCalendarDisplay(prev => !prev);
						}}
						disabled={disabled}
						{...rest}
					/>
					<div
						className={styles.calendarIcon}
						onClick={() => {
							!disabled && setCalendarDisplay(prev => !prev);
						}}
					>
						<Calendar color={Colors.lightBlue} size="1.3rem" />
					</div>
				</div>
			);

		case "daterange":
			return (
				<div className={styles.dateContainer} ref={modalRef}>
					{calendarDisplay && (
						<InputDateRangeCalendar
							className={`${styles.calendar} ${top ? styles.top : styles.bottom} ${
								left && styles.left
							}`}
							theme={"arrowMonthYear"}
							calendarDisplay={calendarDisplay}
							setCalendarDisplay={setCalendarDisplay}
							value={value}
							setValue={setValue}
							name={name}
						/>
					)}

					<input
						value={
							!value?.starts && !value?.end
								? `dd/mm/yyyy - dd/mm/yyyy`
								: `${value?.starts?.DD ?? "dd"}/${value?.starts?.MM ?? "mm"}/${
										value?.starts?.YYYY ?? "yyyy"
								  } - ${value?.ends?.DD ?? "dd"}/${value?.ends?.MM ?? "mm"}/${
										value?.ends?.YYYY ?? "yyyy"
								  }`
						}
						style={{ width, height }}
						name={name}
						onChange={() => null}
						type={"text"}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						onClick={() => {
							setCalendarDisplay(prev => !prev);
						}}
						disabled={disabled}
						{...rest}
					/>
					<div
						className={styles.calendarIcon}
						onClick={() => {
							!disabled && setCalendarDisplay(prev => !prev);
						}}
					>
						<DateTime color={Colors.lightBlue} size="1.3rem" />
					</div>
				</div>
			);
		default:
			return rest?.isEmoji ? (
				<div className={styles.defaultEmojiInput}>
					<input
						value={value[name] || ""}
						onChange={onChange}
						style={{ width, height }}
						name={name}
						type={type}
						disabled={disabled}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						{...rest}
					/>

					<Smily
						className={styles.emojiIcon}
						size={20}
						onClick={() => setEmoji(true)}
						ref={emojiRef}
					/>

					{emoji && (
						<div className={styles.emojiWrapper} ref={emojiDropdownRef}>
							<EmojiPicker
								onEmojiClick={emojiHandler}
								// disableAutoFocus
								height={360}
								width={"100%"}
								lazyLoadEmojis
								// previewConfig={{showPreview: false}}
							/>
						</div>
					)}
				</div>
			) : (
				<input
					value={value[name] || ""}
					onChange={onChange}
					style={{ width, height }}
					name={name}
					type={type}
					disabled={disabled}
					className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
					{...rest}
				/>
			);
	}
};

export default InputMultiple;
