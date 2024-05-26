/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";

import Input from "../Input/Input";
import { Tabs, Select } from "@cadence-frontend/widgets";
import { convertFrom24Hour, convertTo24Hour } from "./utils";

import { MERIDIAN_TYPE_OPTIONS } from "@cadence-frontend/constants";
import { TYPES } from "./constants";

import styles from "./InputTimeRange.module.scss";

const InputTime = ({
	halfHour,
	input,
	setInput,
	name,
	className,
	reRender,
	theme,
	height = "40px",
	enforceHalfHourDuration,
	hideMinutes = false,
	type = "slider",
	justify = "center",
	dateType,
	...rest
}) => {
	const [internalState, setInternalState] = useState({ hh: "", mm: "", a: "AM" });
	useEffect(() => {
		if (internalState.hh === "" && internalState.mm === "") {
			const converted = convertFrom24Hour(
				typeof input === "object" && name ? input[name] : input
			);

			if (converted) {
				let { hh, mm, a } = converted;
				// if (Number(mm) > 50) hh = parseInt(hh) + 1;
				// mm = (parseInt(mm) + 10) % 60;
				// if ((Number(hh) + 1) / 12 > 0) a = "PM";

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
				setInput(prev => {
					return { ...prev, [name]: converted };
				});
			} else {
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
						width="150px"
					/>
				);

			case TYPES.SELECT:
				return (
					<Select
						options={MERIDIAN_TYPE_OPTIONS}
						value={internalState}
						setValue={setInternalState}
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
				<div className={styles.timeInputFields}>
					<div className={styles.hh}>
						<Input
							name="hh"
							width={enforceHalfHourDuration ? "100px" : "50px"}
							theme={theme}
							value={internalState}
							className={`${styles.input} ${
								enforceHalfHourDuration ? styles.inputLeft : ""
							} `}
							setValue={setInternalState}
							type="number"
							placeholder="00"
							maxValue={12}
							height={height}
						/>
					</div>

					<div className={styles.min}>
						{!hideMinutes && (
							<div className={styles.minRinght}>
								<div className={styles.colon}>:</div>
								<div className={styles.mm}>
									{!enforceHalfHourDuration ? (
										<Input
											name="mm"
											width="50px"
											theme={theme}
											type="number"
											className={styles.input}
											value={internalState}
											setValue={setInternalState}
											placeholder="00"
											maxValue={59}
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
							</div>
						)}
					</div>
				</div>

				<div className={styles.a}>{renderComponent()}</div>
			</div>
		</div>
	);
};

export default InputTime;
