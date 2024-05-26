import React, { useState, useEffect, useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";

//components
import { Title } from "@cadence-frontend/components";
import { ThemedButton, Input } from "@cadence-frontend/widgets";
import DnsTable from "./components/DnsTable/DnsTable";
import { DeleteModal } from "@cadence-frontend/components";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import styles from "./CustomDomain.module.scss";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Common as COMMON_TRANSLATION,
	Notifications as NOTIFICATION_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { SEARCH_OPTIONS } from "../../../../../Search/constants";

function CustomDomain({
	isAdmin,
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
		//revalidate

		validateDomain,
	} = settingsDataAccess;
	const [customerDomain, setCustomerDomain] = useState(customDomainSettings?.domain_name);
	const [customDomain, setCustomDomain] = useState(customDomainSettings?.domain_name);

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
	const user = useRecoilValue(userInfo);

	const [customDomainValidating, setCustomDomainValidating] = useState();

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
			setHost(customDomainSettings?.domain_name?.split(".")[0]?.trim());
			setDomain(
				customDomainSettings?.domain_name?.split(".")?.slice(1)?.join(".")?.trim()
			);
		} else {
			setShowDelete(false);
			setValidation(false);
		}
	}, [customDomain, customDomainSettings]);

	const handleGenerateNewRecord = () => {
		if (!domain || !host || domain === "" || host === "") {
			addError({
				text: `${
					NOTIFICATION_TRANSLATION.ENTER_VALID_HOST[user?.language.toUpperCase()]
				}`,
			});
			setShowDnsTable(customDomainSettings?.domain_name ? true : false);
			setCustomDomain(customDomainSettings?.domain_name);
			setCustomerDomain(customDomainSettings?.domain_name);
			return;
		}
		if (`${host.trim()}.${domain.trim()}}` === customDomain) {
			return;
		}
		setCustomDomain(`${host.trim()}.${domain.trim()}`);
		setShowDnsTable(true);
	};

	const handleAddCustomDomain = () => {
		if (customDomain?.trim() === "" || !customDomain)
			addError({
				text: `${
					NOTIFICATION_TRANSLATION.ENTER_VALID_HOST[user?.language.toUpperCase()]
				}`,
			});
		if (updateDomain) {
			if (customDomain?.trim() === customDomainSettings.domain_name)
				addError({
					text: `${
						NOTIFICATION_TRANSLATION.GENERATE_NEW_VALUE[user?.language.toUpperCase()]
					}`,
				});
			else
				updateCustomDomain(
					{ domain_name: customDomain?.trim() },
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
							addSuccess(
								`${NOTIFICATION_TRANSLATION.DOMAIN_UPDATED[user?.language.toUpperCase()]}`
							);
						},
					}
				);
		} else
			addCustomDomain(
				{ domain_name: customDomain?.trim() },
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
						addSuccess(
							`${NOTIFICATION_TRANSLATION.DOMAIN_UPDATED[user?.language.toUpperCase()]}`
						);
					},
				}
			);
	};

	const handleCustomDomainValidation = async () => {
		setCustomDomainValidating(true);
		try {
			const res = await validateDomain();
			if (res.status === 200 && res?.data?.msg?.toLowerCase()?.includes("validated")) {
				addSuccess(res?.data?.msg);
				setValidation(true);
			}
		} catch (err) {
			setValidation(false);
			addError({
				text: err?.response?.data?.msg,
				desc: err?.response?.data?.error,
				cId: err?.response?.data?.correlationId,
			});
		} finally {
			setCustomDomainValidating(false);
		}
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
		<div className={styles.container} id={SEARCH_OPTIONS.DOMAIN_VERIFICATION}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.DOMAIN_VERIFICATION[user?.language?.toUpperCase()]}</h2>
				<p>
					{
						COMMON_TRANSLATION.CREATE_AND_MANAGE_A_CUSTOM_DOMAIN[
							user?.language?.toUpperCase()
						]
					}
				</p>
				<div className={styles.helpLinks}>
					<a
						href="https://www.loom.com/share/afc99a18204946e59fc8fa697d2df3b2"
						target="_blank"
					>
						{
							SETTINGS_TRANSLATION.NEED_HELP_TO_SETUP_CUSTOM_DOMAIN[
								user?.language?.toUpperCase()
							]
						}
					</a>
				</div>
			</div>
			<div className={styles.settings}>
				<div className={styles.setting}>
					<h2>
						{COMMON_TRANSLATION.SETUP_YOUR_CUSTOM_DOMAIN[user?.language?.toUpperCase()]}
					</h2>
					<p>
						{COMMON_TRANSLATION.ADD_THE_FOLLOWING_DETAILS[user?.language?.toUpperCase()]}
						<br />
						{COMMON_TRANSLATION.DEFAULT_TRACKING_LINK[user?.language?.toUpperCase()]}
					</p>
					<div className={styles.domainInputsContainer}>
						<span>
							{COMMON_TRANSLATION.ENTER_DOMAIN_NAME[user?.language?.toUpperCase()]}
						</span>
						<Input
							value={domain}
							setValue={setDomain}
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
						<span>
							{COMMON_TRANSLATION.ENTER_HOST_NAME[user?.language?.toUpperCase()]}
						</span>
						<Input
							value={host}
							setValue={setHost}
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
						<span>
							{COMMON_TRANSLATION.HOST_NAME_RECORD_TYPE[user?.language?.toUpperCase()]}
						</span>
						<Input
							value={"CNAME"}
							// setValue={setCustomerDomain}
							disabled={true}
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							onClick={handleGenerateNewRecord}
							width="fit-content"
						>
							<div>
								{COMMON_TRANSLATION.GENERATE_NEW_VALUE[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
					</div>
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
						handleCustomDomainValidation={handleCustomDomainValidation}
						handleDeleteDomain={handleDeleteDomain}
						validation={validation}
						customDomainValidating={customDomainValidating}
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
