import React, { useState, useEffect, useContext } from "react";
import moment from "moment-timezone";
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
import { REFERENCES } from "./constants";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import FormPlaceholder from "../../components/Placeholder/Placeholder";
import { Search } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
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
	const [inputChange, setInputChange] = useState();
	const [searchItem, setSearchItem] = useState();
	const [references, setReferences] = useState(REFERENCES);
	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const {
		setCustomObject,
		setCustomObjectLoading,
		fetchReferenceFieldOptions,
		fetchReferenceFieldOptionsLoading,
	} = useCustomObject();

	const inputFunc = () => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.integration_endpoint][item.integration_field];
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
				} else if (item.type === "dropdown" && item.reference_field_name) {
					if (item.integration_endpoint === VIEWS.LEAD) {
						setLeadInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value.id : "",
						}));
					} else if (item.integration_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value.id : "",
						}));
					} else {
						setAccountInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value.id : "",
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

	const handleInputChange = (input, item) => {
		let body = {
			integration_endpoint: item.reference_field_name.integration_endpoint,
			search_term: input.length === 0 ? "a" : input,
			reference_field_name: item.reference_field_name.name,
		};
		fetchReferenceFieldOptions(body, {
			onSuccess: data => {
				setReferences(prev => ({
					...prev,
					[item.integration_endpoint]: {
						...prev[item.integration_endpoint],
						[item.integration_field]: data.records,
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
			lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD &&
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
				salesforce_account_id: fields[VIEWS.CONTACT].AccountId,
			};
		}

		setCustomObject(body, {
			onSuccess: () => {
				addSuccess(
					`Successfully updated ${
						lead.integration_type === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD &&
						lead.integration_id
							? VIEWS.LEAD
							: VIEWS.CONTACT
					} in salesforce`
				);
				onClose();
			},
			onError: err => {
				return addError({
					text: err?.response.data.msg,
					desc: err?.response?.data?.error || "Please contact support",
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
				setReferences(REFERENCES);
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
															{item.type === "dropdown" && !item.reference_to && (
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
															{item.type === "dropdown" && item.reference_to && (
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
																		isLoading={
																			searchItem?.integration_field ===
																				item?.integration_field &&
																			fetchReferenceFieldOptionsLoading
																		}
																		name={item.integration_field}
																		icon={<Search color={Colors.lightBlue} />}
																		iconIsRotatable={false}
																		disabled={!item.editable}
																		background={!item.editable && "rgb(250, 246, 246)"}
																		menuOnTop={row === maxRow ? true : false}
																		numberOfOptionsVisible="3"
																		options={
																			Array.isArray(
																				references[item.integration_endpoint]?.[
																					item.integration_field
																				]
																			)
																				? references[item.integration_endpoint]?.[
																						item.integration_field
																				  ]?.map(obj => ({
																						label: obj[item.reference_field_name.name],
																						value: obj.Id,
																				  }))
																				: Object.keys(fields[item.integration_endpoint])
																						.length !== 0 &&
																				  fields[item.integration_endpoint][
																						item.integration_field
																				  ] != null && [
																						{
																							label:
																								fields[item.integration_endpoint][
																									item.integration_field
																								][item.reference_field_name?.name],
																							value:
																								fields[item.integration_endpoint][
																									item.integration_field
																								].id,
																						},
																				  ]
																		}
																		onFocus={() => {
																			setInputChange(
																				fields[item.integration_endpoint][
																					item.integration_field
																				]
																					? fields[item.integration_endpoint]?.[
																							item.integration_field
																					  ]?.[item.reference_field_name?.name]?.[0]
																					: "a"
																			);
																			setSearchItem(item);
																		}}
																		onInputChange={input =>
																			input
																				? setInputChange(input)
																				: setInputChange(
																						fields[item.integration_endpoint][
																							item.integration_field
																						]
																							? fields[item.integration_endpoint]?.[
																									item.integration_field
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
