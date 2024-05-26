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
	InputTime,
} from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { VIEWS } from "../../../../../../constants";
import { REFERENCES } from "../../../../constants";
import { PHONE_OPTIONS, EMAIL_OPTIONS } from "../constants";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import FormPlaceholder from "../../../Placeholder/Placeholder";
import { Close2 } from "@cadence-frontend/icons";
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
	const [smartTagContact, setSmartTagContact] = useState("");
	const [smartTagCompany, setSmartTagCompany] = useState("");
	const [tagsFocus, setTagsFocus] = useState(null);

	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const { customObj, loading, setTest, setTestLoading } = useCustomObject(true);
	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.sellsy_endpoint][item.sellsy_field];
				if (item.type === "multi_select_dropdown") {
					if (item.sellsy_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.sellsy_field]: value != null ? value : [],
						}));
					} else {
						setCompanyInput(prev => ({
							...prev,
							[item.sellsy_field]: value != null ? value : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;
					if (type === "date") {
						if (item.sellsy_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.sellsy_field]:
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
								[item.sellsy_field]:
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
					} else if (type === "object") {
						let objValue =
							fields[item.sellsy_endpoint]?.[item.sellsy_field.split(".")[0]]?.[
								item.sellsy_field.split(".")[1]
							];
						if (item.sellsy_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.sellsy_field]: objValue != null ? objValue.toString() : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.sellsy_field]: objValue != null ? objValue.toString() : "",
							}));
						}
					} else if (type === "tag") {
						let tags = fields[item.sellsy_endpoint]?.[item.sellsy_field]?.map(
							tag => tag?.value
						);
						if (item.sellsy_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.sellsy_field]: tags ?? [],
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.sellsy_field]: tags ?? [],
							}));
						}
					} else {
						if (item.sellsy_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.sellsy_field]: value !== null ? value : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.sellsy_field]: value !== null ? value : "",
							}));
						}
					}
				} else if (item.type === "radio_button") {
					const type = item.input_type;
					if (type === "boolean") {
						if (item.sellsy_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.sellsy_field]: value !== null ? value?.toString() : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.sellsy_field]: value !== null ? value?.toString() : "",
							}));
						}
					} else if (type === "object") {
						let objValue =
							fields[item.sellsy_endpoint]?.[item.sellsy_field.split(".")[0]]?.[
								item.sellsy_field.split(".")[1]
							];
						if (item.sellsy_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.sellsy_field]: objValue != null ? objValue.toString() : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.sellsy_field]: objValue != null ? objValue.toString() : "",
							}));
						}
					}
				} else {
					if (item.sellsy_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.sellsy_field]: value !== null ? value : "",
						}));
					} else {
						setCompanyInput(prev => ({
							...prev,
							[item.sellsy_field]: value !== null ? value : "",
						}));
					}
				}
			});
		}
	}, [form, fields]);

	// To handle the smart tags of contact and company in sellsy when enter is pressed while input box is focussed.
	const handleTags = event => {
		if (event.key === "Enter") {
			if (tagsFocus) {
				if (tagsFocus === VIEWS.CONTACT) {
					const tagContact = smartTagContact.trim();
					if (tagContact !== "") {
						if (contactInput?.smart_tags?.includes(tagContact)) {
							return addError({
								text: ` '${tagContact}' is already present in smart tags of contact.`,
							});
						} else {
							setContactInput(prev => ({
								...prev,
								smart_tags: [...prev?.smart_tags, tagContact],
							}));
						}
					}
					setSmartTagContact("");
				} else {
					const tagCompany = smartTagCompany.trim();
					if (tagCompany !== "") {
						if (companyInput?.smart_tags?.includes(tagCompany)) {
							return addError({
								text: ` '${tagCompany}' is already present in smart tags of company.`,
							});
						} else {
							setCompanyInput(prev => ({
								...prev,
								smart_tags: [...prev?.smart_tags, tagCompany],
							}));
						}
					}
					setSmartTagCompany("");
				}
			}
		}
	};

	useEffect(() => {
		if (customObj?.contact_custom_object != null) {
			setForm(customObj?.contact_custom_object?.form);
			setButtonText(customObj?.contact_custom_object?.button_text);
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

	// This useEffect is to addEvent listener for smart tags when key is pressed.
	useEffect(() => {
		window.addEventListener("keyup", handleTags);
		return () => {
			window.removeEventListener("keyup", handleTags);
		};
	}, [tagsFocus, smartTagContact, smartTagCompany]);

	const renderInput = (item, row) => {
		const type = item.input_type;
		const count = form.filter(item => item.position.row === row).length;
		const moreThanOne = form.filter(i => i.sellsy_label === item.sellsy_label).length > 1;

		switch (type) {
			case "date":
				return (
					<>
						<Label required={item.sellsy_mandatory}>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={item.sellsy_endpoint === VIEWS.CONTACT ? contactInput : companyInput}
							className={`${!item.editable && styles.disabled}`}
							disabled={!item.editable}
							setValue={
								item.sellsy_endpoint === VIEWS.CONTACT ? setContactInput : setCompanyInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.sellsy_field}
						/>
					</>
				);
			case "time":
				return (
					<>
						<Label required={item.sellsy_mandatory}>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<InputTime
							name={item.sellsy_field}
							input={item.sellsy_endpoint === VIEWS.CONTACT ? contactInput : companyInput}
							setInput={
								item.sellsy_endpoint === VIEWS.CONTACT ? setContactInput : setCompanyInput
							}
							disabled={!item.editable}
							theme={InputThemes.PRIMARY}
							type="select"
							height="40px"
						/>
					</>
				);
			case "tag":
				const smartTags =
					item.sellsy_endpoint === VIEWS.CONTACT
						? contactInput.smart_tags
						: companyInput.smart_tags;
				return (
					<>
						<Label required={item.sellsy_mandatory}>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<Input
							type={"text"}
							disabled={!item.editable}
							placeholder="Add a smart tag"
							onFocus={() => setTagsFocus(item.sellsy_endpoint)}
							onBlur={() => setTagsFocus(null)}
							value={
								item.sellsy_endpoint === VIEWS.CONTACT ? smartTagContact : smartTagCompany
							}
							setValue={
								item.sellsy_endpoint === VIEWS.CONTACT
									? setSmartTagContact
									: setSmartTagCompany
							}
							name={item.sellsy_field}
							className={`${!item.editable && styles.disabled} ${styles.intInput}`}
						/>
						<div className={styles.smartTagsBox}>
							{smartTags?.map(sTag => (
								<div className={styles.smartTag}>
									<div className={styles.name}>{sTag}</div>
									<div
										className={styles.icon}
										onClick={() =>
											item.sellsy_endpoint === VIEWS.CONTACT
												? setContactInput(prev => ({
														...prev,
														[item.sellsy_field]: prev?.[item.sellsy_field]?.filter(
															tag => tag !== sTag
														),
												  }))
												: setCompanyInput(prev => ({
														...prev,
														[item.sellsy_field]: prev?.[item.sellsy_field]?.filter(
															tag => tag !== sTag
														),
												  }))
										}
									>
										<Close2 color={Colors.lightBlue} />
									</div>
								</div>
							))}
						</div>
					</>
				);
			default:
				return (
					<>
						<Label required={item.sellsy_mandatory}>
							{moreThanOne
								? `${item.sellsy_label} (${item.sellsy_endpoint})`
								: item.sellsy_label}
						</Label>
						<Input
							type={"text"}
							disabled={!item.editable}
							placeholder="Type here"
							value={item.sellsy_endpoint === VIEWS.CONTACT ? contactInput : companyInput}
							setValue={
								item.sellsy_endpoint === VIEWS.CONTACT ? setContactInput : setCompanyInput
							}
							name={item.sellsy_field}
							className={`${!item.editable && styles.disabled} ${styles.intInput}`}
						/>
					</>
				);
		}
	};

	const handleSave = () => {
		let body;
		let contactInp = JSON.parse(JSON.stringify(contactInput));
		let companyInp = JSON.parse(JSON.stringify(companyInput));

		form.forEach(item => {
			let value;
			if (item.sellsy_endpoint === VIEWS.CONTACT) {
				value = contactInp[item.sellsy_field];
			} else {
				value = companyInp[item.sellsy_field];
			}

			if (item.type === "multi_select_dropdown") {
				if (item.sellsy_endpoint === VIEWS.CONTACT) {
					contactInp[item.sellsy_field] =
						value.length === 0
							? item.sellsy_field === "marketing_campaigns_subscriptions"
								? []
								: null
							: value;
				} else {
					companyInp[item.sellsy_field] =
						value.length === 0
							? item.sellsy_field === "marketing_campaigns_subscriptions"
								? []
								: null
							: value;
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "date") {
					if (item.sellsy_endpoint === VIEWS.CONTACT) {
						contactInp[item.sellsy_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else {
						companyInp[item.sellsy_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					}
				} else if (type === "tag") {
					if (item.sellsy_endpoint === VIEWS.CONTACT) {
						contactInp[item.sellsy_field] = value?.map(tag => ({ value: tag }));
					} else {
						companyInp[item.sellsy_field] = value?.map(tag => ({ value: tag }));
					}
				} else if (item.sellsy_field !== "note") {
					if (item.sellsy_endpoint === VIEWS.CONTACT) {
						contactInp[item.sellsy_field] = value === "" ? null : value;
					} else {
						companyInp[item.sellsy_field] = value === "" ? null : value;
					}
				}
			} else if (item.type === "radio_button") {
				if (item.input_type === "boolean" || item.input_type === "object") {
					if (item.sellsy_endpoint === VIEWS.CONTACT) {
						contactInp[item.sellsy_field] = value === "" ? null : value === "true";
					} else {
						companyInp[item.sellsy_field] = value === "" ? null : value === "true";
					}
				}
			} else {
				if (item.sellsy_endpoint === VIEWS.CONTACT) {
					contactInp[item.sellsy_field] =
						value === "" || value === undefined ? null : value;
				} else {
					companyInp[item.sellsy_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});
		// Validation error
		if (
			form.filter(item => item.sellsy_field === "capital").length !== 0 &&
			companyInp["capital"] &&
			!Number.isInteger(Number(companyInp["capital"]))
		)
			return addError({ text: "Capital should be integer." });

		form.forEach(item => {
			item.sellsy_mandatory &&
				((item.sellsy_endpoint === VIEWS.CONTACT &&
					contactInp[item.sellsy_field] === null) ||
					(item.sellsy_endpoint === VIEWS.COMPANY &&
						companyInp[item.sellsy_field] === null)) &&
				addError({ text: `Please fill all the required fields` });
		});
		form.forEach(item => {
			if (item.editable === false) {
				if (item.sellsy_endpoint === VIEWS.CONTACT) delete contactInp[item.sellsy_field];
				else delete companyInp[item.sellsy_field];
			}
		});

		body = {
			id: fields[VIEWS.CONTACT].id,
			contact_custom_object: contactInp,
			company_custom_object: companyInp,
			...(fields[VIEWS.COMPANY]?.id && { sellsy_company_id: fields[VIEWS.COMPANY]?.id }),
		};

		setTest(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${VIEWS.CONTACT} in sellsy`);
				onClose();
				setShowLeadUrlModal(true);
			},
			onError: err => {
				return addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	return (
		<Modal
			showCloseButton
			disableOutsideClick
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
																		<Label required={item.sellsy_mandatory}>
																			{item.sellsy_label}
																		</Label>
																		<Select
																			placeholder={"Select here"}
																			value={
																				item.sellsy_endpoint === VIEWS.CONTACT
																					? contactInput
																					: companyInput
																			}
																			setValue={
																				item.sellsy_endpoint === VIEWS.CONTACT
																					? setContactInput
																					: setCompanyInput
																			}
																			name={item.sellsy_field}
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
																{item.type === "multi_select_dropdown" && (
																	<>
																		<Label required={item.sellsy_mandatory}>
																			{item.sellsy_label}
																		</Label>
																		<Select
																			placeholder={"Select here"}
																			disabled={!item.editable}
																			value={
																				item.sellsy_endpoint === VIEWS.CONTACT
																					? contactInput
																					: companyInput
																			}
																			setValue={
																				item.sellsy_endpoint === VIEWS.CONTACT
																					? setContactInput
																					: setCompanyInput
																			}
																			name={item.sellsy_field}
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
																		<div
																			className={`${styles.label}${
																				item.sellsy_mandatory && styles.required
																			}`}
																		>
																			{item.sellsy_label}?
																		</div>
																		<div className={`${styles.btnBox}`}>
																			{item?.possible_values?.map(i => (
																				<div className={styles.btn}>
																					<InputRadio
																						className={styles.radio}
																						size="24"
																						disabled={!item.editable}
																						value={
																							item.sellsy_endpoint === VIEWS.CONTACT
																								? contactInput[item.sellsy_field]
																								: companyInput[item.sellsy_field]
																						}
																						checked={
																							item.sellsy_endpoint === VIEWS.CONTACT
																								? contactInput[item.sellsy_field] ===
																								  i?.value
																									? true
																									: false
																								: companyInput[item.sellsy_field] ===
																								  i?.value
																								? true
																								: false
																						}
																						onChange={() => {
																							if (
																								item.sellsy_endpoint === VIEWS.CONTACT
																							) {
																								setContactInput(prev => ({
																									...prev,
																									[item.sellsy_field]: i?.value,
																								}));
																							} else {
																								setCompanyInput(prev => ({
																									...prev,
																									[item.sellsy_field]: i?.value,
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
