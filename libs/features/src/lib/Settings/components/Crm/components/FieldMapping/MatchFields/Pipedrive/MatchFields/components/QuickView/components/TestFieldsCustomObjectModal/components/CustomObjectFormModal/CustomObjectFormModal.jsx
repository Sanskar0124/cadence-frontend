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
	const [personInput, setPersonInput] = useState({});
	const [organizationInput, setOrganizationInput] = useState({});

	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const { customObj, loading, setTest, setTestLoading } = useCustomObject(true);
	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.pipedrive_endpoint][item.pipedrive_field];
				// if (item.type === "multi_select_dropdown") {
				// 	// if (item.pipedrive_endpoint === VIEWS.LEAD) {
				// 	// 	setLeadInput(prev => ({
				// 	// 		...prev,
				// 	// 		[item.salesforce_field]: value != null ? value.split(";") : [],
				// 	// 	}));
				// 	// } else
				// 	if (item.pipedrive_endpoint === VIEWS.PERSON) {
				// 		setPersonInput(prev => ({
				// 			...prev,
				// 			[item.pipedrive_field]: value != null ? value.split(";") : [],
				// 		}));
				// 	} else {
				// 		setOrganizationInput(prev => ({
				// 			...prev,
				// 			[item.pipedrive_field]: value != null ? value.split(";") : [],
				// 		}));
				// 	}
				// } else
				if (item.type === "input_box") {
					const type = item.input_type;
					// if (type === "date") {
					// 	if (item.pipedrive_endpoint === VIEWS.PERSON) {
					// 		setPersonInput(prev => ({
					// 			...prev,
					// 			[item.pipedrive_field]:
					// 				value != null
					// 					? {
					// 							DD: value.split("-")[2],
					// 							MM: value.split("-")[1],
					// 							YYYY: value.split("-")[0],
					// 					  }
					// 					: {
					// 							DD: "dd",
					// 					  },
					// 		}));
					// 	} else {
					// 		setOrganizationInput(prev => ({
					// 			...prev,
					// 			[item.pipedrive_field]:
					// 				value != null
					// 					? {
					// 							DD: value.split("-")[2],
					// 							MM: value.split("-")[1],
					// 							YYYY: value.split("-")[0],
					// 					  }
					// 					: {
					// 							DD: "dd",
					// 					  },
					// 		}));
					// 	}
					// }
					//else
					if (type === "date") {
						// if (item.pipedrive_endpoint === VIEWS.LEAD) {
						// 	setLeadInput(prev => ({
						// 		...prev,
						// 		[item.salesforce_field]:
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
						if (item.pipedrive_endpoint === VIEWS.PERSON) {
							setPersonInput(prev => ({
								...prev,
								[item.pipedrive_field]:
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
							setOrganizationInput(prev => ({
								...prev,
								[item.pipedrive_field]:
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
						// if (item.pipedrive_endpoint === VIEWS.LEAD) {
						// 	setLeadInput(prev => ({
						// 		...prev,
						// 		[item.salesforce_field]: value !== null ? value : "",
						// 	}));
						// } else
						if (item.pipedrive_endpoint === VIEWS.PERSON) {
							setPersonInput(prev => ({
								...prev,
								[item.pipedrive_field]: value !== null ? value : "",
							}));
						} else {
							setOrganizationInput(prev => ({
								...prev,
								[item.pipedrive_field]: value !== null ? value : "",
							}));
						}
					}
				} else if (item.type === "input_select") {
					if (item.pipedrive_endpoint === VIEWS.PERSON) {
						setPersonInput(prev => ({
							...prev,
							[item.pipedrive_field]:
								value !== null
									? value
									: [
											{
												label: "home",
												value: "",
											},
									  ],
						}));
					} else {
						setOrganizationInput(prev => ({
							...prev,
							[item.pipedrive_field]:
								value !== null
									? value
									: [
											{
												label: "home",
												value: "",
											},
									  ],
						}));
					}
				}
				//  else if (item.type === "dropdown" && item.reference_field_name) {
				// 	// if (item.pipedrive_endpoint === VIEWS.LEAD) {
				// 	// 	setLeadInput(prev => ({
				// 	// 		...prev,
				// 	// 		[item.salesforce_field]: value != null ? value.id : "",
				// 	// 	}));
				// 	// } else
				// 	if (item.pipedrive_endpoint === VIEWS.PERSON) {
				// 		setPersonInput(prev => ({
				// 			...prev,
				// 			[item.pipedrive_field]: value != null ? value.id : "",
				// 		}));
				// 	} else {
				// 		setOrganizationInput(prev => ({
				// 			...prev,
				// 			[item.pipedrive_field]: value != null ? value.id : "",
				// 		}));
				// 	}
				// }
				else {
					// if (item.pipedrive_endpoint === VIEWS.LEAD) {
					// 	setLeadInput(prev => ({
					// 		...prev,
					// 		[item.salesforce_field]: value !== null ? value : "",
					// 	}));
					// } else
					if (item.pipedrive_endpoint === VIEWS.PERSON) {
						setPersonInput(prev => ({
							...prev,
							[item.pipedrive_field]: value !== null ? value : "",
						}));
					} else {
						setOrganizationInput(prev => ({
							...prev,
							[item.pipedrive_field]: value !== null ? value : "",
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
		if (customObj?.person_custom_object != null) {
			setForm(customObj?.person_custom_object[0].form);
			setButtonText(customObj?.person_custom_object[0].button_text);
		} else {
			setForm([]);
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
		// }

		setPersonInput({});
		setOrganizationInput({});
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
			// case "textarea":
			// 	return (
			// 		<>
			// 			<Label>{item.pipedrive_label}</Label>
			// 			<Input
			// 				placeholder="Type here"
			// 				type="textarea"
			// 				height="70px"
			// 				value={
			// 					item.pipedrive_endpoint === VIEWS.PERSON ? personInput : organizationInput
			// 				}
			// 				disabled={!item.editable}
			// 				className={`${!item.editable && styles.disabled}`}
			// 				setValue={
			// 					item.pipedrive_endpoint === VIEWS.PERSON
			// 						? setPersonInput
			// 						: setOrganizationInput
			// 				}
			// 				name={item.pipedrive_field}
			// 			/>
			// 		</>
			// 	);
			// case "date":
			// 	return (
			// 		<>
			// 			<Label>{item.pipedrive_label}</Label>
			// 			<Input
			// 				placeholder="Select Date"
			// 				type="date"
			// 				left={item.position.column === 2 && count === 3}
			// 				value={
			// 					item.pipedrive_endpoint === VIEWS.PERSON ? personInput : organizationInput
			// 				}
			// 				className={`${!item.editable && styles.disabled}`}
			// 				disabled={!item.editable}
			// 				setValue={
			// 					item.pipedrive_endpoint === VIEWS.PERSON
			// 						? setPersonInput
			// 						: setOrganizationInput
			// 				}
			// 				top={row > maxRow / 2 && maxRow / 2 >= 5}
			// 				name={item.pipedrive_field}
			// 			/>
			// 		</>
			// 	);
			case "int":
				return (
					<>
						<Label>{item.pipedrive_label}</Label>
						<Input
							type={"number"}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.pipedrive_endpoint === VIEWS.PERSON ? personInput : organizationInput
							}
							setValue={
								item.pipedrive_endpoint === VIEWS.PERSON
									? setPersonInput
									: setOrganizationInput
							}
							name={item.pipedrive_field}
							className={`${styles.intInput} ${!item.editable && styles.disabled}`}
						/>
					</>
				);
			case "double":
				return (
					<>
						<Label>{item.pipedrive_label}</Label>
						<Input
							type={"number"}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.pipedrive_endpoint === VIEWS.PERSON ? personInput : organizationInput
							}
							setValue={
								item.pipedrive_endpoint === VIEWS.PERSON
									? setPersonInput
									: setOrganizationInput
							}
							name={item.pipedrive_field}
							className={`${styles.intInput} ${!item.editable && styles.disabled}`}
						/>
					</>
				);
			case "date":
				return (
					<>
						<Label>{item.pipedrive_label}</Label>
						<Input
							placeholder={"Select Date and Time"}
							type="datetime"
							left={item.position.column === 2 && count === 3}
							value={
								item.pipedrive_endpoint === VIEWS.PERSON ? personInput : organizationInput
							}
							disabled={!item.editable}
							setValue={
								item.pipedrive_endpoint === VIEWS.PERSON
									? setPersonInput
									: setOrganizationInput
							}
							name={item.pipedrive_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.pipedrive_label}</Label>
						<Input
							type={type}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.pipedrive_endpoint === VIEWS.PERSON ? personInput : organizationInput
							}
							setValue={
								item.pipedrive_endpoint === VIEWS.PERSON
									? setPersonInput
									: setOrganizationInput
							}
							name={item.pipedrive_field}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);
		}
	};

	// const handleInputChange = (input, item) => {
	// 	let body = {
	// 		pipedrive_endpoint: item.reference_field_name.pipedrive_endpoint,
	// 		search_term: input.length === 0 ? "a" : input,
	// 		reference_field_name: item.reference_field_name.name,
	// 	};
	// 	fetchReferenceFieldOptions(body, {
	// 		onSuccess: data => {
	// 			setReferences(prev => ({
	// 				...prev,
	// 				[item.pipedrive_endpoint]: {
	// 					...prev[item.pipedrive_endpoint],
	// 					[item.pipedrive_field]: data.records,
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

		let personInp = JSON.parse(JSON.stringify(personInput));

		let organizationInp = JSON.parse(JSON.stringify(organizationInput));
		delete organizationInp.Id;

		form.forEach(item => {
			let value;
			// if (item.pipedrive_endpoint === VIEWS.LEAD) {
			// 	value = leadInp[item.salesforce_field];
			// } else
			if (item.pipedrive_endpoint === VIEWS.PERSON) {
				value = personInp[item.pipedrive_field];
			} else {
				value = organizationInp[item.pipedrive_field];
			}

			// if (item.type === "multi_select_dropdown") {
			// 	// if (item.pipedrive_endpoint === VIEWS.LEAD) {
			// 	// 	leadInp[item.salesforce_field] = value.length === 0 ? null : value.join(";");
			// 	// } else
			// 	if (item.pipedrive_endpoint === VIEWS.PERSON) {
			// 		personInp[item.pipedrive_field] = value.length === 0 ? null : value.join(";");
			// 	} else {
			// 		organizationInp[item.pipedrive_field] =
			// 			value.length === 0 ? null : value.join(";");
			// 	}
			// } else
			if (item.type === "input_box") {
				const type = item.input_type;
				// if (type === "date") {
				// 	// if (item.pipedrive_endpoint === VIEWS.LEAD) {
				// 	// 	leadInp[item.salesforce_field] =
				// 	// 		value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
				// 	// } else
				// 	if (item.pipedrive_endpoint === VIEWS.PERSON) {
				// 		personInp[item.pipedrive_field] =
				// 			value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
				// 	} else {
				// 		organizationInp[item.pipedrive_field] =
				// 			value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
				// 	}
				// }
				//else
				if (type === "date") {
					// if (item.pipedrive_endpoint === VIEWS.LEAD) {
					// 	leadInp[item.salesforce_field] =
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
					if (item.pipedrive_endpoint === VIEWS.PERSON) {
						personInp[item.pipedrive_field] =
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
						organizationInp[item.pipedrive_field] =
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
					// if (item.pipedrive_endpoint === VIEWS.LEAD) {
					// 	leadInp[item.salesforce_field] = value === "" ? null : value;
					// } else
					if (item.pipedrive_endpoint === VIEWS.PERSON) {
						personInp[item.pipedrive_field] = value === "" ? null : value;
					} else {
						organizationInp[item.pipedrive_field] = value === "" ? null : value;
					}
				}
			} else if (item.type === "input_select") {
				if (item.pipedrive_endpoint === VIEWS.PERSON) {
					personInp[item.pipedrive_field] = value;
				} else {
					organizationInp[item.pipedrive_field] = value;
				}
			} else {
				// if (item.pipedrive_endpoint === VIEWS.LEAD) {
				// 	leadInp[item.salesforce_field] =
				// 		value === "" || value === undefined ? null : value;
				// } else
				if (item.pipedrive_endpoint === VIEWS.PERSON) {
					personInp[item.pipedrive_field] =
						value === "" || value === undefined ? null : value;
				} else {
					organizationInp[item.pipedrive_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});

		// if (buildFormFor === VIEWS.LEAD) {
		// 	form.forEach(item => {
		// 		if (item.editable === false) {
		// 			delete leadInp[item.salesforce_field];
		// 		}
		// 	});
		// 	body = {
		// 		type: VIEWS.LEAD,
		// 		id: fields[VIEWS.LEAD].Id,
		// 		custom_object: leadInp,
		// 	};
		// } else
		if (Object.keys(organizationInput).length === 0) {
			form.forEach(item => {
				if (item.editable === false) {
					delete personInp[item.pipedrive_field];
				}
			});
			body = {
				person_id: fields[VIEWS.PERSON].id.toString(),
				person_object: personInp,
			};
		} else if (Object.keys(personInput).length === 0) {
			form.forEach(item => {
				if (item.editable === false) {
					delete organizationInp[item.pipedrive_field];
				}
			});
			body = {
				organization_id: fields[VIEWS.ORGANIZATION]?.owner_id.toString(),
				organization_object: organizationInp,
			};
		} else {
			form.forEach(item => {
				if (item.editable === false) {
					if (item.pipedrive_endpoint === VIEWS.PERSON)
						delete personInp[item.pipedrive_field];
					else delete organizationInp[item.pipedrive_field];
				}
			});
			body = {
				person_id: fields[VIEWS.PERSON].id.toString(),
				person_object: personInp,
				organization_object: organizationInp,
				organization_id: fields[VIEWS.ORGANIZATION]?.id.toString(),
			};
		}

		setTest(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${VIEWS.PERSON} in pipedrive`);
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
		if (item?.pipedrive_endpoint === VIEWS.PERSON) {
			setPersonInput(prev => ({
				...prev,
				[item?.pipedrive_field]: prev[item.pipedrive_field]?.filter((i, k) => k !== key),
			}));
		} else {
			setOrganizationInput(prev => ({
				...prev,
				[item?.pipedrive_field]: prev[item.pipedrive_field]?.filter((i, k) => k !== key),
			}));
		}
	};
	const handleAdd = item => {
		if (item?.pipedrive_endpoint === VIEWS.PERSON) {
			setPersonInput(prev => ({
				...prev,
				[item?.pipedrive_field]: [
					...prev[item.pipedrive_field],
					{
						label: "home",
						value: "",
					},
				],
			}));
		} else {
			setOrganizationInput(prev => ({
				...prev,
				[item?.pipedrive_field]: [
					...prev[item.pipedrive_field],
					{
						label: "home",
						value: "",
					},
				],
			}));
		}
	};

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
																		<Label>{item.pipedrive_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.pipedrive_endpoint === VIEWS.PERSON
																					? personInput
																					: organizationInput
																			}
																			setValue={
																				item.pipedrive_endpoint === VIEWS.PERSON
																					? setPersonInput
																					: setOrganizationInput
																			}
																			name={item.pipedrive_field}
																			disabled={!item.editable}
																			className={`${!item.editable && styles.disabled}`}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={item.possible_values.map(item => ({
																				label: item.label,
																				value: item.id,
																			}))}
																		></Select>
																	</>
																)}
																{item.type === "input_select" && (
																	<>
																		<Label>{item.pipedrive_label}</Label>

																		<div className={styles.inputSelectBox}>
																			{item.pipedrive_endpoint === VIEWS.PERSON
																				? personInput[item.pipedrive_field]?.map(
																						(inp, key) => {
																							return (
																								<div className={styles.current}>
																									<div className={styles.inputBox}>
																										<Input
																											placeholder="Type here"
																											// disabled={!item.editable}
																											value={inp?.value}
																											setValue={val => {
																												setPersonInput(prev => ({
																													...prev,
																													[item.pipedrive_field]: prev[
																														item.pipedrive_field
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
																											name={item.pipedrive_field}
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
																												setPersonInput(prev => ({
																													...prev,
																													[item.pipedrive_field]: prev[
																														item.pipedrive_field
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
																									{personInput[item.pipedrive_field]
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
																				: organizationInput[item.pipedrive_field]?.map(
																						(inp, key) => {
																							return (
																								<div className={styles.current}>
																									<div className={styles.inputBox}>
																										<Input
																											placeholder="Type here"
																											// disabled={!item.editable}
																											value={inp?.value}
																											setValue={val => {
																												setPersonInput(prev => ({
																													...prev,
																													[item.pipedrive_field]: prev[
																														item.pipedrive_field
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
																											name={item.pipedrive_field}
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
																												setPersonInput(prev => ({
																													...prev,
																													[item.pipedrive_field]: prev[
																														item.pipedrive_field
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
																									{personInput[item.pipedrive_field]
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
																)}
																{/* {item.type === "dropdown" && item.reference_to && (
																	<>
																		<Label>{item.pipedrive_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.pipedrive_endpoint === VIEWS.PERSON
																					? personInput
																					: organizationInput
																			}
																			setValue={
																				item.pipedrive_endpoint === VIEWS.PERSON
																					? setPersonInput
																					: setOrganizationInput
																			}
																			isLoading={
																				searchItem?.pipedrive_field ===
																					item?.pipedrive_field &&
																				fetchReferenceFieldOptionsLoading
																			}
																			name={item.pipedrive_field}
																			icon={<Search color={Colors.lightBlue} />}
																			iconIsRotatable={false}
																			disabled={!item.editable}
																			background={!item.editable && "rgb(250, 246, 246)"}
																			menuOnTop={row === maxRow ? true : false}
																			numberOfOptionsVisible="3"
																			options={
																				Array.isArray(
																					references[item.pipedrive_endpoint]?.[item.pipedrive_field]
																				)
																					? references[item.pipedrive_endpoint]?.[
																							item.pipedrive_field
																					  ]?.map(obj => ({
																							label: obj[item.reference_field_name.name],
																							value: obj.Id,
																					  }))
																					: Object.keys(fields[item.pipedrive_endpoint]).length !==
																							0 &&
																					  fields[item.pipedrive_endpoint][item.pipedrive_field] !=
																							null && [
																							{
																								label:
																									fields[item.pipedrive_endpoint][
																										item.pipedrive_field
																									][item.reference_field_name?.name],
																								value:
																									fields[item.pipedrive_endpoint][
																										item.pipedrive_field
																									].id,
																							},
																					  ]
																			}
																			onFocus={() => {
																				setInputChange(
																					fields[item.pipedrive_endpoint][item.pipedrive_field]
																						? fields[item.pipedrive_endpoint]?.[
																								item.pipedrive_field
																						  ]?.[item.reference_field_name?.name]?.[0]
																						: "a"
																				);
																				setSearchItem(item);
																			}}
																			onInputChange={input =>
																				input
																					? setInputChange(input)
																					: setInputChange(
																							fields[item.pipedrive_endpoint][item.pipedrive_field]
																								? fields[item.pipedrive_endpoint]?.[
																										item.pipedrive_field
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
																{/* {item.type === "multi_select_dropdown" && (
																	<>
																		<Label>{item.pipedrive_label}</Label>
																		<Select
																			placeholder={"Select here"}
																			disabled={!item.editable}
																			value={
																				item.pipedrive_endpoint === VIEWS.PERSON
																					? personInput
																					: organizationInput
																			}
																			setValue={
																				item.pipedrive_endpoint === VIEWS.PERSON
																					? setPersonInput
																					: setOrganizationInput
																			}
																			name={item.pipedrive_field}
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
																			{item.pipedrive_label}?
																		</div>
																		<div className={`${styles.btnBox}`}>
																			<div className={styles.btn}>
																				<InputRadio
																					className={styles.radio}
																					size="24"
																					disabled={!item.editable}
																					value={
																						item.pipedrive_endpoint === VIEWS.PERSON
																							? personInput[item.pipedrive_field]
																							: organizationInput[item.pipedrive_field]
																					}
																					checked={
																						item.pipedrive_endpoint === VIEWS.PERSON
																							? personInput[item.pipedrive_field] !== ""
																								? personInput[item.pipedrive_field]
																								: false
																							: organizationInput[
																									item.pipedrive_field
																							  ] !== ""
																							? organizationInput[item.pipedrive_field]
																							: false
																					}
																					onChange={() => {
																						if (
																							item.pipedrive_endpoint === VIEWS.PERSON
																						) {
																							setPersonInput(prev => ({
																								...prev,
																								[item.pipedrive_field]:
																									!personInput[item.pipedrive_field],
																							}));
																						} else {
																							setOrganizationInput(prev => ({
																								...prev,
																								[item.pipedrive_field]:
																									!organizationInput[
																										item.pipedrive_field
																									],
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
																						item.pipedrive_endpoint === VIEWS.PERSON
																							? personInput[item.pipedrive_field] !== ""
																								? !personInput[item.pipedrive_field]
																								: false
																							: organizationInput[
																									item.pipedrive_field
																							  ] !== ""
																							? !organizationInput[item.pipedrive_field]
																							: false
																					}
																					value={
																						item.pipedrive_endpoint === VIEWS.PERSON
																							? !personInput[item.pipedrive_field]
																							: !organizationInput[item.pipedrive_field]
																					}
																					onChange={() => {
																						// if (item.pipedrive_endpoint === VIEWS.LEAD) {
																						// 	setLeadInput(prev => ({
																						// 		...prev,
																						// 		[item.pipedrive_field]:
																						// 			!leadInput[item.salesforce_field],
																						// 	}));
																						// } else
																						if (
																							item.pipedrive_endpoint === VIEWS.PERSON
																						) {
																							setPersonInput(prev => ({
																								...prev,
																								[item.pipedrive_field]:
																									!personInput[item.pipedrive_field],
																							}));
																						} else {
																							setOrganizationInput(prev => ({
																								...prev,
																								[item.pipedrive_field]:
																									!organizationInput[
																										item.pipedrive_field
																									],
																							}));
																						}
																					}}
																				/>
																				<div className={styles.btnLabel}>No</div>
																			</div>
																		</div>
																	</div>
																)} */}
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
