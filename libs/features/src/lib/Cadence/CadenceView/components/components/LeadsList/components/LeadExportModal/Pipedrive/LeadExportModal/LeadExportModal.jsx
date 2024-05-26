import { useContext, useEffect, useState } from "react";
import { useLeadExportPipedrive } from "@cadence-frontend/data-access";

import styles from "./LeadExportModal.module.scss";
import { Modal, Skeleton, Title } from "@cadence-frontend/components";
import { Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

//components
import AdvanceSelect from "./components/AdvanceSelect/AdvanceSelect";
import { PipedriveBox } from "@cadence-frontend/icons";

const LeadExportModal = ({ modal, setModal, refetch }) => {
	const {
		previewPerson,
		previewPersonLoading,
		searchPipedriveOrganizations,
		searchOrganizationsLoading,
		exportPerson,
		exportPersonLoading,
	} = useLeadExportPipedrive();
	const { addError, addSuccess } = useContext(MessageContext);

	const [personInput, setPersonInput] = useState({});
	const [organizationInput, setOrganizationInput] = useState({});
	const [emailInput, setEmailInput] = useState({});
	const [phoneInput, setPhoneInput] = useState({});
	const [personForm, setPersonForm] = useState([]);
	const [organizationForm, setOrganizationForm] = useState([]);
	const [emailForm, setEmailForm] = useState([]);
	const [phoneNumberForm, setPhoneNumberForm] = useState([]);
	const [pipedriveOrganizations, setPipedriveOrganizations] = useState([]);
	const [seachOrganization, setSearchOrganization] = useState("");
	const [defaultNewOption, setDefaultNewOption] = useState(true);

	const onClose = () => {
		if (setModal && typeof setModal === "function") setModal(false);
	};

	const handleSave = () => {
		const first_name_label =
			personForm.find(field => field.name === "first_name")?.integration_label ??
			"FirstName";
		if (personInput.first_name === null || personInput.first_name?.length === 0)
			return addError({ text: `'${first_name_label}' for person is required!` });

		const organization_name_label =
			organizationForm.find(field => field.name === "name")?.integration_label ?? "Name";
		if (
			organizationInput.name.integration_id === undefined ||
			organizationInput.name.name === undefined ||
			organizationInput.name.name?.length === 0
		)
			return addError({
				text: `'${organization_name_label}' for organization is required!`,
			});

		let body = { lead_id: modal.lead_id };
		body.person_data = personInput;
		body.organization_data = { ...organizationInput, ...organizationInput.name };
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

		exportPerson(
			{
				...body,
				organization_data: {
					...body.organization_data,
					integration_id: body.organization_data.integration_id?.toString(),
				},
			},
			{
				onSuccess: () => {
					addSuccess(`Successfully exported lead as Pipedrive person`);
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
	};

	const renderInputGroup = (item, index, input, setInput) => {
		switch (item.type) {
			case "input_box":
				return (
					<>
						<Label>{item.name}</Label>
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
						<Label>{item.name}</Label>
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
		if (personForm)
			personForm.forEach(item => {
				const value = item.value;
				setPersonInput(prev => ({
					...prev,
					[item.name]: value,
				}));
			});
		if (organizationForm) {
			organizationForm.forEach(item => {
				const value = item.value;
				setOrganizationInput(prev => ({
					...prev,
					[item.name]: value,
				}));
				if (item.type === "advanced_dropdown") setSearchOrganization(value ?? "");
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
			previewPerson(modal.lead_id, {
				onSuccess: data => {
					setPersonForm(data?.person_fields);
					setOrganizationForm(data?.organization_fields);
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
			setPersonInput({});
			setOrganizationInput({});
			setSearchOrganization("");
			setPipedriveOrganizations([]);
			setDefaultNewOption(true);
		};
	}, [modal]);

	useEffect(() => {
		inputFunc();
	}, [personForm, organizationForm, emailForm, phoneNumberForm]);

	useEffect(() => {
		if (seachOrganization) {
			const timeoutId = setTimeout(() => {
				let body = { organization: { ...organizationInput, name: seachOrganization } };
				searchPipedriveOrganizations(body, {
					onSuccess: data => {
						let options = [];
						if (data?.length)
							data?.forEach(item => {
								options.push({
									label: (
										<div className={styles.element}>
											{item.name} <PipedriveBox size="1.5rem" />
										</div>
									),
									value: { name: item.name, integration_id: item.id.toString() },
									search: item.name,
									custom: true,
								});
							});
						else if (defaultNewOption)
							options.push({
								label: body.organization.name,
								value: { name: body.organization.name, integration_id: "" },
								search: body.organization.name.toLowerCase(),
							});
						setDefaultNewOption(false);
						setPipedriveOrganizations(options);
						if (options?.length)
							setOrganizationInput(prev => ({ ...prev, name: options[0].value }));
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
	}, [seachOrganization]);

	return (
		<Modal
			isModal={modal}
			className={styles.preview}
			onClose={onClose}
			showCloseButton
			disableOutsideClick
		>
			<div className={styles.headingText}>Export to Pipedrive</div>
			<div className={styles.body}>
				<div className={styles.section}>
					<Title size={16}>Person Details</Title>
					<div className={styles.form}>
						{previewPersonLoading
							? [...Array(18).keys()].map(key => (
									<Skeleton key={key} className={styles.placeholder} />
							  ))
							: personForm.map(
									(item, i) =>
										item.type !== "" && (
											<div key={`field_${i}`} className={styles.inputGroup}>
												{renderInputGroup(item, i, personInput, setPersonInput)}
											</div>
										)
							  )}
						{!previewPersonLoading &&
							emailForm.map(
								(item, i) =>
									item.type !== "" && (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, emailInput, setEmailInput)}
										</div>
									)
							)}
						{!previewPersonLoading &&
							phoneNumberForm.map(
								(item, i) =>
									item.type !== "" && (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, phoneInput, setPhoneInput)}
										</div>
									)
							)}
					</div>
				</div>
				{!previewPersonLoading && organizationForm.length && (
					<div className={styles.section}>
						<Title size={16}>Organization Details</Title>
						<div className={styles.form}>
							{organizationForm.map(
								(item, i) =>
									item.type !== "" &&
									// Here this part of code is written considering that only organization name is of type advanced_dropdown
									(item.type === "advanced_dropdown" ? (
										<div className={styles.inputGroup}>
											<Label>{item.name}</Label>
											<AdvanceSelect
												name="name"
												placeholder="Select name or add name"
												value={organizationInput}
												setValue={setOrganizationInput}
												options={pipedriveOrganizations}
												setOptions={setPipedriveOrganizations}
												loading={searchOrganizationsLoading}
												onSearchTextChange={value => setSearchOrganization(value)}
												numberOfOptionsVisible="3"
											/>
										</div>
									) : (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, organizationInput, setOrganizationInput)}
										</div>
									))
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
					loading={exportPersonLoading}
					disabled={previewPersonLoading}
					onClick={e => handleSave()}
				>
					<div>Export To Pipedrive</div>
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default LeadExportModal;
