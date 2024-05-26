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
		if (
			url.split("/").length < 4 ||
			(modal === VIEWS.LEAD && !url.includes("etn=lead")) ||
			(modal !== VIEWS.LEAD && !url.includes("etn=contact"))
		)
			return addError({ text: "Please enter a valid Url" });
		let d_id = url.substring(
			url.indexOf(modal === VIEWS.LEAD ? "etn=lead" : "etn=contact")
		);
		d_id = d_id.substring(modal === VIEWS.LEAD ? 9 : 12);
		if (d_id.split("=")[0] !== "id")
			return addError({ text: "Please enter a valid Url" });

		d_id = d_id.split("=")[1];

		let body;

		body = {
			id: d_id,
			type: modal,
		};
		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				console.log(data, "DataDyanmics");
				if (buildFormFor === VIEWS.LEAD) {
					setFields(prev => ({ ...prev, [VIEWS.LEAD]: data }));
				} else {
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
					desc: err?.response?.data?.error ?? "Please contact support",
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
					placeholder="eg : https://org2f89245a.crm12.dynamics.com/main.aspx?appid=2494eb17-13fb-ed11-8f6d-000d3a9598c7&pagetype=entityrecord&etn=lead&id=31a38ae0-4d0e-ea11-a813-000d3a1bbd52 "
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
