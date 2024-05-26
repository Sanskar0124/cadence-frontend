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
	url,
	setUrl,
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
	const handleFetch = () => {
		let sf_id = url.substring(url.indexOf(modal === "lead" ? "Lead/" : "Contact/"));
		sf_id = sf_id.substring(modal === "lead" ? 5 : 8);
		sf_id = sf_id.substring(0, sf_id.indexOf("/"));

		let body;

		if (buildFormFor === VIEWS.LEAD) {
			let references = [];
			form.forEach(item => {
				if (item.reference_field_name) {
					references.push({
						reference_to: item.reference_to,
						key: item.salesforce_field,
						reference_field_name: item.reference_field_name,
					});
				}
			});
			body = {
				id: sf_id,
				type: modal,
				references,
			};
		} else {
			let references_account = [];
			let references_contact = [];

			form.forEach(item => {
				if (item.reference_field_name) {
					if (item.sobject === VIEWS.ACCOUNT) {
						references_account.push({
							reference_to: item.reference_to,
							key: item.salesforce_field,
							reference_field_name: item.reference_field_name,
						});
					} else {
						references_contact.push({
							reference_to: item.reference_to,
							key: item.salesforce_field,
							reference_field_name: item.reference_field_name,
						});
					}
				}
			});
			body = {
				id: sf_id,
				type: modal,
				...(references_account.length > 0 && { references_account }),
				...(references_contact.length > 0 && { references_contact }),
			};
		}
		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				if (buildFormFor === VIEWS.LEAD) {
					setFields(prev => ({ ...prev, [VIEWS.LEAD]: data }));
				} else {
					fields[VIEWS.CONTACT] = data.contact;
					fields[VIEWS.ACCOUNT] = data.account;
					setFields(prev => ({
						...prev,
						[VIEWS.CONTACT]: data.contact,
						[VIEWS.ACCOUNT]: data.account,
					}));
				}
				onClose();
				setShowCustomObjectFormModal(true);
			},
			onError: err => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	useEffect(() => {
		if (buildFormFor === "lead") {
			if (customObj?.lead_custom_object != null) {
				setForm(customObj?.lead_custom_object[0].form);
			} else {
				setForm([]);
			}
		} else {
			if (customObj?.contact_custom_object != null) {
				setForm(customObj?.contact_custom_object[0].form);
			} else {
				setForm([]);
			}
		}
	}, [buildFormFor, customObj]);
	useEffect(() => {
		setUrl("");
	}, []);
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
					placeholder="eg : https://ringover.lightning.force.com/lightning/r/Lead/00Q7T000001tIafUAE/view "
				/>
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
