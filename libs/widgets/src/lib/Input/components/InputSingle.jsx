import THEMES from "../themes";
import { useRef, useState } from "react";
import moment from "moment-timezone";
import styles from "../Input.module.scss";
import { isWholeNumStr } from "../utils";
import { useOutsideClickHandler, Colors } from "@cadence-frontend/utils";
import { InputDateCalendar, InputDateTimeCalendar } from "@cadence-frontend/widgets";
import { Calendar, TriangleArrow, DateTime, Smily } from "@cadence-frontend/icons";
import EmojiPicker from "emoji-picker-react";

const InputSingle = ({
	type,
	value,
	setValue,
	name,
	top,
	left,
	width = "100%",
	height = "40px",
	className,
	showArrows = false,
	theme = "WHITE",
	maxValue = null,
	minValue = 0,
	disabled,
	isEmoji,
	...rest
}) => {
	const [calendarDisplay, setCalendarDisplay] = useState(false);
	const [emoji, setEmoji] = useState(false);

	const emojiRef = useRef();
	const emojiDropdownRef = useRef();
	const modalRef = useRef();
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
		setValue(value + emoji);
	};

	const onChange = e => {
		let value = e.target.value;
		if (type === "number") {
			if (value === "") {
				value = "";
			} else if (isWholeNumStr(value)) {
				value = parseInt(value);
			} else {
				return;
			}

			if (maxValue && value > maxValue) value = maxValue;
			else if (value < minValue) value = minValue;
		}
		setValue(value);
	};
	switch (type) {
		case "textarea":
			return (
				<textarea
					value={value}
					onChange={onChange}
					style={{ width, height }}
					name={name}
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
							} `}
							theme={"arrowMonthYear"}
							calendarDisplay={calendarDisplay}
							setCalendarDisplay={setCalendarDisplay}
							value={value}
							setValue={setValue}
							name={name}
						/>
					)}
					<input
						// value={
						// 	value[name]?.DD !== "dd"
						// 		? `${(value && value[name]?.DD) || moment().format("DD")}` +
						// 		  " " +
						// 		  `${
						// 				(value &&
						// 					value[name]?.MM &&
						// 					moment(value[name]?.MM?.toString(), "MM").format("MMMM")) ||
						// 				moment().format("MMMM")
						// 		  }` +
						// 		  " " +
						// 		  `${(value && value[name]?.YYYY) || moment().format("YYYY")}` +
						// 		  "," +
						// 		  `${(value && value[name]?.time) || "00:00"}  `
						// 		: ""
						// }
						value={
							value !== ""
								? `${new Date(value).getDate()} ${moment(value / 1000, "X").format(
										"MMMM"
								  )} ${new Date(value).getFullYear()}	${
										new Date(value).getHours() < 10
											? `0${new Date(value).getHours()}`
											: `${new Date(value).getHours()}`
								  }:${
										new Date(value).getMinutes() < 10
											? `0${new Date(value).getMinutes()}`
											: `${new Date(value).getMinutes()}`
								  }`
								: `${moment().format("DD")} ${moment().format("MMMM")} ${moment().format(
										"YYYY"
								  )} 00:00`
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
					<div className={`${styles.changeCount}  ${showArrows ? "" : styles.hide}`}>
						<TriangleArrow onClick={() => setValue(value + 1)} />
						<TriangleArrow
							style={{ transform: "rotate(180deg)" }}
							onClick={() => setValue(value > 0 ? value - 1 : 0)}
						/>
					</div>

					<input
						value={value}
						onChange={onChange}
						style={{ width, height }}
						name={name}
						type={"text"}
						onBlur={e => {
							if (value === "") {
								setValue(0);
							}
						}}
						className={`${styles.input} ${styles[THEMES[theme]]} ${className ?? ""}`}
						disabled={disabled}
						{...rest}
					/>
				</div>
			);
		case "integer":
			return (
				<div className={styles.numberBox}>
					<div className={`${styles.changeCount}  ${showArrows ? "" : styles.hide}`}>
						<TriangleArrow onClick={() => setValue(value + 1)} />
						<TriangleArrow
							style={{ transform: "rotate(180deg)" }}
							onClick={() => setValue(value > 0 ? value - 1 : 0)}
						/>
					</div>

					<input
						value={value}
						onChange={onChange}
						style={{ width, height }}
						name={name}
						type={"number"}
						onBlur={e => {
							if (value === "") {
								setValue(0);
							}
						}}
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
						// value={`${value[name]?.DD}-${value[name]?.MM}-${value[name]?.YYYY}`}
						// value={
						// 	value !== "" && value.includes("/")
						// 		? `${value.split("/")[0]} ${moment(value, "DD/MM/YYYY").format("MMMM")} ${
						// 				value.split("/")[2]
						// 		  } `
						// 		: `${moment().format("DD")} ${moment().format("MMMM")} ${moment().format(
						// 				"YYYY"
						// 		  )}`
						// }
						value={
							value !== ""
								? `${new Date(value).getDate()} ${moment(value / 1000, "X").format(
										"MMMM"
								  )} ${new Date(value).getFullYear()}`
								: `${moment().format("DD")} ${moment().format("MMMM")} ${moment().format(
										"YYYY"
								  )}`
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
		default:
			return rest?.isEmoji ? (
				<div className={styles.defaultEmojiInput}>
					<input
						value={value}
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
						onClick={() => setEmoji(prev => !prev)}
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
							/>
						</div>
					)}
				</div>
			) : (
				<input
					value={value}
					onChange={onChange}
					name={name}
					style={{ width, height }}
					type={type}
					className={`${styles.input} ${styles[THEMES[theme]]}  ${className ?? ""}  `}
					disabled={disabled}
					{...rest}
				/>
			);
	}
};

export default InputSingle;
