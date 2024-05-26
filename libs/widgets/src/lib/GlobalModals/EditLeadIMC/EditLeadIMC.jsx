/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
import { useContext, useEffect, useRef, useState } from "react";

import {
	useCustomVariables,
	useEnrichments,
	useLead,
	useUser,
} from "@cadence-frontend/data-access";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Spinner, Title } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	CollapseContainer,
	Input,
	Label,
	Select,
	ThemedButton,
	InputSelectGroup,
} from "@cadence-frontend/widgets";

import {
	ENRICHMENT_SERVICES,
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	IS_CUSTOM_VARS_AVAILABLE,
} from "@cadence-frontend/constants";
import { Info, LushaLogo, Snov } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	capitalize,
	processCustomVariables,
	removeUnprocessedVariables,
	validatePhoneNumber,
} from "@cadence-frontend/utils";
import ReactHtmlParser from "html-react-parser";
import {
	COMPANY_LINKEDIN_FIELD_AVAILABLE,
	COMPANY_SIZE_FIELD_AVAILABLE,
	CUSTOM_VARS_NAMES_BY_INTEGRATION,
	EMAIL_OPTIONS,
	ENRICH_LOGO_MAP,
	getAccountVariables,
	getCandidateVariables,
	getCompanySizeOptionsByIntegration,
	getContactVariables,
	getLeadVariables,
	PHONE_OPTIONS,
	sellsyCompanySize,
	USER_TYPE,
} from "./constants";
import styles from "./EditLeadIMC.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const handleErrorMessage = (msg, user) => {
	if (msg?.toLowerCase()?.includes("valid email"))
		return "Please verify that you have entered valid emails";
	if (msg?.toLowerCase()?.includes("valid phone"))
		return "Please verify that you have entered valid phone numbers";
	if (msg?.toLowerCase()?.includes("first_name"))
		return "Please enter a valid first name";
	if (msg?.toLowerCase()?.includes("error while updating contact in pipedrive"))
		return "Please ensure that you are logged in with pipedrive";
	if (msg?.toLowerCase()?.includes("lead.account.name"))
		return "Please enter a valid company name";
	return user.integration_type === "zoho_user" ||
		user.integration_type === "sellsy_owner" ||
		user.integration_type === "salesforce_owner"
		? msg
			? msg
			: "An unknown error has occured, please contact support"
		: "An unknown error has occured, please contact support";
};

// Local Components
// 1. Email Addresses
const EmailAddresses = ({
	emails,
	setEmails,
	handlePrimaryEmailClick,
	handleEmailUpdate,
	user,
	integration_type,
}) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.PIPEDRIVE: {
			return (
				<InputSelectGroup
					input={emails}
					setInput={setEmails}
					handlePrimaryEmailClick={handlePrimaryEmailClick}
					label="email"
					field_key="email_id"
					field_id="lem_id"
					user={user}
				/>
			);
		}

		default:
			return (
				<>
					{emails?.map(email => (
						<div
							key={email.type}
							className={`${styles.inputGroup} ${
								email.isEnriched ? styles.isEnriched : ""
							}`}
						>
							<Label>{email.type ?? "Email"}</Label>
							<Input
								value={email.email_id}
								setValue={value => handleEmailUpdate(email, value)}
								className={styles.inputWithRadio}
								theme={InputThemes.WHITE}
							/>
							<button
								btnwidth="fit-content"
								onClick={() => handlePrimaryEmailClick(email)}
								disabled={email.email_id.length < 1}
								className={`${styles.radioBtn} ${email.is_primary ? styles.primary : ""}`}
							></button>
							{email.isEnriched && (
								<div className={styles.enrichLogo}>
									{ENRICH_LOGO_MAP[email.isEnriched]}{" "}
								</div>
							)}
						</div>
					))}
				</>
			);
	}
};

// 2. Phone Numbers
const PhoneNumbers = ({
	phoneNumbers,
	setPhoneNumbers,
	handlePrimaryPhoneClick,
	handlePhoneUpdate,
	user,
	integration_type,
}) => {
	switch (integration_type) {
		case INTEGRATION_TYPE.PIPEDRIVE: {
			return (
				<InputSelectGroup
					input={phoneNumbers}
					setInput={setPhoneNumbers}
					handlePrimaryEmailClick={handlePrimaryPhoneClick}
					label="phone"
					field_key="phone_number"
					field_id="lpn_id"
					user={user}
				/>
			);
		}
		default:
			return (
				<>
					{phoneNumbers?.map(pn => (
						<div
							key={pn.type}
							className={`${styles.inputGroup} ${pn.isEnriched ? styles.isEnriched : ""}`}
						>
							<Label>{pn?.type?.replaceAll("_", " ")}</Label>
							<Input
								value={pn.phone_number}
								setValue={value => handlePhoneUpdate(pn, value)}
								className={styles.inputWithRadio}
								theme={InputThemes.WHITE}
							/>
							<button
								btnwidth="fit-content"
								onClick={() => handlePrimaryPhoneClick(pn)}
								disabled={pn.phone_number.length < 1}
								className={`${styles.radioBtn} ${pn.is_primary ? styles.primary : ""}`}
							></button>
							{pn.isEnriched && (
								<div className={styles.enrichLogo}>{ENRICH_LOGO_MAP[pn.isEnriched]} </div>
							)}
						</div>
					))}
				</>
			);
	}
};

// 3. Custom Variables
const CustomVariables = ({ variables, setVariables, variableRef = null }) => {
	return (
		<div id="variables">
			{variables?.map(variable => (
				<div className={styles.inputGroup}>
					<Label>{variable.label}</Label>
					{variable?.picklist_values?.length > 0 ? (
						<Select
							value={variable.value}
							setValue={value =>
								setVariables(prev =>
									prev.map(item => {
										if (item.var_id === variable.var_id) return { ...item, value };
										return item;
									})
								)
							}
							options={variable?.picklist_values?.map(opt => ({
								label: opt.label,
								value: opt.value,
							}))}
							menuOnTop
						/>
					) : (
						<Input
							value={variable.value}
							setValue={value =>
								setVariables(prev =>
									prev.map(item => {
										if (item.var_id === variable.var_id) return { ...item, value };
										return item;
									})
								)
							}
							className={styles.input}
							theme={InputThemes.WHITE}
						/>
					)}
				</div>
			))}
		</div>
	);
};

const EditLeadIMC = ({
	//typeSpecificProps
	lead,
	fieldMap,
	refetchLead,
	info,
	refetchInfo,
	validateTask = false,
	node,
	markTaskAsCompleteIfCurrent,
	isScrollDown = false,
	scrollType,
	//modalProps
	innerModalState,
	onClose,
	countries: allCountry,
}) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const integration_type = useRecoilValue(userInfo).integration_type;
	const {
		updateLead,
		enrichLeadWithLusha,
		enrichLeadLushaLoading,
		enrichLeadWithKaspr,
		enrichLeadKasprLoading,
		enrichLeadWithHunter,
		enrichLeadHunterLoading,
		enrichLeadWithDropcontact,
		enrichLeadDropcontactLoading,
		enrichLeadWithSnov,
		enrichLeadSnovLoading,
	} = useLead();

	const { enrichmentsData } = useEnrichments(Boolean(innerModalState));
	const { replaceCustomVariables, replaceCustomVariablesLoading } = useCustomVariables(
		lead?.lead_id
	);
	const { user } = useUser({ user: Boolean(innerModalState) });

	// Refs
	const phonesRef = useRef();
	const emailsRef = useRef();
	const editLeadModalRef = useRef(null);
	const variableRef = useRef(null);
	const leadVariableRef = useRef(null);
	const contactVariableRef = useRef(null);
	const accountVariableRef = useRef(null);

	const [companySizeOptions, setCompanySizeOptions] = useState([]);
	const [message, setMessage] = useState("");
	const [leadInput, setLeadInput] = useState({});
	const [accountInput, setAccountInput] = useState({});
	const [phoneNumbers, setPhoneNumbers] = useState([]);
	const [emails, setEmails] = useState([]);
	const [leadVariables, setLeadVariables] = useState([]);
	const [contactVariables, setContactVariables] = useState([]);
	const [candidateVariables, setCandidateVariables] = useState([]);
	const [accountVariables, setAccountVariables] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (
			validateTask &&
			integration_type !== INTEGRATION_TYPE.GOOGLE_SHEETS &&
			integration_type !== INTEGRATION_TYPE.SHEETS
		) {
			const processedMessage = processCustomVariables(node?.data?.message || "", lead, {
				...lead.User,
				Company: fieldMap,
			});
			if (
				IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type) &&
				processedMessage !== ""
			)
				replaceCustomVariables(processedMessage, {
					onSuccess: data => {
						setMessage(removeUnprocessedVariables(data?.body));
					},
					onError: err => {
						addError({
							text: err.response?.data?.msg ?? "Error while fetching custom variables",
							desc: err.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
						setMessage(removeUnprocessedVariables(processedMessage));
					},
				});
			else if (processedMessage !== "") setMessage(processedMessage);
			else setMessage("No Instructions mentioned");
		}
	}, [node, node?.data?.message]);

	useEffect(() => {
		if (lead) {
			setLeadInput({
				lead_id: lead?.lead_id,
				first_name: lead?.first_name,
				last_name: lead?.last_name,
				linkedin_url: lead?.linkedin_url,
				job_position: lead?.job_position ?? null,
			});
			setAccountInput({
				name: lead?.Account?.name,
				url: lead?.Account?.url,
				linkedin_url: lead?.Account?.linkedin_url,
				size:
					integration_type !== INTEGRATION_TYPE.SELLSY
						? lead?.Account?.size ?? ""
						: sellsyCompanySize(lead?.Account?.size),
				phone_number: lead?.Account?.phone_number,
				zipcode: lead?.Account?.zipcode?.toString(),
				country:
					integration_type === INTEGRATION_TYPE.BULLHORN
						? allCountry?.find(
								item => item.label?.trim() === lead?.Account?.country?.trim()
						  )?.value
						: lead?.Account?.country,
			});

			setPhoneNumbers(
				lead?.Lead_phone_numbers.map(ph => ({
					lpn_id: ph.lpn_id,
					phone_number: ph.phone_number,
					type:
						integration_type === INTEGRATION_TYPE.PIPEDRIVE
							? PHONE_OPTIONS.includes(ph.type)
								? ph.type
								: "mobile"
							: ph.type,
					is_primary: ph.is_primary,
				}))
			);
			setEmails(
				lead?.Lead_emails.map(em => ({
					lem_id: em.lem_id,
					email_id: em.email_id,
					type:
						integration_type === INTEGRATION_TYPE.PIPEDRIVE
							? EMAIL_OPTIONS.includes(em.type)
								? em.type
								: "work"
							: em.type || "Email",
					is_primary: em.is_primary,
				}))
			);

			setLeadVariables(getLeadVariables(lead, fieldMap, info));
			setContactVariables(getContactVariables(lead, fieldMap, info));
			setCandidateVariables(getCandidateVariables(lead, fieldMap, info));
			setAccountVariables(getAccountVariables(lead, fieldMap, info));
			getCompanySizeOptionsByIntegration(
				integration_type,
				lead,
				fieldMap,
				setCompanySizeOptions,
				addError
			);
		}
	}, [lead]);

	const checkUserAccess = () =>
		user?.lusha_service_enabled ||
		user?.kaspr_service_enabled ||
		user?.hunter_service_enabled ||
		user?.dropcontact_service_enabled ||
		user?.snov_service_enabled;

	// Phone Numbers
	const handlePrimaryPhoneClick = pn => {
		if (pn.is_primary) return;
		if (pn.lpn_id)
			setPhoneNumbers(prev =>
				prev.map(number =>
					number.lpn_id === pn.lpn_id
						? { ...number, is_primary: true }
						: { ...number, is_primary: false }
				)
			);
		else
			setPhoneNumbers(prev =>
				prev.map(number =>
					number.phone_number === pn.phone_number
						? { ...number, is_primary: true }
						: { ...number, is_primary: false }
				)
			);
	};

	const handlePhoneUpdate = (editPhone, value) => {
		setPhoneNumbers(prev =>
			prev.map(pn => {
				if (pn.lpn_id === editPhone.lpn_id) return { ...pn, phone_number: value };
				return pn;
			})
		);
	};

	//Emails
	const handlePrimaryEmailClick = async editEmail => {
		if (editEmail.is_primary) return;
		if (editEmail.lem_id)
			setEmails(prev =>
				prev.map(email =>
					email.lem_id === editEmail.lem_id
						? { ...email, is_primary: true }
						: { ...email, is_primary: false }
				)
			);
		else
			setEmails(prev =>
				prev.map(email =>
					email.email_id === editEmail.email_id
						? { ...email, is_primary: true }
						: { ...email, is_primary: false }
				)
			);
	};

	const handleEmailUpdate = (editEmail, value) => {
		setEmails(prev =>
			prev.map(email => {
				if (email.lem_id === editEmail.lem_id) return { ...email, email_id: value };
				return email;
			})
		);
	};

	const handleClose = () => {
		setMessage("");
		setLeadInput({});
		setAccountInput({});
		setEmails([]);
		setPhoneNumbers([]);
		onClose();
	};

	const removeHiddenCharacters = phoneNumbers => {
		return phoneNumbers?.map(pn => {
			const newPn = { ...pn };

			if (newPn.phone_number)
				newPn.phone_number = newPn.phone_number.replace(
					/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u200b\u202f\u205f\u3000]/g,
					""
				);

			return newPn;
		});
	};

	const handleSubmit = async () => {
		if (user?.integration_type === USER_TYPE.ZOHO_USER) {
			if (!leadInput.last_name)
				return addError({ text: "Please enter a valid last name" });
		}
		if (!leadInput.first_name?.length)
			return addError({ text: `'First Name' is required!` });
		if (lead.Account && !accountInput.name?.length)
			return addError({ text: `'Company Name' is required!` });

		setLoading(true);
		try {
			//check duplicate numbers
			let allPhoneNumbers = [
				...phoneNumbers,
				{ phone_number: accountInput.phone_number },
			];

			allPhoneNumbers = removeHiddenCharacters(allPhoneNumbers);

			const validPhoneNumbers = [];

			for (const ph of allPhoneNumbers) {
				if (
					allPhoneNumbers
						.filter(phf => phf.phone_number?.length)
						.filter(phf => phf.phone_number === ph.phone_number).length > 1
				) {
					setLoading(false);
					return addError({ text: "Duplicate phone numbers not allowed" });
				}

				// validate phone number
				if (ph.phone_number && !validatePhoneNumber(ph.phone_number)) {
					setLoading(false);
					return addError({
						text: `Please enter a valid phone number for: ${
							ph.type ?? "Company Phone Number"
						}`,
					});
				}

				if (!ph.type)
					setAccountInput(prev => ({ ...prev, phone_number: ph.phone_number }));
				else validPhoneNumbers.push(ph);
			}

			let phone_numbers = validPhoneNumbers.map(ph => {
				delete ph.isEnriched;
				return ph.phone_number.length === 0 ? { ...ph, is_primary: false } : ph;
			});

			let emailsToUpdate = emails.map(em => {
				delete em.isEnriched;
				return em.email_id.length === 0 ? { ...em, is_primary: false } : em;
			});

			// validate zipcode (numbers, character, numeric, Space, and hypens)
			// if (accountInput.zipcode && !/^[0-9a-zA-Z -]+$/.test(accountInput.zipcode)) {
			// 	setLoading(false);
			// 	return addError("Please enter a valid zipcode.");
			// }

			let variables = {};
			switch (lead?.integration_type) {
				case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
				case LEAD_INTEGRATION_TYPES.ZOHO_LEAD: {
					if (leadVariables?.length) {
						console.log(leadVariables, "leadvariables");
						variables["lead"] = {};
						leadVariables?.forEach(lead_variable => {
							variables["lead"][lead_variable.name] = lead_variable.value;
						});
					}
					break;
				}
				case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
				case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT:
				case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT:
				case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT: {
					if (contactVariables?.length) {
						variables["contact"] = {};
						contactVariables?.forEach(contact_variable => {
							variables["contact"][contact_variable.name] = contact_variable.value;
						});
					}
					if (accountVariables?.length) {
						variables["account"] = {};
						accountVariables?.forEach(account_variable => {
							variables["account"][account_variable.name] = account_variable.value;
						});
					}
					break;
				}
				case LEAD_INTEGRATION_TYPES.PIPEDRIVE_PERSON:
				case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD: {
					if (leadVariables?.length) {
						variables["lead"] = {};
						leadVariables?.forEach(lead_variable => {
							variables["lead"][lead_variable.name] = lead_variable.value;
						});
					}
					if (accountVariables?.length) {
						variables["account"] = {};
						accountVariables?.forEach(account_variable => {
							variables["account"][account_variable.name] = account_variable.value;
						});
					}
					break;
				}
				case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE: {
					if (candidateVariables?.length) {
						variables["lead"] = {};
						candidateVariables?.forEach(lead_variable => {
							variables["lead"][lead_variable.name] = lead_variable.value;
						});
					}
					break;
				}
				case LEAD_INTEGRATION_TYPES.SELLSY_CONTACT: {
					if (contactVariables?.length) {
						variables["contact"] = {};
						contactVariables?.forEach(contact_variable => {
							let obj = variables["contact"];
							let splitKeys = contact_variable.name?.trim()?.split(".");
							for (let i = 0; i < splitKeys.length - 1; i++) {
								let key = splitKeys[i];
								if (obj[key] === undefined) obj[key] = {};
								obj = obj[key];
							}
							obj[splitKeys[splitKeys.length - 1]] = contact_variable.value;
						});
					}
					if (accountVariables?.length) {
						variables["account"] = {};
						accountVariables?.forEach(account_variable => {
							let obj = variables["account"];
							let splitKeys = account_variable.name?.trim()?.split(".");
							for (let i = 0; i < splitKeys.length - 1; i++) {
								let key = splitKeys[i];
								if (obj[key] === undefined) obj[key] = {};
								obj = obj[key];
							}
							obj[splitKeys[splitKeys.length - 1]] = account_variable.value;
						});
					}
					break;
				}
			}

			const accountInputFields = {
				...accountInput,
				country:
					integration_type === INTEGRATION_TYPE.BULLHORN
						? allCountry?.find(item => item.value === accountInput.country)?.label
						: accountInput.country,
			};

			if (integration_type === INTEGRATION_TYPE.BULLHORN) {
				accountInputFields["countryId"] = allCountry?.find(
					item => item.value === accountInput.country
				)?.value;
			}

			if (
				integration_type === INTEGRATION_TYPE.BULLHORN &&
				lead?.Account &&
				!accountInputFields.country &&
				!accountInputFields["countryId"]
			) {
				return addError({ text: `Please enter an valid country name` });
			}

			const body = {
				lead: {
					lead_id: leadInput.lead_id,
					first_name: leadInput.first_name,
					last_name: leadInput.last_name,
					linkedin_url: leadInput.linkedin_url?.length ? leadInput.linkedin_url : null,
					job_position: leadInput.job_position?.length ? leadInput.job_position : null,
					account_id: lead.Account?.account_id,
					account: lead.Account
						? {
								...accountInputFields,
								zipcode: accountInput.zipcode?.length ? accountInput.zipcode : null,
								...((integration_type === INTEGRATION_TYPE.SALESFORCE ||
									integration_type === INTEGRATION_TYPE.HUBSPOT ||
									integration_type === INTEGRATION_TYPE.PIPEDRIVE ||
									integration_type === INTEGRATION_TYPE.ZOHO ||
									integration_type === INTEGRATION_TYPE.SELLSY ||
									integration_type === INTEGRATION_TYPE.BULLHORN) &&
									info && {
										variables: variables.account ?? null,
									}),
						  }
						: null,
					...((integration_type === INTEGRATION_TYPE.SALESFORCE ||
						integration_type === INTEGRATION_TYPE.HUBSPOT ||
						integration_type === INTEGRATION_TYPE.PIPEDRIVE ||
						integration_type === INTEGRATION_TYPE.ZOHO ||
						integration_type === INTEGRATION_TYPE.SELLSY ||
						integration_type === INTEGRATION_TYPE.BULLHORN) &&
						info && {
							variables: variables.lead ?? variables.contact ?? null,
						}),
				},
				phone_numbers,
				emails: emailsToUpdate,
			};

			await updateLead(body, {
				onError: err => {
					setLoading(false);
					addError({
						text: handleErrorMessage(err.response?.data?.msg, user),
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: async res => {
					if (
						IS_CUSTOM_VARS_AVAILABLE?.includes(integration_type) &&
						refetchInfo &&
						typeof refetchInfo === "function"
					)
						refetchInfo();
					if (validateTask)
						await markTaskAsCompleteIfCurrent({}, () => {
							let successString = capitalize(integration_type?.replace("_", " "));

							addSuccess(`${successString} updated`);
							setLoading(false);
							setTimeout(() => refetchLead(), 1000); //TEMP: added setTimeout due to backend issue
							handleClose();
						});
					else {
						addSuccess("Informations updated");
						setLoading(false);
						setTimeout(() => refetchLead(), 1000); //TEMP: added setTimeout due to backend issue
						handleClose();
					}
				},
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleLeadEnrich = service => {
		const errorCb = err => {
			addError({
				text: err?.response?.data?.msg,
				desc: err?.response?.data?.error,
				cId: err?.response?.data?.correlationId,
			});
		};

		const successCb = data => {
			refetchLead();
			addSuccess(data?.msg);

			let ref = null;

			if (data?.data) {
				// set phone numbers
				const enrichedPnObj = data.data.phone_numbers ?? {};
				const updatedPhoneNumbers = phoneNumbers.map(prevPn => {
					if (prevPn.type in enrichedPnObj) {
						ref = phonesRef;
						return {
							...prevPn,
							phone_number: enrichedPnObj[prevPn.type].phone_number,
							isEnriched: service,
						};
					}
					return prevPn;
				});

				const updatedPhoneTypes = updatedPhoneNumbers.map(pn => pn.type);
				Object.keys(enrichedPnObj).map(type => {
					if (!updatedPhoneTypes.includes(type)) {
						ref = phonesRef;
						updatedPhoneNumbers.push({
							phone_number: enrichedPnObj[type].phone_number,
							type,
							isEnriched: service,
						});
					}
				});

				// if there's only one phone number, then make it primary
				if (updatedPhoneNumbers.length === 1 && updatedPhoneNumbers[0].phone_number)
					updatedPhoneNumbers[0].is_primary = true;

				setPhoneNumbers(updatedPhoneNumbers);

				// set emails
				const enrichedEmailsObj = data.data.emails ?? {};
				const updatedEmails = emails.map(prevEmail => {
					if (prevEmail.type in enrichedEmailsObj) {
						if (!ref) ref = emailsRef;
						return {
							...prevEmail,
							email_id: enrichedEmailsObj[prevEmail.type].email_id,
							isEnriched: service,
						};
					}
					return prevEmail;
				});

				const updatedEmailTypes = updatedEmails.map(em => em.type);
				Object.keys(enrichedEmailsObj).map(type => {
					if (!updatedEmailTypes.includes(type)) {
						if (!ref) ref = emailsRef;
						updatedEmails.push({
							email_id: enrichedEmailsObj[type].email_id,
							type,
							isEnriched: service,
						});
					}
				});

				// if there's only one email, then make it primary
				if (updatedEmails.length === 1 && updatedEmails[0].email_id)
					updatedEmails[0].is_primary = true;

				setEmails(updatedEmails);

				if (ref)
					ref.current?.scrollIntoView({
						behavior: "smooth",
						block: "center",
						inline: "start",
					});
			}
		};

		const lead_id = leadInput.lead_id;

		switch (service) {
			case ENRICHMENT_SERVICES.LUSHA:
				enrichLeadWithLusha(lead_id, {
					onError: errorCb,
					onSuccess: successCb,
				});
				break;
			case ENRICHMENT_SERVICES.KASPR:
				enrichLeadWithKaspr(lead_id, {
					onError: errorCb,
					onSuccess: successCb,
				});
				break;
			case ENRICHMENT_SERVICES.HUNTER:
				enrichLeadWithHunter(lead_id, {
					onError: errorCb,
					onSuccess: successCb,
				});
				break;
			case ENRICHMENT_SERVICES.DROPCONTACT:
				enrichLeadWithDropcontact(lead_id, {
					onError: errorCb,
					onSuccess: successCb,
				});
				break;
			case ENRICHMENT_SERVICES.SNOV:
				enrichLeadWithSnov(lead_id, {
					onError: errorCb,
					onSuccess: successCb,
				});
				break;
		}
	};

	//Main component - scroll to bottom
	useEffect(() => {
		let timerId;

		if (isScrollDown && scrollType) {
			// const lead = document.querySelector("#leadVariables");
			// const contact = document.querySelector("#contactVariables");
			// const account = document.querySelector("#accountVariables");

			if (scrollType === LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD) {
				timerId = setTimeout(() => {
					leadVariableRef.current.scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest",
					});
				}, 300);
			} else if (scrollType === LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT) {
				timerId = setTimeout(() => {
					contactVariableRef.current.scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest",
					});
				}, 300);
			} else if (scrollType === "salesforce_account") {
				timerId = setTimeout(() => {
					accountVariableRef.current.scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest",
					});
				}, 300);
			}
		}

		return () => clearTimeout(timerId);
	}, [isScrollDown, scrollType]);

	return (
		<div className={styles.editLeadModal}>
			<div className={styles.title}>
				<Title size="1.1rem">
					{COMMON_TRANSLATION.EDIT[user?.language?.toUpperCase()]}
				</Title>
			</div>
			{checkUserAccess() && (
				<div className={styles.leadEnrich}>
					{enrichmentsData?.is_lusha_configured && user?.lusha_service_enabled && (
						<ThemedButton
							className={styles.enrichBtn}
							theme={ThemedButtonThemes.GREY}
							loading={enrichLeadLushaLoading}
							onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.LUSHA)}
							width="54px"
							height="40px"
						>
							<LushaLogo size="20px" />
						</ThemedButton>
					)}
					{enrichmentsData?.is_kaspr_configured && user?.kaspr_service_enabled && (
						<ThemedButton
							className={styles.enrichBtn}
							theme={ThemedButtonThemes.GREY}
							loading={enrichLeadKasprLoading}
							onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.KASPR)}
							width="54px"
							height="40px"
						>
							<img
								src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/kaspr_logo.png"
								alt=""
							/>
						</ThemedButton>
					)}
					{enrichmentsData?.is_hunter_configured && user?.hunter_service_enabled && (
						<ThemedButton
							className={styles.enrichBtn}
							theme={ThemedButtonThemes.GREY}
							loading={enrichLeadHunterLoading}
							onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.HUNTER)}
							width="54px"
							height="40px"
						>
							<img
								src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/hunter_logo.png"
								alt=""
							/>
						</ThemedButton>
					)}
					{enrichmentsData?.is_dropcontact_configured &&
						user?.dropcontact_service_enabled && (
							<ThemedButton
								className={styles.enrichBtn}
								theme={ThemedButtonThemes.GREY}
								loading={enrichLeadDropcontactLoading}
								onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.DROPCONTACT)}
								width="54px"
								height="40px"
							>
								<img src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/dropcontact_logo.png" />
							</ThemedButton>
						)}
					{enrichmentsData?.is_snov_configured && user?.snov_service_enabled && (
						<ThemedButton
							className={styles.enrichBtn}
							theme={ThemedButtonThemes.GREY}
							loading={enrichLeadSnovLoading}
							onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.SNOV)}
							width="54px"
							height="40px"
						>
							<Snov size="1.5rem" />
						</ThemedButton>
					)}
				</div>
			)}
			<div className={styles.main} ref={editLeadModalRef}>
				{validateTask && (
					<CollapseContainer
						className={styles.dataCheckCollpase}
						title={
							<div className={styles.dataCheckTitle}>
								<Info size="1rem" /> Data check task
							</div>
						}
					>
						{!replaceCustomVariablesLoading ? (
							<div className={styles.dataCheckInstructions}>
								{ReactHtmlParser(message)}
							</div>
						) : (
							<div className={styles.loaderWrapper}>
								<Spinner className={styles.loader} />
							</div>
						)}
					</CollapseContainer>
				)}
				<div className={styles.personalInfo}>
					<h3>{TASKS_TRANSLATION.PERSONAL_INFORMATION[user?.language?.toUpperCase()]}</h3>
					<div className={styles.personalDetails}>
						<div className={styles.inputGroup}>
							<Label required>
								{TASKS_TRANSLATION.FIRST_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={leadInput}
								setValue={setLeadInput}
								className={styles.input}
								name="first_name"
								theme={InputThemes.WHITE}
							/>
						</div>

						<div className={styles.inputGroup}>
							<Label
								required={user?.integration_type === USER_TYPE.ZOHO_USER ? true : false}
							>
								{COMMON_TRANSLATION.LAST_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={leadInput}
								setValue={setLeadInput}
								className={styles.input}
								name="last_name"
								theme={InputThemes.WHITE}
							/>
						</div>

						<div className={styles.inputGroup}>
							<Label>
								{COMMON_TRANSLATION.LINKEDIN_LINK[user?.language?.toUpperCase()]}
							</Label>
							<Input
								value={leadInput}
								setValue={setLeadInput}
								className={styles.input}
								name="linkedin_url"
								theme={InputThemes.WHITE}
							/>
						</div>
						<div className={styles.inputGroup}>
							<Label>{TASKS_TRANSLATION.POSITION[user?.language?.toUpperCase()]}</Label>
							<Input
								value={leadInput}
								setValue={setLeadInput}
								className={styles.input}
								name="job_position"
								theme={InputThemes.WHITE}
							/>
						</div>
					</div>
				</div>
				<div className={styles.personalInfo}>
					<h3 ref={phonesRef}>
						{COMMON_TRANSLATION.PHONE_NUMBER[user?.language?.toUpperCase()]}(s)
					</h3>
					<div className={styles.personalDetails}>
						<PhoneNumbers
							phoneNumbers={phoneNumbers}
							setPhoneNumbers={setPhoneNumbers}
							handlePrimaryPhoneClick={handlePrimaryPhoneClick}
							handlePhoneUpdate={handlePhoneUpdate}
							user={user}
							integration_type={integration_type}
						/>
					</div>
				</div>
				<div className={styles.personalInfo}>
					<h3 ref={emailsRef}>
						{COMMON_TRANSLATION.EMAILS[user?.language?.toUpperCase()]}
					</h3>
					<div className={styles.personalDetails}>
						<EmailAddresses
							emails={emails}
							setEmails={setEmails}
							handlePrimaryEmailClick={handlePrimaryEmailClick}
							handleEmailUpdate={handleEmailUpdate}
							user={user}
							integration_type={integration_type}
						/>
					</div>
				</div>

				{lead?.Account && (
					<div className={styles.accountInfo}>
						<h3>
							{TASKS_TRANSLATION.ADDITIONAL_INFORMATION[user?.language?.toUpperCase()]}
						</h3>
						<div className={styles.accountDetails}>
							<div className={styles.inputGroup}>
								<Label required>
									{TASKS_TRANSLATION.COMPANY_NAME[user?.language?.toUpperCase()]}
								</Label>
								<Input
									value={accountInput}
									setValue={setAccountInput}
									className={styles.input}
									name="name"
									theme={InputThemes.WHITE}
								/>
							</div>
							<div className={styles.inputGroup}>
								<Label>
									{TASKS_TRANSLATION.COMPANY_PHONE_NUMBER[user?.language?.toUpperCase()]}
								</Label>
								<Input
									value={accountInput}
									setValue={setAccountInput}
									className={styles.input}
									name="phone_number"
									theme={InputThemes.WHITE}
								/>
							</div>
							<div className={styles.inputGroup}>
								<Label>
									{TASKS_TRANSLATION.COMPANY_URL[user?.language?.toUpperCase()]}
								</Label>
								<Input
									value={accountInput}
									setValue={setAccountInput}
									className={styles.input}
									name="url"
									theme={InputThemes.WHITE}
								/>
							</div>
							{COMPANY_LINKEDIN_FIELD_AVAILABLE.includes(integration_type) && (
								<div className={styles.inputGroup}>
									<Label>
										{
											TASKS_TRANSLATION.COMPANY_LINKEDIN_URL[
												user?.language?.toUpperCase()
											]
										}
									</Label>
									<Input
										value={accountInput}
										setValue={setAccountInput}
										className={styles.input}
										name="linkedin_url"
										theme={InputThemes.WHITE}
									/>
								</div>
							)}
							{COMPANY_SIZE_FIELD_AVAILABLE.includes(integration_type) && (
								<div className={styles.inputGroup}>
									<Label>
										{TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]}
									</Label>

									{!Array.isArray(companySizeOptions) ? (
										<Input
											placeholder={"Type here..."}
											value={accountInput}
											setValue={setAccountInput}
											className={styles.input}
											theme={InputThemes.WHITE}
											name="size"
										/>
									) : (
										<Select
											options={companySizeOptions}
											value={accountInput}
											setValue={setAccountInput}
											name="size"
											menuOnTop
											placeholder={
												COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]
											}
										/>
									)}
								</div>
							)}
							{integration_type !== INTEGRATION_TYPE.SELLSY && (
								<>
									<div className={styles.inputGroup}>
										<Label>
											{COMMON_TRANSLATION.COMPANY_ZIPCODE[user?.language?.toUpperCase()]}
										</Label>
										<Input
											value={accountInput}
											setValue={setAccountInput}
											className={styles.input}
											name="zipcode"
											theme={InputThemes.WHITE}
										/>
									</div>

									<div className={styles.inputGroup}>
										<Label required={integration_type === INTEGRATION_TYPE.BULLHORN}>
											{COMMON_TRANSLATION.COMPANY_COUNTRY[user?.language?.toUpperCase()]}
										</Label>
										{integration_type === INTEGRATION_TYPE.BULLHORN ? (
											<Select
												options={allCountry}
												value={accountInput}
												setValue={setAccountInput}
												name="country"
												placeholder={
													COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]
												}
												menuOnTop
												isSearchable
											/>
										) : (
											<Input
												value={accountInput}
												setValue={setAccountInput}
												className={styles.input}
												name="country"
												theme={InputThemes.WHITE}
											/>
										)}
									</div>
								</>
							)}
						</div>
					</div>
				)}

				<div
					className={styles.customVariableWrapper}
					id="leadVariables"
					ref={leadVariableRef}
				>
					{leadVariables?.length > 0 && info && (
						<div className={styles.variablesInfo}>
							<h3>{`Custom Variables ${CUSTOM_VARS_NAMES_BY_INTEGRATION[integration_type].lead}`}</h3>

							<CustomVariables
								variables={leadVariables}
								setVariables={setLeadVariables}
								isScrollDown={isScrollDown}
								variableRef={leadVariableRef}
								scrollType={scrollType}
							/>
						</div>
					)}
				</div>

				<div
					className={styles.customVariableWrapper}
					id="contactVariables"
					ref={contactVariableRef}
				>
					{contactVariables?.length > 0 && info && (
						<div className={styles.variablesInfo}>
							<h3>Custom Variables Contact</h3>

							<CustomVariables
								variables={contactVariables}
								setVariables={setContactVariables}
								isScrollDown={isScrollDown}
								variableRef={contactVariableRef}
								scrollType={scrollType}
							/>
						</div>
					)}
				</div>

				{candidateVariables?.length > 0 && info && (
					<div className={styles.variablesInfo}>
						<h3>Custom Variables Candidate</h3>

						<CustomVariables
							variables={candidateVariables}
							setVariables={setCandidateVariables}
							isScrollDown={isScrollDown}
						/>
					</div>
				)}

				<div
					className={styles.customVariableWrapper}
					id="accountVariables"
					ref={accountVariableRef}
				>
					{accountVariables?.length > 0 && info && (
						<div className={styles.variablesInfo}>
							<h3>{`Custom Variables ${CUSTOM_VARS_NAMES_BY_INTEGRATION[integration_type].account}`}</h3>

							<CustomVariables
								variables={accountVariables}
								setVariables={setAccountVariables}
								isScrollDown={isScrollDown}
								variableRef={accountVariableRef}
								scrollType={scrollType}
							/>
						</div>
					)}
				</div>
			</div>

			<div className={styles.footer}>
				<ThemedButton
					loading={loading}
					className={styles.saveBtn}
					onClick={handleSubmit}
					theme={ThemedButtonThemes.PRIMARY}
				>
					{validateTask
						? "Save & Complete Data Check"
						: COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</div>
	);
};

export default EditLeadIMC;
