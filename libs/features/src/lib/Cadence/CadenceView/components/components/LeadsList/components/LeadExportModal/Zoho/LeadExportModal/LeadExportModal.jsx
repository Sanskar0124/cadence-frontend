import { useContext, useEffect, useState } from "react";
import { useLeadExportZoho } from "@cadence-frontend/data-access";

import styles from "./LeadExportModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import { Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

//components
import ExportAsLead from "./components/ExportAsLead/ExportAsLead";
import ExportAsContact from "./components/ExportAsContact/ExportAsContact";

//constants
import { EXPORT_AS, EXPORT_OPTIONS } from "./constants";

const LeadExportModal = ({ modal, setModal, refetch }) => {
	const {
		exportLead,
		exportLeadLoading,
		exportContact,
		exportContactLoading,
		previewLeadLoading,
		previewContactLoading,
	} = useLeadExportZoho();
	const { addError, addSuccess } = useContext(MessageContext);

	const [exportAs, setExportAs] = useState(EXPORT_AS.LEAD);
	const [leadInput, setLeadInput] = useState({});
	const [accountInput, setAccountInput] = useState({});
	const [emailInput, setEmailInput] = useState({});
	const [phoneInput, setPhoneInput] = useState({});
	const [leadForm, setLeadForm] = useState([]);
	const [accountForm, setAccountForm] = useState([]);
	const [emailForm, setEmailForm] = useState([]);
	const [phoneNumberForm, setPhoneNumberForm] = useState([]);

	useEffect(() => {
		if (modal) {
			setLeadInput({});
			setAccountInput({});
			setEmailInput({});
			setPhoneInput({});
			setLeadForm([]);
			setAccountForm([]);
			setEmailForm([]);
			setPhoneNumberForm([]);
		}
	}, [modal, exportAs]);

	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
	};

	const handleSave = () => {
		switch (exportAs) {
			case EXPORT_AS.LEAD: {
				const first_name_label =
					leadForm.find(field => field.name === "first_name")?.integration_label ??
					"FirstName";
				if (leadInput.first_name === null || leadInput.first_name?.length === 0)
					return addError({ text: `'${first_name_label}' for lead is required!` });

				const account_name_label =
					accountForm.find(field => field.name === "name")?.integration_label ?? "Name";
				if (accountInput.name === null || accountInput.name?.length === 0)
					return addError({ text: `'${account_name_label}' for lead is required!` });

				let body = { lead_id: modal.lead_id };
				body.lead_data = leadInput;
				body.account_data = accountInput;
				if (emailForm.length) {
					let emails = [];
					emailForm.forEach(item => {
						emails.push({
							type: item.integration_label,
							email_id: emailInput[item.integration_label],
						});
					});
					body.emails = emails;
				}
				if (phoneNumberForm.length) {
					let phoneNumbers = [];
					phoneNumberForm.forEach(item => {
						phoneNumbers.push({
							type: item.integration_label,
							phone_number: phoneInput[item.integration_label],
						});
					});
					body.phone_numbers = phoneNumbers;
				}

				exportLead(
					{
						...body,
						account_data: {
							...body.account_data,
							...(Object.keys(body.account_data).includes("size") && {
								size: body.account_data.size === null ? "" : body.account_data.size,
							}),
							...(Object.keys(body.account_data).includes("zipcode") && {
								zipcode:
									body.account_data.zipcode === null ? "" : body.account_data.zipcode,
							}),
						},
					},
					{
						onSuccess: () => {
							addSuccess(`Successfully exported lead as Zoho lead`);
							if (refetch && typeof refetch === "function") refetch();
							onClose();
						},
						onError: err => {
							addError({
								text: err?.response?.data?.msg ?? "Error occured while exporting lead",
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
						},
					}
				);
				break;
			}
			case EXPORT_AS.CONTACT: {
				const first_name_label =
					leadForm.find(field => field.name === "first_name")?.integration_label ??
					"FirstName";
				if (leadInput.first_name === null || leadInput.first_name?.length === 0)
					return addError({ text: `'${first_name_label}' for contact is required!` });

				const account_name_label =
					accountForm.find(field => field.name === "name")?.integration_label ?? "Name";
				if (
					accountInput.name.integration_id === undefined ||
					accountInput.name.name === undefined ||
					accountInput.name.name?.length === 0
				)
					return addError({ text: `'${account_name_label}' for account is required!` });

				let body = { lead_id: modal.lead_id };
				body.contact_data = leadInput;
				body.account_data = { ...accountInput, ...accountInput.name };
				if (emailForm.length) {
					let emails = [];
					emailForm.forEach(item => {
						emails.push({
							type: item.name,
							email_id: emailInput[item.name],
						});
					});
					body.emails = emails;
				}
				if (phoneNumberForm.length) {
					let phoneNumbers = [];
					phoneNumberForm.forEach(item => {
						phoneNumbers.push({
							type: item.name,
							phone_number: phoneInput[item.name],
						});
					});
					body.phone_numbers = phoneNumbers;
				}

				exportContact(
					{
						...body,
						account_data: {
							...body.account_data,
							...(Object.keys(body.account_data).includes("size") && {
								size: body.account_data.size === null ? "" : body.account_data.size,
							}),
							...(Object.keys(body.account_data).includes("zipcode") && {
								zipcode:
									body.account_data.zipcode === null ? "" : body.account_data.zipcode,
							}),
						},
					},
					{
						onSuccess: () => {
							addSuccess(`Successfully exported lead as Zoho contact`);
							if (refetch && typeof refetch === "function") refetch();
							onClose();
						},
						onError: err => {
							addError({
								text: err?.response?.data?.msg ?? "Error occured while exporting lead",
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
						},
					}
				);
				break;
			}
		}
	};

	const showPreview = () => {
		switch (exportAs) {
			case EXPORT_AS.LEAD:
				return (
					<ExportAsLead
						modal={modal}
						leadInput={leadInput}
						setLeadInput={setLeadInput}
						accountInput={accountInput}
						setAccountInput={setAccountInput}
						emailInput={emailInput}
						setEmailInput={setEmailInput}
						phoneInput={phoneInput}
						setPhoneInput={setPhoneInput}
						leadForm={leadForm}
						setLeadForm={setLeadForm}
						accountForm={accountForm}
						setAccountForm={setAccountForm}
						emailForm={emailForm}
						setEmailForm={setEmailForm}
						phoneNumberForm={phoneNumberForm}
						setPhoneNumberForm={setPhoneNumberForm}
					/>
				);
			case EXPORT_AS.CONTACT:
				return (
					<ExportAsContact
						modal={modal}
						leadInput={leadInput}
						setLeadInput={setLeadInput}
						accountInput={accountInput}
						setAccountInput={setAccountInput}
						emailInput={emailInput}
						setEmailInput={setEmailInput}
						phoneInput={phoneInput}
						setPhoneInput={setPhoneInput}
						leadForm={leadForm}
						setLeadForm={setLeadForm}
						accountForm={accountForm}
						setAccountForm={setAccountForm}
						emailForm={emailForm}
						setEmailForm={setEmailForm}
						phoneNumberForm={phoneNumberForm}
						setPhoneNumberForm={setPhoneNumberForm}
					/>
				);
		}
	};

	return (
		<Modal
			isModal={modal}
			className={styles.preview}
			onClose={onClose}
			showCloseButton
			disableOutsideClick
		>
			<div className={styles.headingText}>Export to Zoho</div>
			<div className={styles.inputGroup}>
				<Label>Export as</Label>
				<Select
					value={exportAs}
					setValue={setExportAs}
					options={EXPORT_OPTIONS}
					numberOfOptionsVisible="3"
					placeholder="Select here"
				></Select>
			</div>
			<div className={styles.body}>{showPreview()}</div>
			<div className={styles.buttonSave}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					width="100%"
					height="49px"
					loading={exportLeadLoading || exportContactLoading}
					disabled={previewLeadLoading || previewContactLoading}
					onClick={e => handleSave()}
				>
					<div>Export To Zoho</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default LeadExportModal;
