import { FILTER_ENUMS_BACKEND } from "@cadence-frontend/utils";
import React, { useRef, useEffect, useState } from "react";
import styles from "./InputRange.module.scss";

const InputRange = ({ value, handleChange, filters }) => {
	const content = useRef();
	const range = useRef();
	const container = useRef();
	const coverRef = useRef();

	useEffect(() => {
		const moveContent = val => {
			let res = (val * 391) / 19.95 - 3.1 * val;
			if (val <= 7) res += 0.1;
			if (res <= 11) res += 2;
			if (val >= 1 && val <= 11) res += 2;
			if (val <= 2) res += 0.8;
			content.current.style.left = res + "px";
			coverRef.current.style.width = res + 12.1 + "px";
		};
		moveContent(value ? value : 1);
	}, [value]);

	return (
		<div className={`${styles.valueSlider}`} ref={container}>
			{/* <div className={`${styles.rangeContainer}`}> */}
			<input
				type="range"
				className={`${styles.range} ${
					filters[FILTER_ENUMS_BACKEND.CADENCE_STEP] ? styles.active : ""
				} ${filters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== "0" ? styles.boxShadow : ""}`}
				ref={range}
				min="0"
				max="20"
				value={value ? value : 0}
				onChange={event => {
					handleChange(event.target.value);
				}}
			/>
			<div
				className={`${styles.slider__content} ${
					filters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== "0" ? styles.activeColor : ""
				}`}
				ref={content}
			>
				{filters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== "0" ? value : "0"}
			</div>
			<div
				className={filters[FILTER_ENUMS_BACKEND.CADENCE_STEP] !== "0" ? styles.cover : ""}
				ref={coverRef}
			></div>
			{/* </div> */}
		</div>
	);
};

export default InputRange;
