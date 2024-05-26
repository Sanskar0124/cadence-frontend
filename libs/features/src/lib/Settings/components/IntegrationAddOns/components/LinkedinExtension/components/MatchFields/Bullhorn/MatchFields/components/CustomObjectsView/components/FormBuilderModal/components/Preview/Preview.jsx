import React, { useContext, useEffect, useState } from "react";
import styles from "./Preview.module.scss";

import {
	Label,
	Select,
	InputRadio,
	Input,
	ThemedButton,
	BackButton,
} from "@cadence-frontend/widgets";

import { Modal, Tooltip } from "@cadence-frontend/components";
import { VIEWS } from "../../../../constants";
import { Close, Search } from "@cadence-frontend/icons";
import { Colors, capitalize } from "@cadence-frontend/utils";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const Preview = ({
	isOpen,
	form,
	onClose,
	buildFormFor,
	setPreview,
	buttonText,
	saveAndExit,
}) => {
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
		switch (type) {
			case "textarea":
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input placeholder="Type here" disabled type="textarea" height="70px" />
					</>
				);
			case "DATE":
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input
							placeholder="Type here"
							disabled
							left={item.position.column === 2 && count === 3}
							type="date"
							value={{}}
							className={styles.date}
							top={row > maxRow / 2 && row >= 5}
						/>
					</>
				);
			case "DATETIME":
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input
							type="datetime"
							value={{}}
							left={item.position.column === 2 && count === 3}
							className={styles.date}
							top={row > maxRow / 2 && row >= 5}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input placeholder="Type here" disabled />
					</>
				);
		}
	};
	const handleSave = () => {
		const body = {
			object_type: buildFormFor === "contact" ? "clientContact" : buildFormFor,
			custom_object: [
				{
					button_text: buttonText,
					form: form
						.filter(item => item.type !== "")
						.map(f => ({
							...f,
							bullhorn_endpoint:
								f.bullhorn_endpoint === "contact"
									? "clientContact"
									: f.bullhorn_endpoint === "account"
									? "clientCorporation"
									: f.bullhorn_endpoint,
						})),
				},
			],
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
		<Modal
			isModal={isOpen}
			disableOutsideClick
			className={styles.preview}
			onClose={onClose}
		>
			<div className={styles.heading}>
				<div className={styles.formHeading}>
					<div className={styles.headingText}>{capitalize(buttonText)}</div>
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
														{item.type === "dropdown" && !item.reference_to && (
															<>
																<Label>{item.bullhorn_label}</Label>
																<Select
																	placeholder={"Select here"}
																	value={""}
																	setValue={() => null}
																	// menuOnTop={row === maxRow ? true : false}
																	menuOnTop={false}
																	numberOfOptionsVisible="3"
																	options={item.possible_values
																		?.filter(p => p.label && p.value)
																		.map(item => ({
																			label: item.label,
																			value: item.value,
																		}))}
																	disabled={item.editable}
																></Select>
															</>
														)}
														{item.type === "dropdown" && item.reference_to && (
															<>
																<Label>{item.bullhorn_label}</Label>
																<Select
																	placeholder={"Search here"}
																	disabled
																	isSearchable
																	icon={<Search color={Colors.lightBlue} />}
																></Select>
															</>
														)}
														{item.type === "multi_select_dropdown" && (
															<>
																<Label>{item.bullhorn_label}</Label>
																<Select
																	placeholder={"Select here"}
																	value={{}}
																	setValue={() => null}
																	height="auto"
																	menuOnTop={row === maxRow ? true : false}
																	numberOfOptionsVisible="3"
																	options={item.possible_values.map(item => ({
																		label: item.label,
																		value: item.value,
																	}))}
																	isMulti
																></Select>
															</>
														)}
														{item.type === "radio_button" && (
															<div className={styles.radioBox}>
																<div className={styles.label}>{item.bullhorn_label}?</div>
																<div className={styles.btnBox}>
																	<div className={styles.btn}>
																		<InputRadio
																			className={styles.radio}
																			size="24"
																			disabled
																		/>
																		<div className={styles.btnLabel}>
																			{
																				COMMON_TRANSLATION.YES[
																					user?.language?.toUpperCase()
																				]
																			}
																		</div>
																	</div>
																	<div className={styles.btn}>
																		<InputRadio
																			className={styles.radio}
																			size="24"
																			disabled
																		/>
																		<div className={styles.btnLabel}>No</div>
																	</div>
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
