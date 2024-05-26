import React, { useContext, useEffect, useState } from "react";
import styles from "./TestFieldsCustomObjectModal.module.scss";

import { Modal } from "@cadence-frontend/components";
import { ThemedButton, Input } from "@cadence-frontend/widgets";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCustomObject } from "@cadence-frontend/data-access";
import { VIEWS } from "../../../../constants";
const TestFieldsCustomObjectModal = ({
	modal,
	buildFormFor,
	setModal,
	fields,
	setFields,
	setShowCustomObjectFormModal,
	setUrl,
	url,
}) => {
	const [form, setForm] = useState();

	const onClose = () => {
		setModal(null);
	};
	const {
		customObj,
		loading,
		fetchCustomObjectDetails,
		fetchCustomObjectDetailsLoading,
	} = useCustomObject(true);
	const { addError } = useContext(MessageContext);

	function isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch (err) {
			return false;
		}
	}
	const getLeadsID = url => {
		if (isValidUrl(url)) {
			const params = new URLSearchParams(new URL(url).search);
			const lastParamKey = Array.from(params.keys()).pop();
			return params.get(lastParamKey) ?? "";
		} else return "";
	};

	const handleFetch = () => {
		if (!url.trim() || !getLeadsID(url))
			return addError({ text: `Enter a valid ${modal} URL.` });

		let body;

		body = {
			id: getLeadsID(url),
			type: modal === VIEWS.CONTACT ? VIEWS.CLIENT_CONTACT : modal,
		};

		if (modal === VIEWS.LEAD) {
			body.lead_fields = form
				?.filter(i => i?.bullhorn_endpoint === VIEWS.LEAD)
				?.map(i => i?.bullhorn_field)
				?.toString();

			if (
				form?.filter(i => i?.bullhorn_endpoint === VIEWS.CLIENT_CORPORATION)?.length > 0
			)
				body.account_fields = form
					?.filter(i => i?.bullhorn_endpoint === VIEWS.CLIENT_CORPORATION)
					?.map(i => i?.bullhorn_field)
					?.toString();
		}

		if (modal === VIEWS.CONTACT) {
			body.lead_fields = form
				?.filter(i => i?.bullhorn_endpoint === VIEWS.CLIENT_CONTACT)
				?.map(i => i?.bullhorn_field)
				?.toString();

			if (
				form?.filter(i => i?.bullhorn_endpoint === VIEWS.CLIENT_CORPORATION)?.length > 0
			)
				body.account_fields = form
					?.filter(i => i?.bullhorn_endpoint === VIEWS.CLIENT_CORPORATION)
					?.map(i => i?.bullhorn_field)
					?.toString();
		}

		if (modal === VIEWS.CANDIDATE) {
			body.lead_fields = form
				?.filter(i => i?.bullhorn_endpoint === VIEWS.CANDIDATE)
				?.map(i => i?.bullhorn_field)
				?.toString();
		}

		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				if (buildFormFor === VIEWS.LEAD) {
					if (
						Object.keys(data).includes("account") &&
						Object.keys(data).includes("lead")
					) {
						fields[VIEWS.ACCOUNT] = data[VIEWS.ACCOUNT];
						fields[VIEWS.LEAD] = data[VIEWS.LEAD];
						setFields(prev => ({
							...prev,
							[VIEWS.LEAD]: data[VIEWS.LEAD],
							[VIEWS.ACCOUNT]: data[VIEWS.ACCOUNT],
						}));
					} else {
						fields[VIEWS.LEAD] = data[VIEWS.LEAD] ?? data;
						setFields(prev => ({
							...prev,
							[VIEWS.LEAD]: data[VIEWS.LEAD] ?? data,
						}));
					}
				} else if (buildFormFor === VIEWS.CONTACT) {
					fields[VIEWS.CONTACT] = data.contact ?? data;
					fields[VIEWS.ACCOUNT] = data.account ?? data.Account_Name;
					setFields(prev => ({
						...prev,
						[VIEWS.CONTACT]: data.contact ?? data,
						[VIEWS.ACCOUNT]: data.account ?? data.Account_Name,
					}));
				} else {
					fields[VIEWS.CANDIDATE] = data.candidate ?? data;
					setFields(prev => ({ ...prev, [VIEWS.CANDIDATE]: data.candidate ?? data }));
				}
				onClose();
				setShowCustomObjectFormModal(true);
			},
			onError: err => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	useEffect(() => {
		if (buildFormFor === VIEWS.LEAD) {
			if (customObj?.lead_custom_object != null) {
				setForm(customObj?.lead_custom_object[0].form);
			} else {
				setForm([]);
			}
		} else if (buildFormFor === VIEWS.CONTACT) {
			if (customObj?.contact_custom_object != null) {
				setForm(customObj?.contact_custom_object[0].form);
			} else {
				setForm([]);
			}
		} else {
			if (customObj?.candidate_custom_object != null) {
				setForm(customObj?.candidate_custom_object[0].form);
			} else {
				setForm([]);
			}
		}
	}, [buildFormFor, customObj]);

	useEffect(() => {
		setUrl("");
	}, []);

	const getPlacholder = modal => {
		switch (modal) {
			case VIEWS.LEAD:
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Lead&id=14156";
			case VIEWS.CONTACT:
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=ClientContact&id=14153";
			case VIEWS.ACCOUNT:
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=ClientContact&id=14153";
			case VIEWS.CANDIDATE:
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Candidate&id=14171";
		}
	};

	return (
		<Modal
			isModal={modal}
			disableOutsideClick={true}
			onClose={() => onClose()}
			className={styles.testFieldsModal}
			showCloseButton={true}
		>
			<div className={styles.header}>Test custom object form</div>
			<div className={styles.body}>
				<div>Enter {modal} URL</div>
				<Input
					value={url}
					setValue={setUrl}
					className={styles.urlInput}
					theme={InputThemes.WHITE_WITH_GREY_BORDER}
					placeholder={getPlacholder(modal)}
				/>

				<div className={styles.sideLink}>
					<a
						href={
							"https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107971-getting-the-url-of-contacts-leads-candidates-in-bullhorn-"
						}
						target="_blank"
						rel="noreferrer"
					>
						Need help?
					</a>
				</div>
			</div>
			<ThemedButton
				className={styles.fetchButton}
				loading={fetchCustomObjectDetailsLoading}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => handleFetch()}
			>
				Test for {modal}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsCustomObjectModal;
