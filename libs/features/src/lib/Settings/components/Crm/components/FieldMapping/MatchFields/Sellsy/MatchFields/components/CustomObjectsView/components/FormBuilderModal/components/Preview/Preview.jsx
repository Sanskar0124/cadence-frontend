import React, { useContext, useEffect, useState } from "react";
import styles from "./Preview.module.scss";

import {
	Label,
	Select,
	InputRadio,
	Input,
	ThemedButton,
	BackButton,
	InputTime,
} from "@cadence-frontend/widgets";

import { Modal, Tooltip } from "@cadence-frontend/components";
import { VIEWS } from "../../../../constants";
import { Close, Delete, Plus, Search } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const Preview = ({ isOpen, form, onClose, setPreview, buttonText, saveAndExit }) => {
	const [maxRow, setMaxRow] = useState(0);
	const user = useRecoilValue(userInfo);
	const { addSuccess, addError } = useContext(MessageContext);
	const { setCustomObjectForm, setCustomObjectFormLoading } = useCustomObject();
	useEffect(() => {
		let max = 0;
		form?.forEach(formElement => {
			if (formElement.position.row > max) {
				max = formElement.position.row;
			}
		});
		setMaxRow(max);
	}, [form]);
	const renderInput = (item, row) => {
		const type = item.input_type;
		const count = form.filter(item => item.position.row === row).length;
		const moreThanOne = form.filter(i => i.sellsy_label === item.sellsy_label).length > 1;

		switch (type) {
			// case "textarea":
			// 	return (
			// 		<>
			// 			<Label>{item.sellsy_label}</Label>
			// 			<Input placeholder="Type here" disabled type="textarea" height="70px" />
			// 		</>
			// 	);
			case "date":
				return (
					<>
						<Label>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<Input
							placeholder="Type here"
							// disabled
							left={item.position.column === 2 && count === 3}
							type="date"
							value={{}}
							className={styles.date}
							top={row > maxRow / 2 && row >= 5}
						/>
					</>
				);
			case "time":
				return (
					<>
						<Label>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<InputTime
							name="time"
							disabled
							theme={InputThemes.PRIMARY}
							type="select"
							height="40px"
						/>
					</>
				);
			case "tag":
				return (
					<>
						<Label>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<Input placeholder="Add a smart tag" disabled />
					</>
				);

			// case "datetime":
			// 	return (
			// 		<>
			// 			<Label>{item.sellsy_label}</Label>
			// 			<Input
			// 				type="datetime"
			// 				value={{}}
			// 				left={item.position.column === 2 && count === 3}
			// 				className={styles.date}
			// 				top={row > maxRow / 2 && row >= 5}
			// 			/>
			// 		</>
			// 	);

			default:
				return (
					<>
						<Label>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<Input placeholder="Type here" disabled />
					</>
				);
		}
	};
	const handleSave = () => {
		const body = {
			object_type: VIEWS.CONTACT,
			custom_object: {
				button_text: buttonText,
				form: form.filter(item => item.type !== ""),
			},
		};
		setCustomObjectForm(body, {
			onSuccess: () => {
				saveAndExit();
				return addSuccess("Form saved Successfully");
			},
			onError: err => {
				return addError({
					text: err?.response.data.msg || "Error in saving the form",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	return (
		// <div className={styles.preview}>
		// 	<BackButton
		// 		text={"Form editor"}
		// 		onClick={() => {
		// 			setPreview(false);
		// 		}}
		// 	/>
		// 	<div className={styles.heading}>Preview</div>
		// 	<div className={styles.formBox}>
		// 		<div className={styles.form}>
		// 			<div className={styles.formHeading}>
		// 				<div className={styles.close}>
		// 					<Tooltip text={"Close"}>
		// 						<Close color={Colors.lightBlue} />
		// 					</Tooltip>
		// 				</div>
		// 				<div className={styles.headingText}>{buttonText}</div>
		// 			</div>
		<Modal
			isModal={isOpen}
			disableOutsideClick
			className={styles.preview}
			onClose={onClose}
		>
			<div className={styles.heading}>
				<div className={styles.formHeading}>
					<div className={styles.headingText}>{buttonText}</div>
				</div>
				<div className={styles.back}>
					<BackButton
						text={"Form editor"}
						onClick={() => {
							onClose();
						}}
					/>
				</div>
			</div>

			<div className={`${styles.body}`}>
				{[...Array(maxRow + 1).keys()].map(row => {
					return (
						form.filter(element => element.position.row === row).length !== 0 && (
							<div className={styles.formRow} key={`${row}`}>
								{form
									.filter(element => element.position.row === row)
									.sort((a, b) => a.position.column - b.position.column)
									.map(
										item =>
											item.type !== "" && (
												<div
													key={`${row}-${item.position.column}`}
													className={`${styles.formColumn}`}
												>
													<div
														className={styles.dragItem}
														key={`${row}-${item.position.column}-drag`}
													>
														{item.type === "dropdown" && (
															<>
																<Label>{item.sellsy_label}</Label>
																<Select
																	placeholder={"Select here"}
																	value={""}
																	setValue={() => null}
																	menuOnTop={row === maxRow ? true : false}
																	numberOfOptionsVisible="3"
																	options={item?.possible_values?.map(item => ({
																		label: item?.label,
																		value: item?.color,
																	}))}
																></Select>
															</>
														)}
														{/* {item.type === "input_select" && (
															<>
																<Label>{item.sellsy_label}</Label>
																<div className={styles.inputSelectBox}>
																	<div className={styles.current}>
																		<div className={styles.inputBox}>
																			<Input
																				placeholder="Type here"
																				disabled
																				className={styles.inputSelect}
																			/>
																		</div>
																		<div className={styles.selectBox}>
																			<Select
																				placeholder={"Select here"}
																				borderRadius={"0 15px 15px 0"}
																				disabled
																			></Select>
																		</div>
																		<div className={styles.delete}>
																			<Delete
																				color={Colors.veryLightBlue}
																				size="1.4rem"
																			/>
																		</div>
																	</div>
																	<div className={styles.addMore}>
																		<ThemedButton
																			theme={ThemedButtonThemes.TRANSPARENT}
																			width={"14%"}
																			className={styles.button}
																		>
																			<Plus />
																			Add one more
																		</ThemedButton>
																	</div>
																</div>
															</>
														)} */}
														{item.type === "multi_select_dropdown" && (
															<>
																<Label>{item.sellsy_label}</Label>
																<Select
																	placeholder={"Select here"}
																	value={{}}
																	setValue={() => null}
																	height="auto"
																	menuOnTop={row === maxRow ? true : false}
																	numberOfOptionsVisible="3"
																	options={item?.possible_values?.map(item => ({
																		label: item?.label,
																		value: item?.value,
																	}))}
																	isMulti
																></Select>
															</>
														)}
														{item.type === "radio_button" && (
															<div className={styles.radioBox}>
																<div className={styles.label}>{item.sellsy_label}?</div>
																<div className={styles.btnBox}>
																	{item?.possible_values?.map(i => (
																		<div className={styles.btn}>
																			<InputRadio
																				className={styles.radio}
																				size="24"
																				disabled
																			/>
																			<div className={styles.btnLabel}>{i?.label}</div>
																		</div>
																	))}
																</div>
															</div>
														)}
														{item.type === "input_box" && renderInput(item, row)}
													</div>
												</div>
											)
									)}
							</div>
						)
					);
				})}
			</div>
			<div className={styles.buttonSave}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					width="100%"
					height="49px"
					loading={setCustomObjectFormLoading}
					onClick={() => handleSave()}
				>
					Save and exit form builder
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default Preview;
