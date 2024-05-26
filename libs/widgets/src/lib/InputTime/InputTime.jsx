/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";

import Input from "../Input/Input";
import { Tabs, Select } from "@cadence-frontend/widgets";
import { convertFrom24Hour, convertTo24Hour } from "./utils";

import { MERIDIAN_TYPE_OPTIONS } from "@cadence-frontend/constants";
import { TYPES } from "./constants";

import styles from "./InputTime.module.scss";

const InputTime = ({
	halfHour,
	input,
	setInput,
	name,
	className,
	disabled,
	reRender,
	theme,
	height = "40px",
	enforceHalfHourDuration,
	hideMinutes = false,
	type = "slider",
	justify = "center",
	...rest
}) => {
	const [internalState, setInternalState] = useState({ hh: "", mm: "", a: "AM" });

	const isWholeNumStr = value => {
		return /^(?=.*?[0-9])/.test(value);
	};

	useEffect(() => {
		if (internalState.hh === "" && internalState.mm === "") {
			const converted = convertFrom24Hour(
				typeof input === "object" && name ? input[name] : input
			);

			if (converted) {
				const { hh, mm, a } = converted;

				if (enforceHalfHourDuration) {
					setInternalState(prevInput => ({
						...prevInput,
						mm: +mm < 30 ? "30" : "00",
						hh: +mm < 30 ? `0${hh}`.slice(-2) : `0${(Number(hh) + 1) % 12}`.slice(-2),
						a: +mm < 30 ? a : (Number(hh) + 1) / 12 > 0 ? (a === "AM" ? "PM" : "AM") : a,
					}));
				} else {
					setInternalState({ hh, mm, a });
				}
			}
		}
	}, [input]);

	// useEffect(() => {
	// 	// setInternalState({ hh, mm, a });
	// }, [reRender]);

	useEffect(() => {
		const { hh, mm, a } = internalState;
		const converted = convertTo24Hour(`${hh}:${mm} ${a}`);
		if (converted)
			if (typeof input === "object") {
				// console.log(converted, "Isobject");
				// console.log(name, "Converted");
				setInput(prev => {
					// console.log("run");

					return { ...prev, [name]: converted };
				});
			} else {
				// console.log("NoIsobject");
				setInput(converted);
			}
	}, [internalState]);

	const renderComponent = () => {
		switch (type) {
			case TYPES.SLIDER:
				return (
					<Tabs
						className={styles.tabNav}
						theme={theme}
						btnTheme={theme === "WHITE" ? "PRIMARY_AND_WHITE" : "PRIMARY_AND_GREY"}
						radio="true"
						tabs={MERIDIAN_TYPE_OPTIONS}
						name={"a"}
						value={internalState}
						setValue={setInternalState}
						width="120px"
					/>
				);

			case TYPES.SELECT:
				return (
					<Select
						options={MERIDIAN_TYPE_OPTIONS}
						value={internalState}
						setValue={setInternalState}
						disabled={disabled}
						name="a"
						height={height}
						className={className}
					/>
				);

			default:
				break;
		}
	};

	return (
		<div className={`${styles.inputTime}`} {...rest}>
			<div className={styles.inputFields} style={{ justifyContent: justify }}>
				<div className="hh">
					<Input
						name="hh"
						width={enforceHalfHourDuration ? "100px" : "50px"}
						theme={theme}
						value={internalState}
						className={`${styles.input} ${
							enforceHalfHourDuration ? styles.inputLeft : ""
						} `}
						onChange={e => {
							let value = e.target.value;
							if (value === "") setInternalState(prev => ({ ...prev, hh: "" }));
							else if (isWholeNumStr(value) && value.length <= 2) {
								if (parseInt(value) > 12) value = "12";
								setInternalState(prev => ({ ...prev, hh: value }));
							}
						}}
						onBlur={e => {
							if (e.target.value === "")
								setInternalState(prev => ({ ...prev, hh: "01" }));
						}}
						type="text"
						placeholder="00"
						height={height}
						disabled={disabled}
					/>
				</div>
				{!hideMinutes && (
					<>
						<div className={styles.colon}>:</div>
						<div className={styles.mm}>
							{!enforceHalfHourDuration ? (
								<Input
									name="mm"
									width="50px"
									theme={theme}
									className={styles.input}
									value={internalState}
									onChange={e => {
										let value = e.target.value;
										if (value === "") setInternalState(prev => ({ ...prev, mm: "" }));
										else if (isWholeNumStr(value) && value.length <= 2) {
											if (parseInt(value) > 59) value = "59";
											setInternalState(prev => ({ ...prev, mm: value }));
										}
									}}
									onBlur={e => {
										if (e.target.value === "")
											setInternalState(prev => ({ ...prev, mm: "00" }));
									}}
									type="text"
									placeholder="00"
									disabled={disabled}
									height={height}
								/>
							) : (
								<Select
									options={[
										{ label: "00", value: "00" },
										{ label: "30", value: "30" },
									]}
									value={internalState}
									setValue={setInternalState}
									name="mm"
									width={"100px"}
									placeholder={internalState.mm}
									className={className}
								/>
							)}
						</div>
					</>
				)}

				<div className={styles.a}>{renderComponent()}</div>
			</div>
		</div>
	);
};

export default InputTime;
