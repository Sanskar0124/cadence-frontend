import { useContext, useEffect, useState } from "react";
import { useLeadExportHubspot } from "@cadence-frontend/data-access";

import styles from "./LeadExportModal.module.scss";
import { Modal, Skeleton, Title } from "@cadence-frontend/components";
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

//components
import AdvanceSelect from "./components/AdvanceSelect/AdvanceSelect";
import { HubspotBox } from "@cadence-frontend/icons";

const LeadExportModal = ({ modal, setModal, refetch }) => {
	const {
		previewContact,
		previewContactLoading,
		searchHubspotCompanies,
		searchCompaniesLoading,
		exportContact,
		exportContactLoading,
	} = useLeadExportHubspot();
	const { addError, addSuccess } = useContext(MessageContext);

	const [contactInput, setContactInput] = useState({});
	const [companyInput, setCompanyInput] = useState({});
	const [emailInput, setEmailInput] = useState({});
	const [phoneInput, setPhoneInput] = useState({});
	const [contactForm, setContactForm] = useState([]);
	const [companyForm, setCompanyForm] = useState([]);
	const [emailForm, setEmailForm] = useState([]);
	const [phoneNumberForm, setPhoneNumberForm] = useState([]);
	const [hubspotCompanies, setHubspotCompanies] = useState([]);
	const [seachCompany, setSearchCompany] = useState("");
	const [defaultNewOption, setDefaultNewOption] = useState(true);

	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
	};

	const handleSave = () => {
		const first_name_label =
			contactForm.find(field => field.name === "first_name")?.integration_label ??
			"Firstname";
		if (contactInput.first_name === null || contactInput.first_name?.length === 0)
			return addError({ text: `'${first_name_label}' for contact is required!` });

		const company_name_label =
			companyForm.find(field => field.name === "name")?.integration_label ?? "Name";
		if (
			companyInput.name.integration_id === undefined ||
			companyInput.name.name === undefined ||
			companyInput.name.name?.length === 0
		)
			return addError({ text: `'${company_name_label}' for company is required!` });

		let body = { lead_id: modal.lead_id };
		body.contact_data = contactInput;
		body.company_data = { ...companyInput, ...companyInput.name };
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
				company_data: {
					...body.company_data,

					...(Object.keys(body.company_data).includes("zipcode") && {
						zipcode: body.company_data.zipcode === null ? "" : body.company_data.zipcode,
					}),

					...(Object.keys(body.company_data).includes("size") && {
						size: body.company_data.size === null ? "" : body.company_data.size,
					}),
				},
			},
			{
				onSuccess: () => {
					addSuccess(`Successfully exported lead as Hubspot contact`);
					if (refetch && typeof refetch === "function") refetch();
					onClose();
				},
				onError: err => {
					addError({
						text: err?.response.data?.msg ?? "Error occured while exporting lead",
						desc: err?.response.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	const renderInputGroup = (item, index, input, setInput) => {
		switch (item.type) {
			case "input_box":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Input
							type={item.input_type}
							disabled={!item.editable}
							placeholder="Type here"
							value={input}
							setValue={setInput}
							name={item.name}
							className={`${!item.editable && styles.disabled}`}
						/>
					</>
				);
			case "dropdown":
				return (
					<>
						<Label>{item.integration_label}</Label>
						<Select
							placeholder="Select here"
							value={input}
							setValue={setInput}
							name={item.name}
							disabled={!item.editable}
							className={`${!item.editable && styles.disabled}`}
							menuOnTop={Math.floor(index / 3) >= 1 ? true : false}
							numberOfOptionsVisible="3"
							options={item?.possible_values?.map(item => ({
								label: item.label,
								value: item.value,
							}))}
						></Select>
					</>
				);
		}
	};

	const inputFunc = () => {
		if (contactForm)
			contactForm.forEach(item => {
				const value = item.value;
				setContactInput(prev => ({
					...prev,
					[item.name]: value,
				}));
			});
		if (companyForm) {
			companyForm.forEach(item => {
				const value = item.value;
				setCompanyInput(prev => ({
					...prev,
					[item.name]: value,
				}));
				if (item.type === "advanced_dropdown") setSearchCompany(value ?? "");
			});
		}
		if (emailForm)
			emailForm.forEach(item => {
				const value = item.value;
				setEmailInput(prev => ({
					...prev,
					[item.name]: value,
				}));
			});
		if (phoneNumberForm)
			phoneNumberForm.forEach(item => {
				const value = item.value;
				setPhoneInput(prev => ({
					...prev,
					[item.name]: value,
				}));
			});
	};

	useEffect(() => {
		if (modal)
			previewContact(modal.lead_id, {
				onSuccess: data => {
					setContactForm(data?.contact_fields);
					setCompanyForm(data?.company_fields);
					setPhoneNumberForm(data?.phone_numbers);
					setEmailForm(data?.emails);
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			});

		return () => {
			setContactInput({});
			setCompanyInput({});
			setSearchCompany("");
			setHubspotCompanies([]);
			setDefaultNewOption(true);
		};
	}, [modal]);

	useEffect(() => {
		inputFunc();
	}, [contactForm, companyForm, emailForm, phoneNumberForm]);

	useEffect(() => {
		if (seachCompany) {
			const timeoutId = setTimeout(() => {
				let body = { company: { ...companyInput, name: seachCompany } };
				searchHubspotCompanies(body, {
					onSuccess: data => {
						let options = [];
						if (data?.length)
							data?.forEach(item => {
								options.push({
									label: (
										<div className={styles.element}>
											{item.name} <HubspotBox size="1.5rem" />
										</div>
									),
									value: { name: item.name, integration_id: item.id },
									search: item.name,
									custom: true,
								});
							});
						else if (defaultNewOption)
							options.push({
								label: body.company.name,
								value: { name: body.company.name, integration_id: "" },
								search: body.company.name.toLowerCase(),
							});
						setDefaultNewOption(false);
						setHubspotCompanies(options);
						if (options?.length)
							setCompanyInput(prev => ({ ...prev, name: options[0].value }));
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				});
			}, 500);
			return () => clearTimeout(timeoutId);
		}
	}, [seachCompany]);

	return (
		<Modal
			isModal={modal}
			className={styles.preview}
			onClose={onClose}
			showCloseButton
			disableOutsideClick
		>
			<div className={styles.headingText}>Export to Hubspot</div>
			<div className={styles.body}>
				<div className={styles.section}>
					<Title size={16}>Contact Details</Title>
					<div className={styles.form}>
						{previewContactLoading
							? [...Array(21).keys()].map(key => (
									<Skeleton key={key} className={styles.placeholder} />
							  ))
							: contactForm.map(
									(item, i) =>
										item.type !== "" && (
											<div key={`field_${i}`} className={styles.inputGroup}>
												{renderInputGroup(item, i, contactInput, setContactInput)}
											</div>
										)
							  )}
					</div>
				</div>
				{!previewContactLoading && companyForm.length && (
					<div className={styles.section}>
						<Title size={16}>Company Details</Title>
						<div className={styles.form}>
							{companyForm.map(
								(item, i) =>
									item.type !== "" &&
									// Here this part of code is written considering that only company name is of type advanced_dropdown
									(item.type === "advanced_dropdown" ? (
										<div className={styles.inputGroup}>
											<Label>{item.integration_label}</Label>
											<AdvanceSelect
												name="name"
												placeholder="Select name or add name"
												value={companyInput}
												setValue={setCompanyInput}
												options={hubspotCompanies}
												setOptions={setHubspotCompanies}
												loading={searchCompaniesLoading}
												onSearchTextChange={value => setSearchCompany(value)}
												numberOfOptionsVisible="3"
											/>
										</div>
									) : (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, companyInput, setCompanyInput)}
										</div>
									))
							)}
						</div>
					</div>
				)}
				{!previewContactLoading && emailForm?.length > 0 && (
					<div className={styles.section}>
						<Title size={16}>Emails</Title>
						<div className={styles.form}>
							{emailForm.map(
								(item, i) =>
									item.type !== "" && (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, emailInput, setEmailInput)}
										</div>
									)
							)}
						</div>
					</div>
				)}
				{!previewContactLoading && phoneNumberForm?.length > 0 && (
					<div className={styles.section}>
						<Title size={16}>Phone Numbers</Title>
						<div className={styles.form}>
							{phoneNumberForm.map(
								(item, i) =>
									item.type !== "" && (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, phoneInput, setPhoneInput)}
										</div>
									)
							)}
						</div>
					</div>
				)}
			</div>
			<div className={styles.buttonSave}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					width="100%"
					height="49px"
					loading={exportContactLoading}
					disabled={previewContactLoading}
					onClick={e => handleSave()}
				>
					<div>Export To Hubspot</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default LeadExportModal;
