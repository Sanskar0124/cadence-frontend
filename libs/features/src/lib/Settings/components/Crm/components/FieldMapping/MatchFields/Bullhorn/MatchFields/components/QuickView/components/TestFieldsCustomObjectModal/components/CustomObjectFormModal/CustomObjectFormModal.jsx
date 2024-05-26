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
import { Search } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Colors, capitalize } from "@cadence-frontend/utils";

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
	const [candidateInput, setCandidateInput] = useState({});
	const [inputChange, setInputChange] = useState();
	const [searchItem, setSearchItem] = useState();
	const user = useRecoilValue(userInfo);
	const [references, setReferences] = useState(REFERENCES);
	const { addError, addSuccess } = useContext(MessageContext);
	const [ownerKeys, setOwnerKey] = useState([]);
	const {
		customObj,
		loading,
		setTest,
		setTestLoading,
		fetchReferenceFieldOptions,
		fetchReferenceFieldOptionsLoading,
	} = useCustomObject(true);

	const convertMilisecToNormalDate = value => {
		if (value) {
			const date = new Date(value);

			let DD = date.getDate();
			let MM = date.getMonth();
			let YYYY = date.getFullYear();

			return {
				DD: DD,
				MM: MM,
				YYYY: YYYY,
			};
		}
	};

	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value =
					fields[
						item?.bullhorn_endpoint === "clientContact"
							? "contact"
							: item?.bullhorn_endpoint === "clientCorporation"
							? "account"
							: item?.bullhorn_endpoint
					][item?.bullhorn_field];

				if (item.type === "multi_select_dropdown") {
					if (item.bullhorn_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.join().split(";") : [],
						}));
					} else if (item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.join().split(";") : [],
						}));
					} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
						setCandidateInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.join().split(";") : [],
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.join().split(";") : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;
					if (type === "DATE") {
						if (item.bullhorn_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.bullhorn_field]:
									value != null
										? Number.isInteger(value) && value > 0
											? convertMilisecToNormalDate(value)
											: {
													DD: value.split("-")[2],
													MM: value.split("-")[1],
													YYYY: value.split("-")[0],
											  }
										: {
												DD: "dd",
										  },
							}));
						} else if (
							item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT ||
							item.bullhorn_endpoint === VIEWS.CONTACT
						) {
							setContactInput(prev => ({
								...prev,
								[item.bullhorn_field]:
									value != null
										? Number.isInteger(value) && value > 0
											? convertMilisecToNormalDate(value)
											: {
													DD: value.split("-")[2],
													MM: value.split("-")[1],
													YYYY: value.split("-")[0],
											  }
										: {
												DD: "dd",
										  },
							}));
						} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
							setCandidateInput(prev => ({
								...prev,
								[item.bullhorn_field]:
									value != null
										? Number.isInteger(value) && value > 0
											? convertMilisecToNormalDate(value)
											: {
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
								[item.bullhorn_field]:
									value != null
										? Number.isInteger(value) && value > 0
											? convertMilisecToNormalDate(value)
											: {
													DD: value.split("-")[2],
													MM: value.split("-")[1],
													YYYY: value.split("-")[0],
											  }
										: {
												DD: "dd",
										  },
							}));
						}
					} else if (type === "DATETIME") {
						if (item.bullhorn_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.bullhorn_field]:
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
						} else if (
							item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT ||
							item.bullhorn_endpoint === VIEWS.CONTACT
						) {
							setContactInput(prev => ({
								...prev,
								[item.bullhorn_field]:
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
						} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
							setCandidateInput(prev => ({
								...prev,
								[item.bullhorn_field]:
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
								[item.bullhorn_field]:
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
						if (item.bullhorn_endpoint === VIEWS.LEAD) {
							setLeadInput(prev => ({
								...prev,
								[item.bullhorn_field]: value !== null ? value : "",
							}));
						} else if (
							item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT ||
							item.bullhorn_endpoint === VIEWS.CONTACT
						) {
							setContactInput(prev => ({
								...prev,
								[item.bullhorn_field]: value !== null ? value : "",
							}));
						} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
							setCandidateInput(prev => ({
								...prev,
								[item.bullhorn_field]: value !== null ? value : "",
							}));
						} else {
							setAccountInput(prev => ({
								...prev,
								[item.bullhorn_field]: value !== null ? value : "",
							}));
						}
					}
				} else if (item.type === "dropdown" && item.reference_field_name) {
					if (item.bullhorn_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.id : "",
						}));
					} else if (
						item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT ||
						item.bullhorn_endpoint === VIEWS.CONTACT
					) {
						setContactInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.id : "",
						}));
					} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
						setCandidateInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.id : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.bullhorn_field]: value != null ? value.id : "",
						}));
					}
				} else {
					if (item.bullhorn_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.bullhorn_field]: value !== null ? value : "",
						}));
					} else if (
						item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT ||
						item.bullhorn_endpoint === VIEWS.CONTACT
					) {
						setContactInput(prev => ({
							...prev,
							[item.bullhorn_field]: value !== null ? value : "",
						}));
					} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
						setCandidateInput(prev => ({
							...prev,
							[item.bullhorn_field]: value !== null ? value : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.bullhorn_field]: value !== null ? value : "",
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
		} else if (buildFormFor === "contact") {
			if (customObj?.contact_custom_object != null) {
				setForm(customObj?.contact_custom_object[0].form);
				setButtonText(customObj?.contact_custom_object[0].button_text);
			} else {
				setForm([]);
				setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
			}
		} else {
			if (customObj?.candidate_custom_object != null) {
				setForm(customObj?.candidate_custom_object[0].form);
				setButtonText(customObj?.candidate_custom_object[0].button_text);
			} else {
				setForm([]);
				setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
			}
		}

		setLeadInput({});
		setContactInput({});
		setAccountInput({});
		setCandidateInput({});
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
						<Label>{item.bullhorn_label}</Label>
						<Input
							placeholder="Type here"
							type="textarea"
							height="70px"
							value={
								item.bullhorn_endpoint === VIEWS.LEAD
									? leadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? contactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? candidateInput
									: accountInput
							}
							disabled={item.editable}
							className={`${item.editable && styles.disabled}`}
							setValue={
								item.bullhorn_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? setContactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? setCandidateInput
									: setAccountInput
							}
							name={item.bullhorn_field}
						/>
					</>
				);
			case "DATE":
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={
								item.bullhorn_endpoint === VIEWS.LEAD
									? leadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? contactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? candidateInput
									: accountInput
							}
							className={`${item.editable && styles.disabled}`}
							disabled={item.editable}
							setValue={
								item.bullhorn_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? setContactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? setCandidateInput
									: setAccountInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.bullhorn_field}
						/>
					</>
				);
			case "DATETIME":
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input
							placeholder={"Select Date and Time"}
							type="datetime"
							left={item.position.column === 2 && count === 3}
							value={
								item.bullhorn_endpoint === VIEWS.LEAD
									? leadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? contactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? candidateInput
									: accountInput
							}
							disabled={item.editable}
							setValue={
								item.bullhorn_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? setContactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? setCandidateInput
									: setAccountInput
							}
							name={item.bullhorn_field}
							className={`${item.editable && styles.disabled}`}
						/>
					</>
				);

			default:
				return (
					<>
						<Label>{item.bullhorn_label}</Label>
						<Input
							type={type}
							disabled={item.editable}
							placeholder="Type here"
							value={
								item.bullhorn_endpoint === VIEWS.LEAD
									? leadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? contactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? candidateInput
									: accountInput
							}
							setValue={
								item.bullhorn_endpoint === VIEWS.LEAD
									? setLeadInput
									: item.bullhorn_endpoint === VIEWS.CONTACT ||
									  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
									? setContactInput
									: item.bullhorn_endpoint === VIEWS.CANDIDATE
									? setCandidateInput
									: setAccountInput
							}
							name={item.bullhorn_field}
							className={`${item.editable && styles.disabled}`}
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
					[item.bullhorn_endpoint]: {
						...prev[item.bullhorn_endpoint],
						[item.bullhorn_field]: data.records,
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
		let candidateInp = JSON.parse(JSON.stringify(candidateInput));

		form.forEach(item => {
			let value;
			if (item.bullhorn_endpoint === VIEWS.LEAD) {
				value = leadInp[item.bullhorn_field];
			} else if (
				item.bullhorn_endpoint === VIEWS.CONTACT ||
				item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
			) {
				value = contactInp[item.bullhorn_field];
			} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
				value = candidateInp[item.bullhorn_field];
			} else {
				value = accountInp[item.bullhorn_field];
			}

			if (item.type === "multi_select_dropdown") {
				if (item.bullhorn_endpoint === VIEWS.LEAD) {
					leadInp[item.bullhorn_field] = value.length === 0 ? null : value.join(";");
				} else if (
					item.bullhorn_endpoint === VIEWS.CONTACT ||
					item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
				) {
					contactInp[item.bullhorn_field] = value.length === 0 ? null : value.join(";");
				} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
					candidateInp[item.bullhorn_field] = value.length === 0 ? null : value.join(";");
				} else {
					accountInp[item.bullhorn_field] = value.length === 0 ? null : value.join(";");
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "DATE") {
					if (item.bullhorn_endpoint === VIEWS.LEAD) {
						let date = `${value.YYYY}-${value.MM}-${value.DD}`;
						leadInp[item.bullhorn_field] =
							value.DD !== "dd" ? new Date(date).valueOf() : null;
					} else if (
						item.bullhorn_endpoint === VIEWS.CONTACT ||
						item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
					) {
						let date = `${value.YYYY}-${value.MM}-${value.DD}`;
						contactInp[item.bullhorn_field] =
							value.DD !== "dd" ? new Date(date).valueOf() : null;
					} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
						let date = `${value.YYYY}-${value.MM}-${value.DD}`;
						candidateInp[item.bullhorn_field] =
							value.DD !== "dd" ? new Date(date).valueOf() : null;
					} else {
						let date = `${value.YYYY}-${value.MM}-${value.DD}`;

						accountInp[item.bullhorn_field] =
							value.DD !== "dd" ? new Date(date).valueOf() : null;
					}
				} else if (type === "DATETIME") {
					if (item.bullhorn_endpoint === VIEWS.LEAD) {
						leadInp[item.bullhorn_field] =
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
					} else if (
						item.bullhorn_endpoint === VIEWS.CONTACT ||
						item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
					) {
						contactInp[item.bullhorn_field] =
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
					} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
						candidateInp[item.bullhorn_field] =
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
						accountInp[item.bullhorn_field] =
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
					if (item.bullhorn_endpoint === VIEWS.LEAD) {
						leadInp[item.bullhorn_field] = value === "" ? null : value;
					} else if (
						item.bullhorn_endpoint === VIEWS.CONTACT ||
						item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
					) {
						contactInp[item.bullhorn_field] = value === "" ? null : value;
					} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
						candidateInp[item.bullhorn_field] = value === "" ? null : value;
					} else {
						accountInp[item.bullhorn_field] = value === "" ? null : value;
					}
				}
			} else {
				if (item.bullhorn_endpoint === VIEWS.LEAD) {
					leadInp[item.bullhorn_field] =
						value === "" || value === undefined ? null : value;
				} else if (
					item.bullhorn_endpoint === VIEWS.CONTACT ||
					item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
				) {
					contactInp[item.bullhorn_field] =
						value === "" || value === undefined ? null : value;
				} else if (item.bullhorn_endpoint === VIEWS.CANDIDATE) {
					candidateInp[item.bullhorn_field] =
						value === "" || value === undefined ? null : value;
				} else {
					accountInp[item.bullhorn_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});

		if (buildFormFor === VIEWS.CANDIDATE) {
			form.forEach(item => {
				if (item.editable) {
					delete candidateInp[item.bullhorn_field];
				}
			});

			body = {
				type: VIEWS.CANDIDATE,
				id: fields[VIEWS.CANDIDATE].id + "",
				custom_object: candidateInp,
			};
		} else {
			if (buildFormFor === VIEWS.LEAD) {
				form.forEach(item => {
					if (item.editable) {
						if (item.bullhorn_endpoint === VIEWS.LEAD) {
							delete leadInp[item.bullhorn_field];
						} else {
							delete accountInp[item.bullhorn_field];
						}
					}
				});

				if (fields[VIEWS.LEAD]?.clientCorporation?.id) {
					body = {
						type: VIEWS.LEAD,
						id: fields[VIEWS.LEAD].id + "",
						custom_object: leadInp,
						custom_object_corporation: accountInp,
						bullhorn_corporation_id: fields[VIEWS.LEAD].clientCorporation.id + "",
					};
				} else {
					body = {
						type: VIEWS.LEAD,
						id: fields[VIEWS.LEAD].id + "",
						custom_object: leadInp,
					};
				}
			} else if (Object.keys(accountInput).length === 0) {
				form.forEach(item => {
					if (item.editable) {
						delete contactInp[item.bullhorn_field];
					}
				});
				body = {
					type: VIEWS.CLIENT_CONTACT,
					id: fields[VIEWS.CONTACT].id + "",
					custom_object: contactInp,
				};
			} else {
				form.forEach(item => {
					if (item.editable) {
						if (item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT)
							delete contactInp[item.bullhorn_field];
						else delete accountInp[item.bullhorn_field];
					}
				});
				body = {
					type: VIEWS.CLIENT_CONTACT,
					id: fields[VIEWS.CONTACT].id + "",
					custom_object: contactInp,
					custom_object_corporation: accountInp,
					bullhorn_corporation_id: fields[VIEWS.CONTACT].clientCorporation.id + "",
				};
			}
		}

		setTest(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${buildFormFor} in bullhorn.`);
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
			<div className={styles.headingText}>{capitalize(buttonText)}</div>

			<div className={`${styles.body}`}>
				{[...Array(maxRow + 1).keys()].map(
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
																	<Label>{item.bullhorn_label}</Label>
																	<Select
																		placeholder={"Select here"}
																		value={
																			item.bullhorn_endpoint === VIEWS.LEAD
																				? leadInput
																				: item.bullhorn_endpoint === VIEWS.CONTACT ||
																				  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
																				? contactInput
																				: item.bullhorn_endpoint === VIEWS.CANDIDATE
																				? candidateInput
																				: accountInput
																		}
																		setValue={
																			item.bullhorn_endpoint === VIEWS.LEAD
																				? setLeadInput
																				: item.bullhorn_endpoint === VIEWS.CONTACT ||
																				  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
																				? setContactInput
																				: item.bullhorn_endpoint === VIEWS.CANDIDATE
																				? setCandidateInput
																				: setAccountInput
																		}
																		name={item.bullhorn_field}
																		disabled={item.editable}
																		className={`${item.editable && styles.disabled}`}
																		menuOnTop={row === maxRow ? true : false}
																		numberOfOptionsVisible="3"
																		options={item.possible_values
																			?.filter(p => p.label && p.value)
																			.map(item => ({
																				label: item.label,
																				value: item.value,
																			}))}
																	></Select>
																</>
															)}
															{item.type === "dropdown" && item.reference_to && (
																<>
																	<Label>{item.bullhorn_label}</Label>
																	<Select
																		placeholder={"Select here"}
																		value={
																			item.bullhorn_endpoint === VIEWS.LEAD
																				? leadInput
																				: item.bullhorn_endpoint === VIEWS.CONTACT ||
																				  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
																				? contactInput
																				: item.bullhorn_endpoint === VIEWS.CANDIDATE
																				? candidateInput
																				: accountInput
																		}
																		setValue={
																			item.bullhorn_endpoint === VIEWS.LEAD
																				? setLeadInput
																				: item.bullhorn_endpoint === VIEWS.CONTACT ||
																				  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
																				? setContactInput
																				: item.bullhorn_endpoint === VIEWS.CANDIDATE
																				? setCandidateInput
																				: setAccountInput
																		}
																		isLoading={
																			searchItem?.bullhorn_field ===
																				item?.bullhorn_field &&
																			fetchReferenceFieldOptionsLoading
																		}
																		name={item.bullhorn_field}
																		icon={<Search color={Colors.lightBlue} />}
																		iconIsRotatable={false}
																		disabled={!item.editable}
																		background={!item.editable && "rgb(250, 246, 246)"}
																		menuOnTop={row === maxRow ? true : false}
																		numberOfOptionsVisible="3"
																		options={
																			Array.isArray(
																				references[item.bullhorn_endpoint]?.[
																					item.bullhorn_field
																				]
																			)
																				? references[item.bullhorn_endpoint]?.[
																						item.bullhorn_field
																				  ]?.map(obj => ({
																						label: obj[item.reference_field_name.name],
																						value: obj.Id,
																				  }))
																				: Object.keys(fields[item.bullhorn_endpoint])
																						.length !== 0 &&
																				  fields[item.bullhorn_endpoint][
																						item.bullhorn_field
																				  ] != null && [
																						{
																							label:
																								fields[item.bullhorn_endpoint][
																									item.bullhorn_field
																								][item.reference_field_name?.name],
																							value:
																								fields[item.bullhorn_endpoint][
																									item.bullhorn_field
																								].id,
																						},
																				  ]
																		}
																		onFocus={() => {
																			setInputChange(
																				fields[item.bullhorn_endpoint][
																					item.bullhorn_field
																				]
																					? fields[item.bullhorn_endpoint]?.[
																							item.bullhorn_field
																					  ]?.[item.reference_field_name?.name]?.[0]
																					: "a"
																			);
																			setSearchItem(item);
																		}}
																		onInputChange={input =>
																			input
																				? setInputChange(input)
																				: setInputChange(
																						fields[item.bullhorn_endpoint][
																							item.bullhorn_field
																						]
																							? fields[item.bullhorn_endpoint]?.[
																									item.bullhorn_field
																							  ]?.[item.reference_field_name?.name]?.[0]
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
																	<Label>{item.bullhorn_label}</Label>
																	<Select
																		placeholder={"Select here"}
																		disabled={item.editable}
																		value={
																			item.bullhorn_endpoint === VIEWS.LEAD
																				? leadInput
																				: item.bullhorn_endpoint === VIEWS.CONTACT ||
																				  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
																				? contactInput
																				: item.bullhorn_endpoint === VIEWS.CANDIDATE
																				? candidateInput
																				: accountInput
																		}
																		setValue={
																			item.bullhorn_endpoint === VIEWS.LEAD
																				? setLeadInput
																				: item.bullhorn_endpoint === VIEWS.CONTACT ||
																				  item.bullhorn_endpoint === VIEWS.CLIENT_CONTACT
																				? setContactInput
																				: item.bullhorn_endpoint === VIEWS.CANDIDATE
																				? setCandidateInput
																				: setAccountInput
																		}
																		name={item.bullhorn_field}
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
																		{item.bullhorn_label}?
																	</div>
																	<div className={`${styles.btnBox}`}>
																		<div className={styles.btn}>
																			<InputRadio
																				className={styles.radio}
																				size="24"
																				disabled={item.editable}
																				value={
																					item.bullhorn_endpoint === VIEWS.LEAD
																						? leadInput[item.bullhorn_field]
																						: item.bullhorn_endpoint === VIEWS.CONTACT ||
																						  item.bullhorn_endpoint ===
																								VIEWS.CLIENT_CONTACT
																						? contactInput[item.bullhorn_field]
																						: item.bullhorn_endpoint === VIEWS.CANDIDATE
																						? !candidateInput[item.bullhorn_field]
																						: !accountInput[item.bullhorn_field]
																				}
																				checked={
																					item.bullhorn_endpoint === VIEWS.LEAD
																						? leadInput[item.bullhorn_field] !== ""
																							? leadInput[item.bullhorn_field]
																							: false
																						: item.bullhorn_endpoint === VIEWS.CONTACT ||
																						  item.bullhorn_endpoint ===
																								VIEWS.CLIENT_CONTACT
																						? contactInput[item.bullhorn_field] !== ""
																							? contactInput[item.bullhorn_field]
																							: false
																						: item.bullhorn_endpoint === VIEWS.CANDIDATE
																						? candidateInput[item.bullhorn_field] !== ""
																							? !candidateInput[item.bullhorn_field]
																							: false
																						: accountInput[item.bullhorn_field] !== ""
																						? !accountInput[item.bullhorn_field]
																						: false
																				}
																				onChange={() => {
																					if (item.bullhorn_endpoint === VIEWS.LEAD) {
																						setLeadInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!leadInput[item.bullhorn_field],
																						}));
																					} else if (
																						item.bullhorn_endpoint === VIEWS.CONTACT ||
																						item.bullhorn_endpoint ===
																							VIEWS.CLIENT_CONTACT
																					) {
																						setContactInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!contactInput[item.bullhorn_field],
																						}));
																					} else if (
																						item.bullhorn_endpoint === VIEWS.CANDIDATE
																					) {
																						setCandidateInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!candidateInput[item.bullhorn_field],
																						}));
																					} else {
																						setAccountInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!accountInput[item.bullhorn_field],
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
																					item.bullhorn_endpoint === VIEWS.LEAD
																						? leadInput[item.bullhorn_field] !== ""
																							? !leadInput[item.bullhorn_field]
																							: false
																						: item.bullhorn_endpoint === VIEWS.CONTACT ||
																						  item.bullhorn_endpoint ===
																								VIEWS.CLIENT_CONTACT
																						? contactInput[item.bullhorn_field] !== ""
																							? !contactInput[item.bullhorn_field]
																							: false
																						: item.bullhorn_endpoint === VIEWS.CANDIDATE
																						? candidateInput[item.bullhorn_field] !== ""
																							? !candidateInput[item.bullhorn_field]
																							: false
																						: accountInput[item.bullhorn_field] !== ""
																						? !accountInput[item.bullhorn_field]
																						: false
																				}
																				value={
																					item.bullhorn_endpoint === VIEWS.LEAD
																						? !leadInput[item.bullhorn_field]
																						: item.bullhorn_endpoint === VIEWS.CONTACT ||
																						  item.bullhorn_endpoint ===
																								VIEWS.CLIENT_CONTACT
																						? !contactInput[item.bullhorn_field]
																						: item.bullhorn_endpoint === VIEWS.CANDIDATE
																						? !candidateInput[item.bullhorn_field]
																						: !accountInput[item.bullhorn_field]
																				}
																				onChange={() => {
																					if (item.bullhorn_endpoint === VIEWS.LEAD) {
																						setLeadInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!leadInput[item.bullhorn_field],
																						}));
																					} else if (
																						item.bullhorn_endpoint === VIEWS.CONTACT ||
																						item.bullhorn_endpoint ===
																							VIEWS.CLIENT_CONTACT
																					) {
																						setContactInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!contactInput[item.bullhorn_field],
																						}));
																					} else if (
																						item.bullhorn_endpoint === VIEWS.CANDIDATE
																					) {
																						setCandidateInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!candidateInput[item.bullhorn_field],
																						}));
																					} else {
																						setAccountInput(prev => ({
																							...prev,
																							[item.bullhorn_field]:
																								!accountInput[item.bullhorn_field],
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
				)}
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
