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
import { PHONE_OPTIONS, EMAIL_OPTIONS } from "../constants";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import FormPlaceholder from "../../../Placeholder/Placeholder";
import { Search, Delete, Plus } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
const CustomObjectFormModal = ({
	modal,
	setModal,
	fields,
	onClose,
	setShowLeadUrlModal,
}) => {
	const [maxRow, setMaxRow] = useState(0);
	const [form, setForm] = useState();
	const [buttonText, setButtonText] = useState();
	const [contactInput, setContactInput] = useState({});
	const [companyInput, setCompanyInput] = useState({});

	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const { customObj, loading, setTest, setTestLoading } = useCustomObject(true);
	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.hubspot_endpoint][item.hubspot_field];
				if (item.type === "multi_select_dropdown") {
					if (item.hubspot_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.hubspot_field]: value != null ? value.split(";") : [],
						}));
					} else {
						setCompanyInput(prev => ({
							...prev,
							[item.hubspot_field]: value != null ? value.split(";") : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;
					if (type === "date") {
						if (item.hubspot_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.hubspot_field]:
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
							setCompanyInput(prev => ({
								...prev,
								[item.hubspot_field]:
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
						// if (item.hubspot_endpoint === VIEWS.LEAD) {
						// 	setLeadInput(prev => ({
						// 		...prev,
						// 		[item.hubspot_field]:
						// 			value != null
						// 				? {
						// 						DD: moment(value).format("DD"),
						// 						MM: moment(value).format("MM"),
						// 						YYYY: moment(value).format("YYYY"),
						// 						time: `${moment(value).format("HH")}:${moment(value).format(
						// 							"mm"
						// 						)}`,
						// 				  }
						// 				: {
						// 						DD: "dd",
						// 				  },
						// 	}));
						// } else
						if (item.hubspot_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.hubspot_field]:
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
							setCompanyInput(prev => ({
								...prev,
								[item.hubspot_field]:
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
						// if (item.hubspot_endpoint === VIEWS.LEAD) {
						// 	setLeadInput(prev => ({
						// 		...prev,
						// 		[item.hubspot_field]: value !== null ? value : "",
						// 	}));
						// } else
						if (item.hubspot_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.hubspot_field]: value !== null ? value : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.hubspot_field]: value !== null ? value : "",
							}));
						}
					}
				}
				//  else if (item.type === "input_select") {
				// 	if (item.hubspot_endpoint === VIEWS.CONTACT) {
				// 		setContactInput(prev => ({
				// 			...prev,
				// 			[item.hubspot_field]:
				// 				value !== null
				// 					? value
				// 					: [
				// 							{
				// 								label: "home",
				// 								value: "",
				// 							},
				// 					  ],
				// 		}));
				// 	} else {
				// 		setCompanyInput(prev => ({
				// 			...prev,
				// 			[item.hubspot_field]:
				// 				value !== null
				// 					? value
				// 					: [
				// 							{
				// 								label: "home",
				// 								value: "",
				// 							},
				// 					  ],
				// 		}));
				// 	}
				// }
				//  else if (item.type === "dropdown" && item.reference_field_name) {
				// 	// if (item.hubspot_endpoint === VIEWS.LEAD) {
				// 	// 	setLeadInput(prev => ({
				// 	// 		...prev,
				// 	// 		[item.hubspot_field]: value != null ? value.id : "",
				// 	// 	}));
				// 	// } else
				// 	if (item.hubspot_endpoint === VIEWS.CONTACT) {
				// 		setContactInput(prev => ({
				// 			...prev,
				// 			[item.hubspot_field]: value != null ? value.id : "",
				// 		}));
				// 	} else {
				// 		setCompanyInput(prev => ({
				// 			...prev,
				// 			[item.hubspot_field]: value != null ? value.id : "",
				// 		}));
				// 	}
				// }
				else {
					// if (item.hubspot_endpoint === VIEWS.LEAD) {
					// 	setLeadInput(prev => ({
					// 		...prev,
					// 		[item.hubspot_field]: value !== null ? value : "",
					// 	}));
					// } else
					if (item.hubspot_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.hubspot_field]: value !== null ? value : "",
						}));
					} else {
						setCompanyInput(prev => ({
							...prev,
							[item.hubspot_field]: value !== null ? value : "",
						}));
					}
				}
			});
		}
	}, [form, fields]);

	useEffect(() => {
		// if (buildFormFor === "lead") {
		// 	if (customObj?.lead_custom_object != null) {
		// 		setForm(customObj?.lead_custom_object[0].form);
		// 		setButtonText(customObj?.lead_custom_object[0].button_text);
		// 	} else {
		// 		setForm([]);
		// 		setButtonText("Qualification");
		// 	}
		// } else {
		if (customObj?.contact_custom_object != null) {
			setForm(customObj?.contact_custom_object[0].form);
			setButtonText(customObj?.contact_custom_object[0].button_text);
		} else {
			setForm([]);
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
		// }

		setContactInput({});
		setCompanyInput({});
	}, [customObj]);
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
						<Label>{item.hubspot_label}</Label>
						<Input
							placeholder="Type here"
							type="textarea"
							height="70px"
							value={
								item.hubspot_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							disabled={!item.editable}
							className={`${!item.editable && styles.disabled}`}
							setValue={
								item.hubspot_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
							}
							name={item.hubspot_field}
						/>
					</>
				);
			case "date":
				return (
					<>
						<Label>{item.hubspot_label}</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={
								item.hubspot_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							className={`${!item.editable && styles.disabled}`}
							disabled={!item.editable}
							setValue={
								item.hubspot_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.hubspot_field}
						/>
					</>
				);
			case "datetime":
				return (
					<>
						<Label>{item.hubspot_label}</Label>
						<Input
							placeholder={"Select Date and Time"}
							type="datetime"
							left={item.position.column === 2 && count === 3}
							value={
								item.hubspot_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							disabled={!item.editable}
							setValue={
								item.hubspot_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
							}
							name={item.hubspot_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.hubspot_label}</Label>
						<Input
							type={type}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.hubspot_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							setValue={
								item.hubspot_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
							}
							name={item.hubspot_field}
							className={`${!item.editable && styles.disabled} ${styles.intInput}`}
						/>
					</>
				);
		}
	};

	// const handleInputChange = (input, item) => {
	// 	let body = {
	// 		hubspot_endpoint: item.reference_field_name.hubspot_endpoint,
	// 		search_term: input.length === 0 ? "a" : input,
	// 		reference_field_name: item.reference_field_name.name,
	// 	};
	// 	fetchReferenceFieldOptions(body, {
	// 		onSuccess: data => {
	// 			setReferences(prev => ({
	// 				...prev,
	// 				[item.hubspot_endpoint]: {
	// 					...prev[item.hubspot_endpoint],
	// 					[item.hubspot_field]: data.records,
	// 				},
	// 			}));
	// 		},
	// 		onError: err => {
	// 			console.log(err);
	// 		},
	// 	});
	// };
	// useEffect(() => {
	// 	if (searchItem && inputChange) {
	// 		const timer = setTimeout(() => handleInputChange(inputChange, searchItem), 300);
	// 		return () => clearTimeout(timer);
	// 	}
	// }, [searchItem, inputChange]);
	const handleSave = () => {
		let body;
		// let leadInp = JSON.parse(JSON.stringify(leadInput));

		let contactInp = JSON.parse(JSON.stringify(contactInput));

		let companyInp = JSON.parse(JSON.stringify(companyInput));
		delete companyInp.Id;

		form.forEach(item => {
			let value;
			// if (item.hubspot_endpoint === VIEWS.LEAD) {
			// 	value = leadInp[item.hubspot_field];
			// } else
			if (item.hubspot_endpoint === VIEWS.CONTACT) {
				value = contactInp[item.hubspot_field];
			} else {
				value = companyInp[item.hubspot_field];
			}

			if (item.type === "multi_select_dropdown") {
				// if (item.hubspot_endpoint === VIEWS.LEAD) {
				// 	leadInp[item.hubspot_field] = value.length === 0 ? null : value.join(";");
				// } else
				if (item.hubspot_endpoint === VIEWS.CONTACT) {
					contactInp[item.hubspot_field] = value.length === 0 ? null : value.join(";");
				} else {
					companyInp[item.hubspot_field] = value.length === 0 ? null : value.join(";");
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "date") {
					// if (item.hubspot_endpoint === VIEWS.LEAD) {
					// 	leadInp[item.hubspot_field] =
					// 		value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					// } else
					if (item.hubspot_endpoint === VIEWS.CONTACT) {
						contactInp[item.hubspot_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else {
						companyInp[item.hubspot_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					}
				} else if (type === "datetime") {
					// if (item.hubspot_endpoint === VIEWS.LEAD) {
					// 	leadInp[item.hubspot_field] =
					// 		value.DD !== "dd"
					// 			? new Date(
					// 					value.YYYY,
					// 					value.MM - 1,
					// 					value.DD,
					// 					value.time ? value.time.split(":")[0] : "00",
					// 					value.time ? value.time.split(":")[1] : "00"
					// 			  )
					// 					.toISOString()
					// 					.replace("Z", "+0000")
					// 			: null;

					// }
					//  else
					if (item.hubspot_endpoint === VIEWS.CONTACT) {
						contactInp[item.hubspot_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  ).toISOString()
								: null;
					} else {
						companyInp[item.hubspot_field] =
							value.DD !== "dd"
								? new Date(
										value.YYYY,
										value.MM - 1,
										value.DD,
										value.time ? value.time.split(":")[0] : "00",
										value.time ? value.time.split(":")[1] : "00"
								  ).toISOString()
								: null;
					}
				} else {
					// if (item.hubspot_endpoint === VIEWS.LEAD) {
					// 	leadInp[item.hubspot_field] = value === "" ? null : value;
					// } else
					if (item.hubspot_endpoint === VIEWS.CONTACT) {
						contactInp[item.hubspot_field] = value === "" ? null : value;
					} else {
						companyInp[item.hubspot_field] = value === "" ? null : value;
					}
				}
			} else if (item.type === "input_select") {
				if (item.hubspot_endpoint === VIEWS.CONTACT) {
					contactInp[item.hubspot_field] = value;
				} else {
					companyInp[item.hubspot_field] = value;
				}
			} else {
				// if (item.hubspot_endpoint === VIEWS.LEAD) {
				// 	leadInp[item.hubspot_field] =
				// 		value === "" || value === undefined ? null : value;
				// } else
				if (item.hubspot_endpoint === VIEWS.CONTACT) {
					contactInp[item.hubspot_field] =
						value === "" || value === undefined ? null : value;
				} else {
					companyInp[item.hubspot_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});

		// if (buildFormFor === VIEWS.LEAD) {
		// 	form.forEach(item => {
		// 		if (item.editable === false) {
		// 			delete leadInp[item.hubspot_field];
		// 		}
		// 	});
		// 	body = {
		// 		type: VIEWS.LEAD,
		// 		id: fields[VIEWS.LEAD].Id,
		// 		custom_object: leadInp,
		// 	};
		// } else
		form.forEach(item => {
			if (item.editable === false) {
				if (item.hubspot_endpoint === VIEWS.CONTACT)
					delete contactInp[item.hubspot_field];
				else delete companyInp[item.hubspot_field];
			}
		});
		// if (Object.keys(companyInp).length === 0) {
		// 	body = {
		// 		contact_id: fields[VIEWS.CONTACT]?.hs_object_id,
		// 		custom_object: contactInp,
		// 	};
		// } else if (Object.keys(contactInp).length === 0) {
		// 	body = {
		// 		contact_id: fields[VIEWS.CONTACT].hs_object_id,
		// 		hubspot_company_id: fields[VIEWS.CONTACT]?.associatedcompanyid,
		// 		custom_object_company: companyInp,
		// 	};
		// } else {
		body = {
			contact_id: fields[VIEWS.CONTACT].hs_object_id,
			custom_object: contactInp,
			custom_object_company: companyInp,
			hubspot_company_id: fields[VIEWS.CONTACT]?.associatedcompanyid,
		};
		// }

		setTest(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${VIEWS.CONTACT} in hubspot`);
				onClose();
				// setReferences(REFERENCES);
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
	const handleDelete = (item, key) => {
		if (item?.hubspot_endpoint === VIEWS.CONTACT) {
			setContactInput(prev => ({
				...prev,
				[item?.hubspot_field]: prev[item.hubspot_field]?.filter((i, k) => k !== key),
			}));
		} else {
			setCompanyInput(prev => ({
				...prev,
				[item?.hubspot_field]: prev[item.hubspot_field]?.filter((i, k) => k !== key),
			}));
		}
	};
	const handleAdd = item => {
		if (item?.hubspot_endpoint === VIEWS.CONTACT) {
			setContactInput(prev => ({
				...prev,
				[item?.hubspot_field]: [
					...prev[item.hubspot_field],
					{
						label: "home",
						value: "",
					},
				],
			}));
		} else {
			setCompanyInput(prev => ({
				...prev,
				[item?.hubspot_field]: [
					...prev[item.hubspot_field],
					{
						label: "home",
						value: "",
					},
				],
			}));
		}
	};
	console.log(contactInput, "ContactInput");
	console.log(companyInput, "company Input");
	return (
		<Modal
			showCloseButton
			isModal={modal}
			className={styles.preview}
			onClose={() => {
				onClose();
				// setReferences(REFERENCES);
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
																		<Label>{item.hubspot_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.hubspot_endpoint === VIEWS.CONTACT
																					? contactInput
																					: companyInput
																			}
																			setValue={
																				item.hubspot_endpoint === VIEWS.CONTACT
																					? setContactInput
																					: setCompanyInput
																			}
																			name={item.hubspot_field}
																			disabled={!item.editable}
																			className={`${!item.editable && styles.disabled}`}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={item?.possible_values?.map(item => ({
																				label: item?.label,
																				value: item?.value,
																			}))}
																		></Select>
																	</>
																)}
																{/* {item.type === "input_select" && (
																	<>
																		<Label>{item.hubspot_label}</Label>

																		<div className={styles.inputSelectBox}>
																			{item.hubspot_endpoint === VIEWS.CONTACT
																				? contactInput[item.hubspot_field]?.map(
																						(inp, key) => {
																							return (
																								<div className={styles.current}>
																									<div className={styles.inputBox}>
																										<Input
																											placeholder="Type here"
																											// disabled={!item.editable}
																											value={inp?.value}
																											setValue={val => {
																												setContactInput(prev => ({
																													...prev,
																													[item.hubspot_field]: prev[
																														item.hubspot_field
																													]?.map((i, k) => {
																														if (k === key) {
																															return {
																																...i,
																																value: val,
																															};
																														} else {
																															return i;
																														}
																													}),
																												}));
																											}}
																											name={item.hubspot_field}
																											className={`${styles.inputSelect} ${
																												!item.editable && styles.disabled
																											}`}
																										/>
																									</div>
																									<div className={styles.selectBox}>
																										<Select
																											placeholder={"Select here"}
																											borderRadius={"0 15px 15px 0"}
																											options={
																												item?.input_type === "phone"
																													? PHONE_OPTIONS
																													: EMAIL_OPTIONS
																											}
																											disabled={!item.editable}
																											value={inp.label}
																											setValue={val => {
																												setContactInput(prev => ({
																													...prev,
																													[item.hubspot_field]: prev[
																														item.hubspot_field
																													]?.map((i, k) => {
																														if (k === key) {
																															return {
																																...i,
																																label: val,
																															};
																														} else {
																															return i;
																														}
																													}),
																												}));
																											}}
																										></Select>
																									</div>
																									{contactInput[item.hubspot_field]
																										.length > 1 && (
																										<div
																											className={styles.delete}
																											onClick={() =>
																												item?.editable &&
																												handleDelete(item, key)
																											}
																										>
																											<Delete
																												color={Colors.veryLightBlue}
																												size="1.4rem"
																											/>
																										</div>
																									)}
																								</div>
																							);
																						}
																				  )
																				: companyInput[item.hubspot_field]?.map(
																						(inp, key) => {
																							return (
																								<div className={styles.current}>
																									<div className={styles.inputBox}>
																										<Input
																											placeholder="Type here"
																											// disabled={!item.editable}
																											value={inp?.value}
																											setValue={val => {
																												setContactInput(prev => ({
																													...prev,
																													[item.hubspot_field]: prev[
																														item.hubspot_field
																													]?.map((i, k) => {
																														if (k === key) {
																															return {
																																...i,
																																value: val,
																															};
																														} else {
																															return i;
																														}
																													}),
																												}));
																											}}
																											name={item.hubspot_field}
																											className={`${styles.inputSelect} ${
																												!item.editable && styles.disabled
																											}`}
																										/>
																									</div>
																									<div className={styles.selectBox}>
																										<Select
																											placeholder={"Select here"}
																											borderRadius={"0 15px 15px 0"}
																											options={
																												item?.input_type === "phone"
																													? PHONE_OPTIONS
																													: EMAIL_OPTIONS
																											}
																											value={inp.label}
																											disabled={!item.editable}
																											onChange={selected => {
																												setContactInput(prev => ({
																													...prev,
																													[item.hubspot_field]: prev[
																														item.hubspot_field
																													]?.map((i, k) => {
																														if (k === key) {
																															return {
																																...i,
																																label: selected?.value,
																															};
																														} else {
																															return i;
																														}
																													}),
																												}));
																											}}
																										></Select>
																									</div>
																									{contactInput[item.hubspot_field]
																										.length > 1 && (
																										<div
																											className={styles.delete}
																											onClick={() =>
																												item.editable &&
																												handleDelete(item, key)
																											}
																										>
																											<Delete
																												color={Colors.veryLightBlue}
																												size="1.4rem"
																											/>
																										</div>
																									)}
																								</div>
																							);
																						}
																				  )}

																			<div className={styles.addMore}>
																				<ThemedButton
																					theme={ThemedButtonThemes.TRANSPARENT}
																					width={"14%"}
																					disabled={!item.editable}
																					className={styles.button}
																					onClick={() => handleAdd(item)}
																				>
																					<Plus />
																					Add one more
																				</ThemedButton>
																			</div>
																		</div>
																	</>
																)} */}
																{/* {item.type === "dropdown" && item.reference_to && (
																	<>
																		<Label>{item.hubspot_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.hubspot_endpoint === VIEWS.CONTACT
																					? contactInput
																					: companyInput
																			}
																			setValue={
																				item.hubspot_endpoint === VIEWS.CONTACT
																					? setContactInput
																					: setCompanyInput
																			}
																			isLoading={
																				searchItem?.hubspot_field ===
																					item?.hubspot_field &&
																				fetchReferenceFieldOptionsLoading
																			}
																			name={item.hubspot_field}
																			icon={<Search color={Colors.lightBlue} />}
																			iconIsRotatable={false}
																			disabled={!item.editable}
																			background={!item.editable && "rgb(250, 246, 246)"}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={
																				Array.isArray(
																					references[item.hubspot_endpoint]?.[item.hubspot_field]
																				)
																					? references[item.hubspot_endpoint]?.[
																							item.hubspot_field
																					  ]?.map(obj => ({
																							label: obj[item.reference_field_name.name],
																							value: obj.Id,
																					  }))
																					: Object.keys(fields[item.hubspot_endpoint]).length !==
																							0 &&
																					  fields[item.hubspot_endpoint][item.hubspot_field] !=
																							null && [
																							{
																								label:
																									fields[item.hubspot_endpoint][
																										item.hubspot_field
																									][item.reference_field_name?.name],
																								value:
																									fields[item.hubspot_endpoint][
																										item.hubspot_field
																									].id,
																							},
																					  ]
																			}
																			onFocus={() => {
																				setInputChange(
																					fields[item.hubspot_endpoint][item.hubspot_field]
																						? fields[item.hubspot_endpoint]?.[
																								item.hubspot_field
																						  ]?.[item.reference_field_name?.name]?.[0]
																						: "a"
																				);
																				setSearchItem(item);
																			}}
																			onInputChange={input =>
																				input
																					? setInputChange(input)
																					: setInputChange(
																							fields[item.hubspot_endpoint][item.hubspot_field]
																								? fields[item.hubspot_endpoint]?.[
																										item.hubspot_field
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
																)} */}
																{item.type === "multi_select_dropdown" && (
																	<>
																		<Label>{item.hubspot_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			disabled={!item.editable}
																			value={
																				item.hubspot_endpoint === VIEWS.CONTACT
																					? contactInput
																					: companyInput
																			}
																			setValue={
																				item.hubspot_endpoint === VIEWS.CONTACT
																					? setContactInput
																					: setCompanyInput
																			}
																			name={item.hubspot_field}
																			height="auto"
																			menuOnTop={row === maxRow ? true : false}
																			className={`${!item.editable && styles.disabled}`}
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
																	<div className={`${styles.radioBox}`}>
																		<div className={styles.label}>
																			{item.hubspot_label}?
																		</div>
																		<div className={`${styles.btnBox}`}>
																			{item?.possible_values?.map(i => (
																				<div className={styles.btn}>
																					<InputRadio
																						className={styles.radio}
																						size="24"
																						disabled={!item.editable}
																						value={
																							item.hubspot_endpoint === VIEWS.CONTACT
																								? contactInput[item.hubspot_field]
																								: companyInput[item.hubspot_field]
																						}
																						checked={
																							item.hubspot_endpoint === VIEWS.CONTACT
																								? contactInput[item.hubspot_field] ===
																								  i?.value
																									? true
																									: false
																								: companyInput[item.hubspot_field] ===
																								  i?.value
																								? true
																								: false
																						}
																						onChange={() => {
																							if (
																								item.hubspot_endpoint === VIEWS.CONTACT
																							) {
																								setContactInput(prev => ({
																									...prev,
																									[item.hubspot_field]: i?.value,
																								}));
																							} else {
																								setCompanyInput(prev => ({
																									...prev,
																									[item.hubspot_field]: i?.value,
																								}));
																							}
																						}}
																					/>
																					<div className={styles.btnLabel}>
																						{i?.label}
																					</div>
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
