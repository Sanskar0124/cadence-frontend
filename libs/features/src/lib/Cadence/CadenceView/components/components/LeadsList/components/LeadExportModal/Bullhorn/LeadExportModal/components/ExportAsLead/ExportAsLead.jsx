import { useEffect, useContext, useState } from "react";
import { useLeadExportBullhorn } from "@cadence-frontend/data-access";

import styles from "./ExportAsLead.module.scss";
import { Skeleton, Title } from "@cadence-frontend/components";
import { Label, Input, Select } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import AdvanceSelect from "../AdvanceSelect/AdvanceSelect";
import { Bullhorn } from "@cadence-frontend/icons";

const ExportAsLead = ({
	modal,
	leadInput,
	setLeadInput,
	accountInput,
	setAccountInput,
	emailInput,
	setEmailInput,
	phoneInput,
	setPhoneInput,
	leadForm,
	setLeadForm,
	accountForm,
	setAccountForm,
	emailForm,
	setEmailForm,
	phoneNumberForm,
	setPhoneNumberForm,
	setCountries,
	exportAs,
}) => {
	const {
		previewLead,
		previewLeadLoading,
		searchBullhornAccounts,
		searchBullhornAccountsLoading,
	} = useLeadExportBullhorn();
	const { addError } = useContext(MessageContext);

	const [seachAccount, setSearchAccount] = useState("");
	const [salesforceAccounts, setSalesforceAccounts] = useState([]);
	const [defaultNewOption, setDefaultNewOption] = useState(true);

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
							menuOnTop={Math.floor(index / 3) >= 2 ? true : false}
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
		if (leadForm)
			leadForm.forEach(item => {
				const value = item.value;
				setLeadInput(prev => ({
					...prev,
					[item.name]: value,
				}));
			});
		if (accountForm) {
			accountForm.forEach(item => {
				const value = item.value;
				setAccountInput(prev => ({
					...prev,
					[item.name]: value,
				}));
				if (item.type === "advanced_dropdown") setSearchAccount(value ?? "");
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
			previewLead(modal.lead_id, {
				onSuccess: data => {
					setLeadForm(data?.lead_fields);
					setAccountForm(data?.account_fields);
					setPhoneNumberForm(data?.phone_numbers);
					setEmailForm(data?.emails);
					setCountries(data?.country_list);
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			});

		return () => {
			setLeadInput({});
			setAccountInput({});
			setSearchAccount("");
			setSalesforceAccounts([]);
		};
	}, [modal]);

	useEffect(() => {
		inputFunc();
	}, [leadForm, accountForm, emailForm, phoneNumberForm, exportAs]);

	useEffect(() => {
		if (seachAccount) {
			const timeoutId = setTimeout(() => {
				let body = { account: { ...accountInput, name: seachAccount } };
				searchBullhornAccounts(body, {
					onSuccess: data => {
						let options = [];
						if (data?.length)
							data?.forEach(item => {
								options.push({
									label: (
										<div className={styles.element}>
											{item.name} <Bullhorn size="1.5rem" />
										</div>
									),
									value: { name: item.name, integration_id: item.id },
									search: item.name,
									custom: true,
								});
							});
						else if (defaultNewOption)
							options.push({
								label: body.account.name,
								value: { name: body.account.name, integration_id: "" },
								search: body.account.name.toLowerCase(),
							});
						setDefaultNewOption(false);
						setSalesforceAccounts(options);
						if (options?.length)
							setAccountInput(prev => ({ ...prev, name: options[0].value }));
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
	}, [seachAccount]);

	return (
		<>
			<div className={styles.section}>
				<Title size={16}>Lead Details</Title>
				<div className={styles.form}>
					{previewLeadLoading
						? [...Array(18).keys()].map(key => (
								<Skeleton key={key} className={styles.placeholder} />
						  ))
						: leadForm.map(
								(item, i) =>
									item.type !== "" && (
										<div key={`field_${i}`} className={styles.inputGroup}>
											{renderInputGroup(item, i, leadInput, setLeadInput)}
										</div>
									)
						  )}
				</div>
			</div>
			{!previewLeadLoading && accountForm.length > 0 && (
				<div className={styles.section}>
					<Title size={16}>Account Details</Title>
					<div className={styles.form}>
						{accountForm.map(
							(item, i) =>
								item.type !== "" &&
								// Here this part of code is written considering that only company name is of type advanced_dropdown
								(item.type === "advanced_dropdown" ? (
									<div className={styles.inputGroup}>
										<Label>{item.integration_label}</Label>
										<AdvanceSelect
											name="name"
											placeholder="Select name or add name"
											value={accountInput}
											setValue={setAccountInput}
											options={salesforceAccounts}
											setOptions={setSalesforceAccounts}
											loading={searchBullhornAccountsLoading}
											onSearchTextChange={value => setSearchAccount(value)}
											numberOfOptionsVisible="3"
										/>
									</div>
								) : (
									<div key={`field_${i}`} className={styles.inputGroup}>
										{renderInputGroup(item, i, accountInput, setAccountInput)}
									</div>
								))
						)}
					</div>
				</div>
			)}
			{!previewLeadLoading && emailForm?.length > 0 && (
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
			{!previewLeadLoading && phoneNumberForm?.length > 0 && (
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
		</>
	);
};

export default ExportAsLead;
