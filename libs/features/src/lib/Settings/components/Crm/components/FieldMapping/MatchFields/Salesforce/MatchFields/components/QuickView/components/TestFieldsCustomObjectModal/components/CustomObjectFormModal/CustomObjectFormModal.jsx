import React, { useState, useEffect, useContext, useRef } from "react";
import moment from "moment-timezone";
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
import { REFERENCES } from "../../../../constants";
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
	const [inputChange, setInputChange] = useState();
	const [searchItem, setSearchItem] = useState();
	const user = useRecoilValue(userInfo);
	const [references, setReferences] = useState(REFERENCES);
	const { addError, addSuccess } = useContext(MessageContext);
	const {
		customObj,
		loading,
		setTest,
		setTestLoading,
		fetchReferenceFieldOptions,
		fetchReferenceFieldOptionsLoading,
	} = useCustomObject(true);

	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.sobject][item.salesforce_field];
				if (item.type === "multi_select_dropdown") {
					if (item.sobject === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.salesforce_field]: value != null ? value.split(";") : [],
						}));
					} else if (item.sobject === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.salesforce_field]: value != null ? value.split(";") : [],
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.salesforce_field]: value != null ? value.split(";") : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;
					if (type === "date") {
						if (item.sobject === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.salesforce_field]:
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
						} else if (item.sobject === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.salesforce_field]:
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
								[item.salesforce_field]:
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
						if (item.sobject === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.salesforce_field]:
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
						} else if (item.sobject === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.salesforce_field]:
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
								[item.salesforce_field]:
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
						if (item.sobject === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.salesforce_field]: value !== null ? value : "",
							}));
						} else if (item.sobject === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.salesforce_field]: value !== null ? value : "",
							}));
						} else {
							setAccountInput(prev => ({
								...prev,
								[item.salesforce_field]: value !== null ? value : "",
							}));
						}
					}
				} else if (item.type === "dropdown" && item.reference_field_name) {
					if (item.sobject === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.salesforce_field]: value != null ? value.id : "",
						}));
					} else if (item.sobject === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.salesforce_field]: value != null ? value.id : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.salesforce_field]: value != null ? value.id : "",
						}));
					}
				} else {
					if (item.sobject === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.salesforce_field]: value !== null ? value : "",
						}));
					} else if (item.sobject === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.salesforce_field]: value !== null ? value : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.salesforce_field]: value !== null ? value : "",
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
						<Label>{item.salesforce_label}</Label>
						<Input
							placeholder="Type here"
							type="textarea"
							height="70px"
							value={
								item.sobject === VIEWS.LEAD
									? leadInput
									: item.sobject === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							disabled={!item.editable}
							className={`${!item.editable && styles.disabled}`}
							setValue={
								item.sobject === VIEWS.LEAD
									? setLeadInput
									: item.sobject === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.salesforce_field}
						/>
					</>
				);
			case "date":
				return (
					<>
						<Label>{item.salesforce_label}</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={
								item.sobject === VIEWS.LEAD
									? leadInput
									: item.sobject === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							className={`${!item.editable && styles.disabled}`}
							disabled={!item.editable}
							setValue={
								item.sobject === VIEWS.LEAD
									? setLeadInput
									: item.sobject === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.salesforce_field}
						/>
					</>
				);
			case "datetime":
				return (
					<>
						<Label>{item.salesforce_label}</Label>
						<Input
							placeholder={"Select Date and Time"}
							type="datetime"
							left={item.position.column === 2 && count === 3}
							value={
								item.sobject === VIEWS.LEAD
									? leadInput
									: item.sobject === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							disabled={!item.editable}
							setValue={
								item.sobject === VIEWS.LEAD
									? setLeadInput
									: item.sobject === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.salesforce_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.salesforce_label}</Label>
						<Input
							type={type}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.sobject === VIEWS.LEAD
									? leadInput
									: item.sobject === VIEWS.CONTACT
									? contactInput
									: accountInput
							}
							setValue={
								item.sobject === VIEWS.LEAD
									? setLeadInput
									: item.sobject === VIEWS.CONTACT
									? setContactInput
									: setAccountInput
							}
							name={item.salesforce_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);
		}
	};

	const handleInputChange = (input, item) => {
		let body = {
			sObject: item.reference_field_name.sObject,
			search_term: input.length === 0 ? "a" : input,
			reference_field_name: item.reference_field_name.name,
		};
		fetchReferenceFieldOptions(body, {
			onSuccess: data => {
				setReferences(prev => ({
					...prev,
					[item.sobject]: {
						...prev[item.sobject],
						[item.salesforce_field]: data.records,
					},
				}));
			},
			onError: err => {
				console.log(err);
			},
		});
	};
	useEffect(() => {
		if (searchItem && inputChange) {
			const timer = setTimeout(() => handleInputChange(inputChange, searchItem), 300);
			return () => clearTimeout(timer);
		}
	}, [searchItem, inputChange]);
	const handleSave = () => {
		let body;
		let leadInp = JSON.parse(JSON.stringify(leadInput));

		let contactInp = JSON.parse(JSON.stringify(contactInput));

		let accountInp = JSON.parse(JSON.stringify(accountInput));
		delete accountInp.Id;

		form.forEach(item => {
			let value;
			if (item.sobject === VIEWS.LEAD) {
				value = leadInp[item.salesforce_field];
			} else if (item.sobject === VIEWS.CONTACT) {
				value = contactInp[item.salesforce_field];
			} else {
				value = accountInp[item.salesforce_field];
			}

			if (item.type === "multi_select_dropdown") {
				if (item.sobject === VIEWS.LEAD) {
					leadInp[item.salesforce_field] = value.length === 0 ? null : value.join(";");
				} else if (item.sobject === VIEWS.CONTACT) {
					contactInp[item.salesforce_field] = value.length === 0 ? null : value.join(";");
				} else {
					accountInp[item.salesforce_field] = value.length === 0 ? null : value.join(";");
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "date") {
					if (item.sobject === VIEWS.LEAD) {
						leadInp[item.salesforce_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else if (item.sobject === VIEWS.CONTACT) {
						contactInp[item.salesforce_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else {
						accountInp[item.salesforce_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					}
				} else if (type === "datetime") {
					if (item.sobject === VIEWS.LEAD) {
						leadInp[item.salesforce_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  )
										.toISOString()
										.replace("Z", "+0000")
								: null;
					} else if (item.sobject === VIEWS.CONTACT) {
						contactInp[item.salesforce_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  )
										.toISOString()
										.replace("Z", "+0000")
								: null;
					} else {
						accountInp[item.salesforce_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  )
										.toISOString()
										.replace("Z", "+0000")
								: null;
					}
				} else {
					if (item.sobject === VIEWS.LEAD) {
						leadInp[item.salesforce_field] = value === "" ? null : value;
					} else if (item.sobject === VIEWS.CONTACT) {
						contactInp[item.salesforce_field] = value === "" ? null : value;
					} else {
						accountInp[item.salesforce_field] = value === "" ? null : value;
					}
				}
			} else {
				if (item.sobject === VIEWS.LEAD) {
					leadInp[item.salesforce_field] =
						value === "" || value === undefined ? null : value;
				} else if (item.sobject === VIEWS.CONTACT) {
					contactInp[item.salesforce_field] =
						value === "" || value === undefined ? null : value;
				} else {
					accountInp[item.salesforce_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});

		if (buildFormFor === VIEWS.LEAD) {
			form.forEach(item => {
				if (item.editable === false) {
					delete leadInp[item.salesforce_field];
				}
			});
			body = {
				type: VIEWS.LEAD,
				id: fields[VIEWS.LEAD].Id,
				custom_object: leadInp,
			};
		} else if (Object.keys(accountInput).length === 0) {
			form.forEach(item => {
				if (item.editable === false) {
					delete contactInp[item.salesforce_field];
				}
			});
			body = {
				type: VIEWS.CONTACT,
				id: fields[VIEWS.CONTACT].Id,
				custom_object: contactInp,
			};
		} else {
			form.forEach(item => {
				if (item.editable === false) {
					if (item.sobject === VIEWS.CONTACT) delete contactInp[item.salesforce_field];
					else delete accountInp[item.salesforce_field];
				}
			});
			body = {
				type: VIEWS.CONTACT,
				id: fields[VIEWS.CONTACT].Id,
				custom_object: contactInp,
				custom_object_account: accountInp,
				salesforce_account_id: fields[VIEWS.CONTACT].AccountId,
			};
		}

		setTest(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${buildFormFor} in salesforce`);
				onClose();
				setReferences(REFERENCES);
				setShowLeadUrlModal(true);
			},
			onError: err => {
				return addError({
					text: err?.response.data.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
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
				setReferences(REFERENCES);
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
																{item.type === "dropdown" && !item.reference_to && (
																	<>
																		<Label>{item.salesforce_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.sobject === VIEWS.LEAD
																					? leadInput
																					: item.sobject === VIEWS.CONTACT
																					? contactInput
																					: accountInput
																			}
																			setValue={
																				item.sobject === VIEWS.LEAD
																					? setLeadInput
																					: item.sobject === VIEWS.CONTACT
																					? setContactInput
																					: setAccountInput
																			}
																			name={item.salesforce_field}
																			disabled={!item.editable}
																			className={`${!item.editable && styles.disabled}`}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={item.possible_values.map(item => ({
																				label: item.label,
																				value: item.value,
																			}))}
																		></Select>
																	</>
																)}
																{item.type === "dropdown" && item.reference_to && (
																	<>
																		<Label>{item.salesforce_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.sobject === VIEWS.LEAD
																					? leadInput
																					: item.sobject === VIEWS.CONTACT
																					? contactInput
																					: accountInput
																			}
																			setValue={
																				item.sobject === VIEWS.LEAD
																					? setLeadInput
																					: item.sobject === VIEWS.CONTACT
																					? setContactInput
																					: setAccountInput
																			}
																			isLoading={
																				searchItem?.salesforce_field ===
																					item?.salesforce_field &&
																				fetchReferenceFieldOptionsLoading
																			}
																			name={item.salesforce_field}
																			icon={<Search color={Colors.lightBlue} />}
																			iconIsRotatable={false}
																			disabled={!item.editable}
																			background={!item.editable && "rgb(250, 246, 246)"}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={
																				Array.isArray(
																					references[item.sobject]?.[
																						item.salesforce_field
																					]
																				)
																					? references[item.sobject]?.[
																							item.salesforce_field
																					  ]?.map(obj => ({
																							label: obj[item.reference_field_name.name],
																							value: obj.Id,
																					  }))
																					: Object.keys(fields[item.sobject]).length !==
																							0 &&
																					  fields[item.sobject][item.salesforce_field] !=
																							null && [
																							{
																								label:
																									fields[item.sobject][
																										item.salesforce_field
																									][item.reference_field_name?.name],
																								value:
																									fields[item.sobject][
																										item.salesforce_field
																									].id,
																							},
																					  ]
																			}
																			onFocus={() => {
																				setInputChange(
																					fields[item.sobject][item.salesforce_field]
																						? fields[item.sobject]?.[
																								item.salesforce_field
																						  ]?.[item.reference_field_name?.name]?.[0]
																						: "a"
																				);
																				setSearchItem(item);
																			}}
																			onInputChange={input =>
																				input
																					? setInputChange(input)
																					: setInputChange(
																							fields[item.sobject][item.salesforce_field]
																								? fields[item.sobject]?.[
																										item.salesforce_field
																								  ]?.[
																										item.reference_field_name?.name
																								  ]?.[0]
																								: "a"
																					  )
																			}
																			isSearchable
																			isClearable
																		></Select>
																	</>
																)}
																{item.type === "multi_select_dropdown" && (
																	<>
																		<Label>{item.salesforce_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			disabled={!item.editable}
																			value={
																				item.sobject === VIEWS.LEAD
																					? leadInput
																					: item.sobject === VIEWS.CONTACT
																					? contactInput
																					: accountInput
																			}
																			setValue={
																				item.sobject === VIEWS.LEAD
																					? setLeadInput
																					: item.sobject === VIEWS.CONTACT
																					? setContactInput
																					: setAccountInput
																			}
																			name={item.salesforce_field}
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
																			{item.salesforce_label}?
																		</div>
																		<div className={`${styles.btnBox}`}>
																			<div className={styles.btn}>
																				<InputRadio
																					className={styles.radio}
																					size="24"
																					disabled={!item.editable}
																					value={
																						item.sobject === VIEWS.LEAD
																							? leadInput[item.salesforce_field]
																							: item.sobject === VIEWS.CONTACT
																							? contactInput[item.salesforce_field]
																							: accountInput[item.salesforce_field]
																					}
																					checked={
																						item.sobject === VIEWS.LEAD
																							? leadInput[item.salesforce_field] !== ""
																								? leadInput[item.salesforce_field]
																								: false
																							: item.sobject === VIEWS.CONTACT
																							? contactInput[item.salesforce_field] !== ""
																								? contactInput[item.salesforce_field]
																								: false
																							: accountInput[item.salesforce_field] !== ""
																							? accountInput[item.salesforce_field]
																							: false
																					}
																					onChange={() => {
																						if (item.sobject === VIEWS.LEAD) {
																							setLeadInput(prev => ({
																								...prev,
																								[item.salesforce_field]:
																									!leadInput[item.salesforce_field],
																							}));
																						} else if (item.sobject === VIEWS.CONTACT) {
																							setContactInput(prev => ({
																								...prev,
																								[item.salesforce_field]:
																									!contactInput[item.salesforce_field],
																							}));
																						} else {
																							setAccountInput(prev => ({
																								...prev,
																								[item.salesforce_field]:
																									!accountInput[item.salesforce_field],
																							}));
																						}
																					}}
																				/>
																				<div className={styles.btnLabel}>
																					{
																						COMMON_TRANSLATION.PROFILE_SETTING[
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
																						item.sobject === VIEWS.LEAD
																							? leadInput[item.salesforce_field] !== ""
																								? !leadInput[item.salesforce_field]
																								: false
																							: item.sobject === VIEWS.CONTACT
																							? contactInput[item.salesforce_field] !== ""
																								? !contactInput[item.salesforce_field]
																								: false
																							: accountInput[item.salesforce_field] !== ""
																							? !accountInput[item.salesforce_field]
																							: false
																					}
																					value={
																						item.sobject === VIEWS.LEAD
																							? !leadInput[item.salesforce_field]
																							: item.sobject === VIEWS.CONTACT
																							? !contactInput[item.salesforce_field]
																							: !accountInput[item.salesforce_field]
																					}
																					onChange={() => {
																						if (item.sobject === VIEWS.LEAD) {
																							setLeadInput(prev => ({
																								...prev,
																								[item.salesforce_field]:
																									!leadInput[item.salesforce_field],
																							}));
																						} else if (item.sobject === VIEWS.CONTACT) {
																							setContactInput(prev => ({
																								...prev,
																								[item.salesforce_field]:
																									!contactInput[item.salesforce_field],
																							}));
																						} else {
																							setAccountInput(prev => ({
																								...prev,
																								[item.salesforce_field]:
																									!accountInput[item.salesforce_field],
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
