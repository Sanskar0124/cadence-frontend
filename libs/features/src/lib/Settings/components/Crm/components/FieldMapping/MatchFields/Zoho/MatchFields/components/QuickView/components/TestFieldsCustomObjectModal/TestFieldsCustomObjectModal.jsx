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
		let zfm_id =
			url.split("/")[url.split("/").length - 1] ||
			url.split("/")[url.split("/").length - 2];

		let body;

		if (buildFormFor === VIEWS.LEAD) {
			body = {
				id: zfm_id,
				type: modal,
			};
		} else {
			body = {
				id: zfm_id,
				type: modal,
			};
		}

		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				if (buildFormFor === VIEWS.LEAD) {
					setFields(prev => ({ ...prev, [VIEWS.LEAD]: data }));
				} else {
					fields[VIEWS.CONTACT] = data.contact ?? data;
					if (data?.account) fields[VIEWS.ACCOUNT] = data.account;
					setFields(prev => ({
						...prev,
						[VIEWS.CONTACT]: data.contact ?? data,
						...(data?.account && { [VIEWS.ACCOUNT]: data.account }),
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

	const getPlacholder = modal => {
		switch (modal) {
			case "lead":
				return "Leads";
			case "contact":
				return "Contacts";
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
					placeholder={`eg: https://crm.zoho.in/crm/org60019268588/tab/${getPlacholder(
						modal
					)}/445725000000263410/`}
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
