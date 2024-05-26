import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import styles from "./QualificationsModal.module.scss";

import { Modal } from "@cadence-frontend/components";
import {
	Label,
	Input,
	Select,
	InputRadio,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { VIEWS } from "./constants";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import FormPlaceholder from "../../components/Placeholder/Placeholder";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";

const QualificationsModal = ({
	modal,
	fields,
	lead,
	form,
	buttonText,
	onClose,
	fetchCustomObjectDetailsLoading,
}) => {
	const [maxRow, setMaxRow] = useState(0);
	const [leadInput, setLeadInput] = useState({});
	const [contactInput, setContactInput] = useState({});
	const [accountInput, setAccountInput] = useState({});
	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const { setCustomObject, setCustomObjectLoading } = useCustomObject();

	const inputFunc = () => {
		if (form) {
			form.forEach(item => {
				const value = fields?.[item.integration_endpoint]?.[item.integration_field];
				if (item.type === "multi_select_dropdown") {
					if (item.integration_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value.split(";") : [],
						}));
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value.split(";") : [],
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value.split(";") : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;
					if (type === "date") {
						if (item.integration_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.integration_field]:
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
						} else if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]:
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
								[item.integration_field]:
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
						if (item.integration_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.integration_field]:
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
						} else if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]:
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
								[item.integration_field]:
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
						if (item.integration_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value : "",
							}));
						} else if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value : "",
							}));
						} else {
							setAccountInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value : "",
							}));
						}
					}
				} else {
					if (item.integration_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.integration_field]: value !== null ? value : "",
						}));
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.integration_field]: value !== null ? value : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.integration_field]: value !== null ? value : "",
						}));
					}
				}
			});
		}
	};

	useEffect(() => {
		inputFunc();
	}, [form, fields]);

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
						<Label>{item.integration_label}</Label>
						<Input
							placeholder="Type here"
							type="textarea"
							height="70px"
							value={
								item.integration_endpoint === VIEWS.LEAD
									? leadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							disabled={!item.editable}
							className={`${!item.editable && styles.disabled}`}
							setValue={
								item.integration_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.integration_field}
						/>
					</>
				);
			case "integer":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							type={"integer"}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.integration_endpoint === VIEWS.LEAD
									? leadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.integration_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.integration_field}
							className={`${!item.editable && styles.disabled} ${styles.numberBox}`}
						/>
					</>
				);
			case "number":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							type={"number"}
							isDecimalAllowed
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.integration_endpoint === VIEWS.LEAD
									? leadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.integration_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.integration_field}
							className={`${!item.editable && styles.disabled} ${styles.numberBox}`}
						/>
					</>
				);
			case "date":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={
								item.integration_endpoint === VIEWS.LEAD
									? leadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							className={`${!item.editable && styles.disabled}`}
							disabled={!item.editable}
							setValue={
								item.integration_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.integration_field}
						/>
					</>
				);
			case "datetime":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							placeholder={"Select Date and Time"}
							type="datetime"
							left={item.position.column === 2 && count === 3}
							value={
								item.integration_endpoint === VIEWS.LEAD
									? leadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							disabled={!item.editable}
							setValue={
								item.integration_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.integration_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							type={type}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.integration_endpoint === VIEWS.LEAD
									? leadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.integration_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.integration_field}
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
			if (item.integration_endpoint === VIEWS.LEAD) {
				value = leadInp[item.integration_field];
			} else if (item.integration_endpoint === VIEWS.CONTACT) {
				value = contactInp[item.integration_field];
			} else {
				value = accountInp[item.integration_field];
			}

			if (item.type === "multi_select_dropdown") {
				if (item.integration_endpoint === VIEWS.LEAD) {
					leadInp[item.integration_field] = value.length === 0 ? null : value.join(";");
				} else if (item.integration_endpoint === VIEWS.CONTACT) {
					contactInp[item.integration_field] =
						value.length === 0 ? null : value.join(";");
				} else {
					accountInp[item.integration_field] =
						value.length === 0 ? null : value.join(";");
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "date") {
					if (item.integration_endpoint === VIEWS.LEAD) {
						leadInp[item.integration_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else {
						accountInp[item.integration_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					}
				} else if (type === "datetime") {
					if (item.integration_endpoint === VIEWS.LEAD) {
						leadInp[item.integration_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time.split(":")[0],
										value.time.split(":")[1]
								  )
										.toISOString()
										.replace("Z", "+0000")
								: null;
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time.split(":")[0],
										value.time.split(":")[1]
								  )
										.toISOString()
										.replace("Z", "+0000")
								: null;
					} else {
						accountInp[item.integration_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time.split(":")[0],
										value.time.split(":")[1]
								  )
										.toISOString()
										.replace("Z", "+0000")
								: null;
					}
				} else if (type === "integer") {
					if (item.integration_endpoint === VIEWS.LEAD) {
						leadInp[item.integration_field] = value === "" ? null : Number(value);
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] = value === "" ? null : Number(value);
					} else {
						accountInp[item.integration_field] = value === "" ? null : Number(value);
					}
				} else {
					if (item.integration_endpoint === VIEWS.LEAD) {
						leadInp[item.integration_field] = value === "" ? null : value;
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] = value === "" ? null : value;
					} else {
						accountInp[item.integration_field] = value === "" ? null : value;
					}
				}
			} else {
				if (item.integration_endpoint === VIEWS.LEAD) {
					leadInp[item.integration_field] =
						value === "" || value === undefined ? null : value;
				} else if (item.integration_endpoint === VIEWS.CONTACT) {
					contactInp[item.integration_field] =
						value === "" || value === undefined ? null : value;
				} else {
					accountInp[item.integration_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});

		if (
			lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD &&
			lead.integration_id
		) {
			form.forEach(item => {
				if (item.editable === false) {
					delete leadInp[item.integration_field];
				}
			});
			body = {
				lead_id: lead.lead_id.toString(),
				custom_object: leadInp,
			};
		} else if (Object.keys(accountInput).length === 0) {
			form.forEach(item => {
				if (item.editable === false) {
					delete contactInp[item.integration_field];
				}
			});
			body = {
				lead_id: lead.lead_id.toString(),
				custom_object: contactInp,
			};
		} else {
			form.forEach(item => {
				if (item.editable === false) {
					if (item.integration_endpoint === VIEWS.CONTACT)
						delete contactInp[item.integration_field];
					else delete accountInp[item.integration_field];
				}
			});
			body = {
				lead_id: lead.lead_id.toString(),
				custom_object: contactInp,
				custom_object_account: accountInp,
				dynamics_account_id: fields[VIEWS.ACCOUNT].accountid,
			};
		}

		setCustomObject(body, {
			onSuccess: () => {
				addSuccess(
					`Successfully updated ${
						lead.integration_type === LEAD_INTEGRATION_TYPES.DYNAMICS_LEAD &&
						lead.integration_id
							? VIEWS.LEAD
							: VIEWS.CONTACT
					} in dynamics`
				);
				onClose();
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

	return (
		<Modal
			showCloseButton
			isModal={modal}
			className={styles.preview}
			onClose={() => {
				onClose();
				inputFunc();
			}}
		>
			<div className={styles.headingText}>{buttonText}</div>

			<div className={`${styles.body}`}>
				{fetchCustomObjectDetailsLoading ? (
					<div>
						<FormPlaceholder row={maxRow + 1} />
					</div>
				) : (
					[...Array(maxRow + 1).keys()].map(row => {
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
																	<Label>{item.integration_label}</Label>
																	<Select
																		placeholder={
																			COMMON_TRANSLATION.SELECT_HERE[
																				user?.language?.toUpperCase()
																			]
																		}
																		value={
																			item.integration_endpoint === VIEWS.LEAD
																				? leadInput
																				: item.integration_endpoint === VIEWS.CONTACT
																				? contactInput
																				: accountInput
																		}
																		setValue={
																			item.integration_endpoint === VIEWS.LEAD
																				? setLeadInput
																				: item.integration_endpoint === VIEWS.CONTACT
																				? setContactInput
																				: setAccountInput
																		}
																		name={item.integration_field}
																		disabled={!item.editable}
																		className={`${!item.editable && styles.disabled}`}
																		menuOnTop={row === maxRow ? true : false}
																		numberOfOptionsVisible="3"
																		options={item?.possible_values?.map(item => ({
																			label: item.label,
																			value: item.value,
																		}))}
																	></Select>
																</>
															)}
															{item.type === "multi_select_dropdown" && (
																<>
																	<Label>{item.integration_label}</Label>
																	<Select
																		placeholder={
																			COMMON_TRANSLATION.SELECT_HERE[
																				user?.language?.toUpperCase()
																			]
																		}
																		disabled={!item.editable}
																		value={
																			item.integration_endpoint === VIEWS.LEAD
																				? leadInput
																				: item.integration_endpoint === VIEWS.CONTACT
																				? contactInput
																				: accountInput
																		}
																		setValue={
																			item.integration_endpoint === VIEWS.LEAD
																				? setLeadInput
																				: item.integration_endpoint === VIEWS.CONTACT
																				? setContactInput
																				: setAccountInput
																		}
																		name={item.integration_field}
																		height="auto"
																		menuOnTop={row === maxRow ? true : false}
																		className={`${!item.editable && styles.disabled}`}
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
																<div className={`${styles.radioBox}`}>
																	<div className={styles.label}>
																		{item.integration_label}?
																	</div>
																	<div className={`${styles.btnBox}`}>
																		<div className={styles.btn}>
																			<InputRadio
																				className={styles.radio}
																				size="24"
																				disabled={!item.editable}
																				value={
																					item.integration_endpoint === VIEWS.LEAD
																						? leadInput[item.integration_field]
																						: item.integration_endpoint === VIEWS.CONTACT
																						? contactInput[item.integration_field]
																						: accountInput[item.integration_field]
																				}
																				checked={
																					item.integration_endpoint === VIEWS.LEAD
																						? leadInput[item.integration_field] !== ""
																							? leadInput[item.integration_field]
																							: false
																						: item.integration_endpoint === VIEWS.CONTACT
																						? contactInput[item.integration_field] !== ""
																							? contactInput[item.integration_field]
																							: false
																						: accountInput[item.integration_field] !== ""
																						? accountInput[item.integration_field]
																						: false
																				}
																				onChange={() => {
																					if (item.integration_endpoint === VIEWS.LEAD) {
																						setLeadInput(prev => ({
																							...prev,
																							[item.integration_field]:
																								!leadInput[item.integration_field],
																						}));
																					} else if (
																						item.integration_endpoint === VIEWS.CONTACT
																					) {
																						setContactInput(prev => ({
																							...prev,
																							[item.integration_field]:
																								!contactInput[item.integration_field],
																						}));
																					} else {
																						setAccountInput(prev => ({
																							...prev,
																							[item.integration_field]:
																								!accountInput[item.integration_field],
																						}));
																					}
																				}}
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
																				disabled={!item.editable}
																				size="24"
																				checked={
																					item.integration_endpoint === VIEWS.LEAD
																						? leadInput[item.integration_field] !== ""
																							? !leadInput[item.integration_field]
																							: false
																						: item.integration_endpoint === VIEWS.CONTACT
																						? contactInput[item.integration_field] !== ""
																							? !contactInput[item.integration_field]
																							: false
																						: accountInput[item.integration_field] !== ""
																						? !accountInput[item.integration_field]
																						: false
																				}
																				value={
																					item.integration_endpoint === VIEWS.LEAD
																						? !leadInput[item.integration_field]
																						: item.integration_endpoint === VIEWS.CONTACT
																						? !contactInput[item.integration_field]
																						: !accountInput[item.integration_field]
																				}
																				onChange={() => {
																					if (item.integration_endpoint === VIEWS.LEAD) {
																						setLeadInput(prev => ({
																							...prev,
																							[item.integration_field]:
																								!leadInput[item.integration_field],
																						}));
																					} else if (
																						item.integration_endpoint === VIEWS.CONTACT
																					) {
																						setContactInput(prev => ({
																							...prev,
																							[item.integration_field]:
																								!contactInput[item.integration_field],
																						}));
																					} else {
																						setAccountInput(prev => ({
																							...prev,
																							[item.integration_field]:
																								!accountInput[item.integration_field],
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
					})
				)}
			</div>
			<div className={styles.buttonSave}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					width="100%"
					height="49px"
					loading={setCustomObjectLoading}
					onClick={() => handleSave()}
				>
					<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default QualificationsModal;
