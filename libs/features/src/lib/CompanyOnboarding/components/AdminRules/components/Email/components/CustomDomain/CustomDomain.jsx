import React, { useState, useEffect, useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title } from "@cadence-frontend/components";
import { ThemedButton, Input } from "@cadence-frontend/widgets";
import DnsTable from "./components/DnsTable/DnsTable";
import { DeleteModal } from "@cadence-frontend/components";

import styles from "./CustomDomain.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

function CustomDomain({
	settingsDataAccess,
	customDomainSettings,
	setCustomDomainSettings,
}) {
	const { addError, addSuccess } = useContext(MessageContext);
	const {
		//customDomain
		//add
		addCustomDomain,
		addCustomDomainLoading,
		//update
		updateCustomDomain,
		updateCustomDomainLoading,
		//delete
		deleteCustomDomain,
		deleteCustomDomainLoading,
	} = settingsDataAccess;
	const [customerDomain, setCustomerDomain] = useState(customDomainSettings?.domain_name);
	const [customDomain, setCustomDomain] = useState(customDomainSettings?.domain_name);
	const user = useRecoilValue(userInfo);

	const [showDnsTable, setShowDnsTable] = useState(
		customDomainSettings?.domain_name ? true : false
	);
	const [updateDomain, setUpdateDomain] = useState(
		customDomainSettings?.domain_name ? true : false
	);
	const [deleteModal, setDeleteModal] = useState(false);
	const [validation, setValidation] = useState(customDomainSettings?.domain_status);
	const [showDelete, setShowDelete] = useState(
		customDomainSettings?.domain_name ? true : false
	);

	const [domain, setDomain] = useState();
	const [host, setHost] = useState();
	useEffect(() => {
		if (customDomainSettings?.domain_name) {
			if (
				customDomainSettings.domain_name === customDomain &&
				customDomainSettings?.domain_status
			) {
				setValidation(true);
			} else {
				setValidation(false);
			}
			if (customDomainSettings.domain_name === customDomain) setShowDelete(true);
			else setShowDelete(false);
		} else {
			setShowDelete(false);
			setValidation(false);
		}
	}, [customDomain, customDomainSettings]);

	const handleGenerateNewRecord = () => {
		if (!domain || !host || domain === "" || host === "") {
			addError({ text: "Please Enter a valid host name" });
			setShowDnsTable(customDomainSettings?.domain_name ? true : false);
			setCustomDomain(customDomainSettings?.domain_name);
			setCustomerDomain(customDomainSettings?.domain_name);
			return;
		}
		setCustomDomain(`${host}.${domain}`);
		setShowDnsTable(true);
	};

	const handleAddCustomDomain = () => {
		if (customDomain === "" || !customDomain)
			addError({ text: "Please Enter a valid host name" });
		if (updateDomain) {
			if (customDomain === customDomainSettings.domain_name)
				addError({ text: "Please Generate a new Value before updating" });
			else
				updateCustomDomain(
					{ domain_name: customDomain },
					{
						onError: err => {
							addError({
								text: err?.response?.data?.msg,
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
						},
						onSuccess: data => {
							setCustomDomainSettings(data.data);
							addSuccess("Successfully Updated Domain");
						},
					}
				);
		} else
			addCustomDomain(
				{ domain_name: customDomain },
				{
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
					onSuccess: data => {
						setCustomDomainSettings(data.data);
						setUpdateDomain(true);
						addSuccess("Successfully Updated Domain");
					},
				}
			);
	};

	const handleDeleteModalClose = () => {
		setDeleteModal(false);
	};

	const handleDeleteDomain = () => {
		if (customDomainSettings?.domain_name) {
			deleteCustomDomain(
				{},
				{
					onSuccess: () => {
						setShowDnsTable(false);
						setCustomDomainSettings({});
						setCustomDomain();
						setValidation(false);
						setUpdateDomain(false);
						addSuccess("Successfully Deleted Domain");
					},
					onError: err => {
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
					},
				}
			);
		} else {
			addError({ text: "Cannot Delete Domain" });
		}
	};

	return (
		<div className={styles.settingsTypeContainer} id="custom_domain">
			<div className={styles.header}>
				<Title size="1.3rem">
					{COMMON_TRANSLATION.DOMAIN_VERIFICATION[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{
						COMMON_TRANSLATION.CREATE_AND_MANAGE_CUSTOM_DOMAIN[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<div className={styles.right}>
				<Title className={styles.title} size="1.1rem">
					{COMMON_TRANSLATION.SETUP_YOUR_CUSTOM_DOMAIN[user?.language?.toUpperCase()]}
				</Title>
				<div className={styles.description}>
					{COMMON_TRANSLATION.ADD_THE_FOLLOWING_DETAILS[user?.language?.toUpperCase()]}
				</div>
				<div className={styles.domainInputsContainer}>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.ENTER_DOMAIN_NAME[user?.language?.toUpperCase()]}
					</Title>
					<Input
						value={domain}
						setValue={setDomain}
						containerClassName={styles.inputContainer}
						className={styles.input}
						theme="WHITE_BORDERED"
					/>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.ENTER_HOST_NAME[user?.language?.toUpperCase()]}
					</Title>
					<Input
						value={host}
						setValue={setHost}
						containerClassName={styles.inputContainer}
						className={styles.input}
						theme="WHITE_BORDERED"
					/>
					<Title className={styles.title} size="1.1rem">
						{COMMON_TRANSLATION.HOST_NAME_RECORD_TYPE[user?.language?.toUpperCase()]}
					</Title>
					<Input
						value={"CNAME"}
						// setValue={setCustomerDomain}
						disabled={true}
						containerClassName={styles.inputContainer}
						className={styles.input}
						theme="WHITE_BORDERED"
					/>
					<ThemedButton
						theme="GREY"
						onClick={handleGenerateNewRecord}
						width="fit-content"
					>
						<div>
							{COMMON_TRANSLATION.GENERATE_NEW_VALUE[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
				<div className={styles.dnsTableContainer}>
					<DnsTable
						show={showDnsTable}
						domain={domain}
						host={host}
						customDomain={customDomain}
						updateDomain={updateDomain}
						customDomainSettings={customDomainSettings}
						handleAddCustomDomain={handleAddCustomDomain}
						handleDeleteDomain={handleDeleteDomain}
						validation={validation}
						setDeleteModal={setDeleteModal}
						showDelete={showDelete}
						loading={
							customDomainSettings?.domain_name
								? updateCustomDomainLoading
								: addCustomDomainLoading
						}
					/>
				</div>
			</div>
			<DeleteModal
				modal={deleteModal}
				item={"Custom Tracking Domain"}
				handleClose={handleDeleteModalClose}
				onDelete={handleDeleteDomain}
			/>
		</div>
	);
}

export default CustomDomain;
