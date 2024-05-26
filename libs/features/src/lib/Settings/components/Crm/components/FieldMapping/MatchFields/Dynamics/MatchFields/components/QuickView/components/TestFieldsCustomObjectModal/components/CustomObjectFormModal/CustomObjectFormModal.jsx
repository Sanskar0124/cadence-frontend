import React, { useState, useEffect, useContext, useRef } from "react";
import moment from "moment";
import styles from "./CustomObjectFormModal.module.scss";

import { Modal } from "@cadence-frontend/components";
import {
	Label,
	Input,
	Select,
	InputRadio,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { VIEWS } from "../../../../../../constants";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import FormPlaceholder from "../../../Placeholder/Placeholder";
import { Search } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
const CustomObjectFormModal = ({
	modal,
	setModal,
	fields,
	buildFormFor,
	onClose,
	setShowLeadUrlModal,
}) => {
	const [maxRow, setMaxRow] = useState(0);
	const [form, setForm] = useState();
	const [buttonText, setButtonText] = useState();
	const [leadInput, setLeadInput] = useState({});
	const [contactInput, setContactInput] = useState({});
	const [accountInput, setAccountInput] = useState({});
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const { customObj, loading, setTest, setTestLoading } = useCustomObject(true);

	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.dynamics_endpoint][item.dynamics_field];
				if (item.type === "multi_select_dropdown") {
					if (item.dynamics_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.dynamics_field]: value != null ? value.split(";") : [],
						}));
					} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.dynamics_field]: value != null ? value.split(";") : [],
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.dynamics_field]: value != null ? value.split(";") : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;
					if (type === "date") {
						if (item.dynamics_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.dynamics_field]:
									value != null
										? {
												DD: value.split("-")[2],
												MM: value.split("-")[1],
												YYYY: value.split("-")[0],
										  }
										: {
												DD: "dd",
										  },
							}));
						} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.dynamics_field]:
									value != null
										? {
												DD: value.split("-")[2],
												MM: value.split("-")[1],
												YYYY: value.split("-")[0],
										  }
										: {
												DD: "dd",
										  },
							}));
						} else {
							setAccountInput(prev => ({
								...prev,
								[item.dynamics_field]:
									value != null
										? {
												DD: value.split("-")[2],
												MM: value.split("-")[1],
												YYYY: value.split("-")[0],
										  }
										: {
												DD: "dd",
										  },
							}));
						}
					} else if (type === "datetime") {
						if (item.dynamics_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.dynamics_field]:
									value != null
										? {
												DD: moment(value).format("DD"),
												MM: moment(value).format("MM"),
												YYYY: moment(value).format("YYYY"),
												time: `${moment(value).format("HH")}:${moment(value).format(
													"mm"
												)}`,
										  }
										: {
												DD: "dd",
										  },
							}));
						} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.dynamics_field]:
									value != null
										? {
												DD: moment(value).format("DD"),
												MM: moment(value).format("MM"),
												YYYY: moment(value).format("YYYY"),
												time: `${moment(value).format("HH")}:${moment(value).format(
													"mm"
												)}`,
										  }
										: {
												DD: "dd",
										  },
							}));
						} else {
							setAccountInput(prev => ({
								...prev,
								[item.dynamics_field]:
									value != null
										? {
												DD: moment(value).format("DD"),
												MM: moment(value).format("MM"),
												YYYY: moment(value).format("YYYY"),
												time: `${moment(value).format("HH")}:${moment(value).format(
													"mm"
												)}`,
										  }
										: {
												DD: "dd",
										  },
							}));
						}
					} else {
						if (item.dynamics_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.dynamics_field]: value !== null ? value : "",
							}));
						} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.dynamics_field]: value !== null ? value : "",
							}));
						} else {
							setAccountInput(prev => ({
								...prev,
								[item.dynamics_field]: value !== null ? value : "",
							}));
						}
					}
				} else {
					if (item.dynamics_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.dynamics_field]: value !== null ? value : "",
						}));
					} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.dynamics_field]: value !== null ? value : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.dynamics_field]: value !== null ? value : "",
						}));
					}
				}
			});
		}
	}, [form, fields]);

	useEffect(() => {
		if (buildFormFor === "lead") {
			if (customObj?.lead_custom_object != null) {
				setForm(customObj?.lead_custom_object[0].form);
				setButtonText(customObj?.lead_custom_object[0].button_text);
			} else {
				setForm([]);
				setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
			}
		} else {
			if (customObj?.contact_custom_object != null) {
				setForm(customObj?.contact_custom_object[0].form);
				setButtonText(customObj?.contact_custom_object[0].button_text);
			} else {
				setForm([]);
				setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
			}
		}

		setLeadInput({});
		setContactInput({});
		setAccountInput({});
	}, [buildFormFor, customObj]);
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
						<Label>{item.dynamics_label}</Label>
						<Input
							placeholder="Type here"
							type="textarea"
							height="70px"
							value={
								item.dynamics_endpoint === VIEWS.LEAD
									? leadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							disabled={!item.editable}
							className={`${!item.editable && styles.disabled}`}
							setValue={
								item.dynamics_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.dynamics_field}
						/>
					</>
				);
			case "integer":
				return (
					<>
						<Label>{item.dynamics_label}</Label>
						<Input
							type={"integer"}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.dynamics_endpoint === VIEWS.LEAD
									? leadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.dynamics_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.dynamics_field}
							className={`${!item.editable && styles.disabled} ${styles.numberBox}`}
						/>
					</>
				);
			case "number":
				return (
					<>
						<Label>{item.dynamics_label}</Label>
						<Input
							type={"number"}
							isDecimalAllowed
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.dynamics_endpoint === VIEWS.LEAD
									? leadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.dynamics_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.dynamics_field}
							className={`${!item.editable && styles.disabled} ${styles.numberBox}`}
						/>
					</>
				);
			case "date":
				return (
					<>
						<Label>{item.dynamics_label}</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={
								item.dynamics_endpoint === VIEWS.LEAD
									? leadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							className={`${!item.editable && styles.disabled}`}
							disabled={!item.editable}
							setValue={
								item.dynamics_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.dynamics_field}
						/>
					</>
				);
			case "datetime":
				return (
					<>
						<Label>{item.dynamics_label}</Label>
						<Input
							placeholder={"Select Date and Time"}
							type="datetime"
							left={item.position.column === 2 && count === 3}
							value={
								item.dynamics_endpoint === VIEWS.LEAD
									? leadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							disabled={!item.editable}
							setValue={
								item.dynamics_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.dynamics_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.dynamics_label}</Label>
						<Input
							type={type}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.dynamics_endpoint === VIEWS.LEAD
									? leadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.dynamics_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.dynamics_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.dynamics_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);
		}
	};

	const handleSave = () => {
		let body;
		let leadInp = JSON.parse(JSON.stringify(leadInput));

		let contactInp = JSON.parse(JSON.stringify(contactInput));

		let accountInp = JSON.parse(JSON.stringify(accountInput));
		delete accountInp.Id;

		form.forEach(item => {
			let value;
			if (item.dynamics_endpoint === VIEWS.LEAD) {
				value = leadInp[item.dynamics_field];
			} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
				value = contactInp[item.dynamics_field];
			} else {
				value = accountInp[item.dynamics_field];
			}

			if (item.type === "multi_select_dropdown") {
				if (item.dynamics_endpoint === VIEWS.LEAD) {
					leadInp[item.dynamics_field] = value.length === 0 ? null : value.join(";");
				} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
					contactInp[item.dynamics_field] = value.length === 0 ? null : value.join(";");
				} else {
					accountInp[item.dynamics_field] = value.length === 0 ? null : value.join(";");
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "date") {
					if (item.dynamics_endpoint === VIEWS.LEAD) {
						leadInp[item.dynamics_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
						contactInp[item.dynamics_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else {
						accountInp[item.dynamics_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					}
				} else if (type === "datetime") {
					if (item.dynamics_endpoint === VIEWS.LEAD) {
						leadInp[item.dynamics_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  )
										.toISOString()
										.replace(".000Z", "Z")
								: null;
					} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
						contactInp[item.dynamics_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  )
										.toISOString()
										.replace(".000Z", "Z")
								: null;
					} else {
						accountInp[item.dynamics_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  )
										.toISOString()
										.replace(".000Z", "Z")
								: null;
					}
				} else if (type === "integer") {
					if (item.dynamics_endpoint === VIEWS.LEAD) {
						leadInp[item.dynamics_field] = value === "" ? null : Number(value);
					} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
						contactInp[item.dynamics_field] = value === "" ? null : Number(value);
					} else {
						accountInp[item.dynamics_field] = value === "" ? null : Number(value);
					}
				} else {
					if (item.dynamics_endpoint === VIEWS.LEAD) {
						leadInp[item.dynamics_field] = value === "" ? null : value;
					} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
						contactInp[item.dynamics_field] = value === "" ? null : value;
					} else {
						accountInp[item.dynamics_field] = value === "" ? null : value;
					}
				}
			} else {
				if (item.dynamics_endpoint === VIEWS.LEAD) {
					leadInp[item.dynamics_field] =
						value === "" || value === undefined ? null : value;
				} else if (item.dynamics_endpoint === VIEWS.CONTACT) {
					contactInp[item.dynamics_field] =
						value === "" || value === undefined ? null : value;
				} else {
					accountInp[item.dynamics_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});

		if (buildFormFor === VIEWS.LEAD) {
			form.forEach(item => {
				if (item.editable === false) {
					delete leadInp[item.dynamics_field];
				}
			});
			body = {
				type: VIEWS.LEAD,
				id: fields[VIEWS.LEAD].leadid,
				custom_object: leadInp,
			};
		} else if (Object.keys(accountInput).length === 0) {
			form.forEach(item => {
				if (item.editable === false) {
					delete contactInp[item.dynamics_field];
				}
			});
			body = {
				type: VIEWS.CONTACT,
				id: fields[VIEWS.CONTACT].contactid,
				custom_object: contactInp,
			};
		} else {
			form.forEach(item => {
				if (item.editable === false) {
					if (item.dynamics_endpoint === VIEWS.CONTACT)
						delete contactInp[item.dynamics_field];
					else delete accountInp[item.dynamics_field];
				}
			});
			body = {
				type: VIEWS.CONTACT,
				id: fields[VIEWS.CONTACT].contactid,
				custom_object: contactInp,
				custom_object_account: accountInp,
				dynamics_account_id: fields[VIEWS.ACCOUNT].accountid,
			};
		}

		setTest(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${buildFormFor} in dynamics`);
				onClose();
				setShowLeadUrlModal(true);
			},
			onError: err => {
				return addError({
					text: err?.response.data.msg,
					desc: err?.response.data.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	console.log(form, "Formmm");
	return (
		<Modal
			showCloseButton
			isModal={modal}
			className={styles.preview}
			onClose={() => {
				onClose();
			}}
		>
			<div className={styles.headingText}>{buttonText}</div>

			<div className={`${styles.body}`}>
				{
					// loading ? (
					// 	<div>
					// 		<FormPlaceholder row={maxRow + 1} />
					// 	</div>
					// ) : (
					[...Array(maxRow + 1).keys()].map(
						row => {
							return (
								form?.filter(element => element.position.row === row).length !== 0 && (
									<div className={styles.formRow} key={`${row}`}>
										{form
											?.filter(element => element.position.row === row)
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
																		<Label>{item.dynamics_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.dynamics_endpoint === VIEWS.LEAD
																					? leadInput
																					: item.dynamics_endpoint === VIEWS.CONTACT
																					? contactInput
																					: accountInput
																			}
																			setValue={
																				item.dynamics_endpoint === VIEWS.LEAD
																					? setLeadInput
																					: item.dynamics_endpoint === VIEWS.CONTACT
																					? setContactInput
																					: setAccountInput
																			}
																			name={item.dynamics_field}
																			disabled={!item.editable}
																			className={`${!item.editable && styles.disabled}`}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={item.possible_values?.map(item => ({
																				label: item.label,
																				value: item.value,
																			}))}
																		></Select>
																	</>
																)}
																{item.type === "radio_button" && (
																	<div className={`${styles.radioBox}`}>
																		<div className={styles.label}>
																			{item.dynamics_label}?
																		</div>
																		<div className={`${styles.btnBox}`}>
																			<div className={styles.btn}>
																				<InputRadio
																					className={styles.radio}
																					size="24"
																					disabled={!item.editable}
																					value={
																						item.dynamics_endpoint === VIEWS.LEAD
																							? leadInput[item.dynamics_field]
																							: item.dynamics_endpoint === VIEWS.CONTACT
																							? contactInput[item.dynamics_field]
																							: accountInput[item.dynamics_field]
																					}
																					checked={
																						item.dynamics_endpoint === VIEWS.LEAD
																							? leadInput[item.dynamics_field] !== ""
																								? leadInput[item.dynamics_field]
																								: false
																							: item.dynamics_endpoint === VIEWS.CONTACT
																							? contactInput[item.dynamics_field] !== ""
																								? contactInput[item.dynamics_field]
																								: false
																							: accountInput[item.dynamics_field] !== ""
																							? accountInput[item.dynamics_field]
																							: false
																					}
																					onChange={() => {
																						if (item.dynamics_endpoint === VIEWS.LEAD) {
																							setLeadInput(prev => ({
																								...prev,
																								[item.dynamics_field]:
																									!leadInput[item.dynamics_field],
																							}));
																						} else if (
																							item.dynamics_endpoint === VIEWS.CONTACT
																						) {
																							setContactInput(prev => ({
																								...prev,
																								[item.dynamics_field]:
																									!contactInput[item.dynamics_field],
																							}));
																						} else {
																							setAccountInput(prev => ({
																								...prev,
																								[item.dynamics_field]:
																									!accountInput[item.dynamics_field],
																							}));
																						}
																					}}
																				/>
																				<div className={styles.btnLabel}>Yes</div>
																			</div>
																			<div className={styles.btn}>
																				<InputRadio
																					className={styles.radio}
																					disabled={!item.editable}
																					size="24"
																					checked={
																						item.dynamics_endpoint === VIEWS.LEAD
																							? leadInput[item.dynamics_field] !== ""
																								? !leadInput[item.dynamics_field]
																								: false
																							: item.dynamics_endpoint === VIEWS.CONTACT
																							? contactInput[item.dynamics_field] !== ""
																								? !contactInput[item.dynamics_field]
																								: false
																							: accountInput[item.dynamics_field] !== ""
																							? !accountInput[item.dynamics_field]
																							: false
																					}
																					value={
																						item.dynamics_endpoint === VIEWS.LEAD
																							? !leadInput[item.dynamics_field]
																							: item.dynamics_endpoint === VIEWS.CONTACT
																							? !contactInput[item.dynamics_field]
																							: !accountInput[item.dynamics_field]
																					}
																					onChange={() => {
																						if (item.dynamics_endpoint === VIEWS.LEAD) {
																							setLeadInput(prev => ({
																								...prev,
																								[item.dynamics_field]:
																									!leadInput[item.dynamics_field],
																							}));
																						} else if (
																							item.dynamics_endpoint === VIEWS.CONTACT
																						) {
																							setContactInput(prev => ({
																								...prev,
																								[item.dynamics_field]:
																									!contactInput[item.dynamics_field],
																							}));
																						} else {
																							setAccountInput(prev => ({
																								...prev,
																								[item.dynamics_field]:
																									!accountInput[item.dynamics_field],
																							}));
																						}
																					}}
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
						}
						// )
					)
				}
			</div>
			<div className={styles.buttonSave}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					width="100%"
					height="49px"
					loading={setTestLoading}
					onClick={() => handleSave()}
				>
					{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default CustomObjectFormModal;
