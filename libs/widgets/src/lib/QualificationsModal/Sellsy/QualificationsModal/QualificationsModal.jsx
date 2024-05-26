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
	InputTime,
} from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { VIEWS } from "./constants";
import { useCustomObject } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import FormPlaceholder from "../../components/Placeholder/Placeholder";
import { Close2, Delete, Plus, Search } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

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
	const [contactInput, setContactInput] = useState({});
	const [companyInput, setCompanyInput] = useState({});
	const [smartTagContact, setSmartTagContact] = useState("");
	const [smartTagCompany, setSmartTagCompany] = useState("");
	const [tagsFocus, setTagsFocus] = useState(null);
	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);
	const { setCustomObject, setCustomObjectLoading } = useCustomObject();
	useEffect(() => {
		if (form) {
			form.forEach(item => {
				const value = fields[item.integration_endpoint][item.integration_field];
				if (item.type === "multi_select_dropdown") {
					if (item.integration_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value : [],
						}));
					} else {
						setCompanyInput(prev => ({
							...prev,
							[item.integration_field]: value != null ? value : [],
						}));
					}
				} else if (item.type === "input_box") {
					const type = item.input_type;

					if (type === "date") {
						if (item.integration_endpoint === VIEWS.CONTACT) {
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
							setCompanyInput(prev => ({
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
					} else if (type === "object") {
						let objValue =
							fields[item.integration_endpoint]?.[item.integration_field.split(".")[0]]?.[
								item.integration_field.split(".")[1]
							];
						if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]: objValue != null ? objValue.toString() : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.integration_field]: objValue != null ? objValue.toString() : "",
							}));
						}
					} else if (type === "tag") {
						let tags = fields[item.integration_endpoint]?.[item.integration_field]?.map(
							tag => tag?.value
						);
						if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]: tags ?? [],
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.integration_field]: tags ?? [],
							}));
						}
					} else {
						if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value : "",
							}));
						}
					}
				} else if (item.type === "radio_button") {
					const type = item.input_type;
					if (type === "boolean") {
						if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value?.toString() : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.integration_field]: value !== null ? value?.toString() : "",
							}));
						}
					} else if (type === "object") {
						let objValue =
							fields[item.integration_endpoint]?.[item.integration_field.split(".")[0]]?.[
								item.integration_field.split(".")[1]
							];
						if (item.integration_endpoint === VIEWS.CONTACT) {
							setContactInput(prev => ({
								...prev,
								[item.integration_field]: objValue != null ? objValue.toString() : "",
							}));
						} else {
							setCompanyInput(prev => ({
								...prev,
								[item.integration_field]: objValue != null ? objValue.toString() : "",
							}));
						}
					}
				} else {
					if (item.integration_endpoint === VIEWS.CONTACT) {
						setContactInput(prev => ({
							...prev,
							[item.integration_field]: value !== null ? value : "",
						}));
					} else {
						setCompanyInput(prev => ({
							...prev,
							[item.integration_field]: value !== null ? value : "",
						}));
					}
				}
			});
		}
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
		window.addEventListener("keyup", handleTags);
		return () => {
			window.removeEventListener("keyup", handleTags);
		};
	}, [tagsFocus, smartTagContact, smartTagCompany]);

	const renderInput = (item, row) => {
		const type = item.input_type;
		const count = form.filter(item => item.position.row === row).length;
		const moreThanOne =
			form.filter(i => i.integration_label === item.integration_label).length > 1;

		switch (type) {
			case "date":
				return (
					<>
						<Label>
							{moreThanOne
								? `${item.integration_label} (${item.integration_endpoint})`
								: item.integration_label}
						</Label>
						<Input
							placeholder="Select Date"
							type="date"
							left={item.position.column === 2 && count === 3}
							value={
								item.integration_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							className={`${!item.editable && styles.disabled}`}
							disabled={!item.editable}
							setValue={
								item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
							}
							top={row > maxRow / 2 && maxRow / 2 >= 5}
							name={item.integration_field}
						/>
					</>
				);

			case "time":
				return (
					<>
						<Label required={item.integration_mandatory}>
							{moreThanOne
								? `${item.integration_label} (${item.integration_endpoint})`
								: item.integration_label}
						</Label>
						<InputTime
							name={item.integration_field}
							input={
								item.integration_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							setInput={
								item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
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
					item.integration_endpoint === VIEWS.CONTACT
						? contactInput.smart_tags
						: companyInput.smart_tags;
				return (
					<>
						<Label required={item.integration_mandatory}>
							{moreThanOne
								? `${item.integration_label} (${item.integration_endpoint})`
								: item.integration_label}
						</Label>
						<Input
							type={"text"}
							disabled={!item.editable}
							placeholder="Add a smart tag"
							onFocus={() => setTagsFocus(item.integration_endpoint)}
							onBlur={() => setTagsFocus(null)}
							value={
								item.integration_endpoint === VIEWS.CONTACT
									? smartTagContact
									: smartTagCompany
							}
							setValue={
								item.integration_endpoint === VIEWS.CONTACT
									? setSmartTagContact
									: setSmartTagCompany
							}
							name={item.integration_field}
							className={`${!item.editable && styles.disabled} ${styles.intInput}`}
						/>
						<div className={styles.smartTagsBox}>
							{smartTags?.map(sTag => (
								<div className={styles.smartTag}>
									<div className={styles.name}>{sTag}</div>
									<div
										className={styles.icon}
										onClick={() =>
											item.integration_endpoint === VIEWS.CONTACT
												? setContactInput(prev => ({
														...prev,
														[item.integration_field]: prev?.[
															item.integration_field
														]?.filter(tag => tag !== sTag),
												  }))
												: setCompanyInput(prev => ({
														...prev,
														[item.integration_field]: prev?.[
															item.integration_field
														]?.filter(tag => tag !== sTag),
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
						<Label>
							{moreThanOne
								? `${item.integration_label} (${item.integration_endpoint})`
								: item.integration_label}
						</Label>
						<Input
							type={"text"}
							disabled={!item.editable}
							placeholder="Type here"
							value={
								item.integration_endpoint === VIEWS.CONTACT ? contactInput : companyInput
							}
							setValue={
								item.integration_endpoint === VIEWS.CONTACT
									? setContactInput
									: setCompanyInput
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

		let contactInp = JSON.parse(JSON.stringify(contactInput));
		let companyInp = JSON.parse(JSON.stringify(companyInput));

		form.forEach(item => {
			let value;
			if (item.integration_endpoint === VIEWS.CONTACT) {
				value = contactInp[item.integration_field];
			} else {
				value = companyInp[item.integration_field];
			}

			if (item.type === "multi_select_dropdown") {
				if (item.integration_endpoint === VIEWS.CONTACT) {
					contactInp[item.integration_field] =
						value.length === 0
							? item.integration_field === "marketing_campaigns_subscriptions"
								? []
								: null
							: value;
				} else {
					companyInp[item.integration_field] =
						value.length === 0
							? item.integration_field === "marketing_campaigns_subscriptions"
								? []
								: null
							: value;
				}
			} else if (item.type === "input_box") {
				const type = item.input_type;
				if (type === "date") {
					if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					} else {
						companyInp[item.integration_field] =
							value.DD !== "dd" ? `${value.YYYY}-${value.MM}-${value.DD}` : null;
					}
				} else if (type === "tag") {
					if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] = value?.map(tag => ({ value: tag }));
					} else {
						companyInp[item.integration_field] = value?.map(tag => ({ value: tag }));
					}
				} else if (item.integration_field !== "note") {
					if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] = value === "" ? null : value;
					} else {
						companyInp[item.integration_field] = value === "" ? null : value;
					}
				}
			} else if (item.type === "radio_button") {
				if (item.input_type === "boolean" || item.input_type === "object") {
					if (item.integration_endpoint === VIEWS.CONTACT) {
						contactInp[item.integration_field] = value === "" ? null : value === "true";
					} else {
						companyInp[item.integration_field] = value === "" ? null : value === "true";
					}
				}
			} else {
				if (item.integration_endpoint === VIEWS.CONTACT) {
					contactInp[item.integration_field] =
						value === "" || value === undefined ? null : value;
				} else {
					companyInp[item.integration_field] =
						value === "" || value === undefined ? null : value;
				}
			}
		});
		if (
			form.filter(item => item.integration_field === "capital").length !== 0 &&
			companyInp["capital"] &&
			!Number.isInteger(Number(companyInp["capital"]))
		)
			return addError({ text: "Capital should be integer." });
		// if (
		// 	form.filter(
		// 		item =>
		// 			item.integration_field === "social.facebook" &&
		// 			item.integration_endpoint === "contact"
		// 	).length !== 0 &&
		// 	!(
		// 		contactInp["social.facebook"].startsWith("facebook.com/") ||
		// 		contactInp["social.facebook"].startsWith("https://facebook.com/")
		// 	)
		// )
		// 	return addError(
		// 		"Facebook URL should be of format facebook.com/ or https://facebook.com/ "
		// 	);

		// if (
		// 	form.filter(
		// 		item =>
		// 			item.integration_field === "social.linkedin" &&
		// 			item.integration_endpoint === "contact"
		// 	).length !== 0 &&
		// 	!(
		// 		contactInp["social.linkedin"].startsWith("linkedin.com/") ||
		// 		contactInp["social.linkedin"].startsWith("https://linkedin.com/")
		// 	)
		// )
		// 	return addError(
		// 		"Linkedin URL should be of format linkedin.com/ or https://linkedin.com/ "
		// 	);
		//To verify whether all the required fields are filled or not
		form.forEach(item => {
			item.integration_mandatory &&
				((item.integration_endpoint === VIEWS.CONTACT &&
					contactInp[item.integration_field] === null) ||
					(item.integration_endpoint === VIEWS.COMPANY &&
						companyInp[item.integration_field] === null)) &&
				addError({ text: `Please fill all the required fields` });
		});

		// To remove all the fields from body that are not editable
		form.forEach(item => {
			if (item.editable === false) {
				if (item.integration_endpoint === VIEWS.CONTACT)
					delete contactInp[item.integration_field];
				else delete companyInp[item.integration_field];
			}
		});

		body = {
			lead_id: lead?.lead_id.toString(),
			contact_custom_object: contactInp,
			company_custom_object: companyInp,
			sellsy_company_id: fields[VIEWS.COMPANY]?.id,
		};

		setCustomObject(body, {
			onSuccess: () => {
				addSuccess(`Successfully updated ${VIEWS.CONTACT} in sellsy`);
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
																			item.integration_endpoint === VIEWS.CONTACT
																				? contactInput
																				: companyInput
																		}
																		setValue={
																			item.integration_endpoint === VIEWS.CONTACT
																				? setContactInput
																				: setCompanyInput
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
																			item.integration_endpoint === VIEWS.CONTACT
																				? contactInput
																				: companyInput
																		}
																		setValue={
																			item.integration_endpoint === VIEWS.CONTACT
																				? setContactInput
																				: setCompanyInput
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
																		{item?.possible_values?.map(i => (
																			<div className={styles.btn}>
																				<InputRadio
																					className={styles.radio}
																					size="24"
																					disabled={!item.editable}
																					value={
																						item.integration_endpoint === VIEWS.CONTACT
																							? contactInput[item.integration_field]
																							: companyInput[item.integration_field]
																					}
																					checked={
																						item.integration_endpoint === VIEWS.CONTACT
																							? contactInput[item.integration_field] ===
																							  i?.value
																								? true
																								: false
																							: companyInput[item.integration_field] ===
																							  i?.value
																							? true
																							: false
																					}
																					onChange={() => {
																						if (
																							item.integration_endpoint === VIEWS.CONTACT
																						) {
																							setContactInput(prev => ({
																								...prev,
																								[item.integration_field]: i?.value,
																							}));
																						} else {
																							setCompanyInput(prev => ({
																								...prev,
																								[item.integration_field]: i?.value,
																							}));
																						}
																					}}
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
