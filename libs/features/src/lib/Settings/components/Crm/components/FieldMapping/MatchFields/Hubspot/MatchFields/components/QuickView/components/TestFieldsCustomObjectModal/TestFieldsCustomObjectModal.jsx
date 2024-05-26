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
		fetchCustomObjectDetailsHubspot,
		fetchCustomObjectDetailsHubspotLoading,
	} = useCustomObject(true);
	const { addError } = useContext(MessageContext);
	const handleFetch = () => {
		let hs_contact_id = url.substring(url.indexOf("/contact/"));
		hs_contact_id = hs_contact_id.substring(
			8,
			hs_contact_id.includes("?") ? hs_contact_id.indexOf("?") : hs_contact_id.length
		);

		const regex = /\/(\d+)$/;
		const hubspotContactID = url.match(regex);

		let body;
		// let references_person = [];
		// let references_organization = [];

		// form.forEach(item => {
		// 	if (item.reference_field_name) {
		// 		if (item.pobject === VIEWS.CONTACT) {
		// 			references_person.push({
		// 				reference_to: item.reference_to,
		// 				key: item.pipedrive_field,
		// 				reference_field_name: item.reference_field_name,
		// 			});
		// 		} else {
		// 			references_organization.push({
		// 				reference_to: item.reference_to,
		// 				key: item.pipedrive_field,
		// 				reference_field_name: item.reference_field_name,
		// 			});
		// 		}
		// 	}
		// });
		body = {
			id: hubspotContactID[1] || 201,
			properties: {
				contact_properties: form
					?.filter(i => i?.hubspot_endpoint === VIEWS.CONTACT)
					?.map(i => i?.hubspot_field)
					.toString()
					.concat(
						form?.filter(i => i?.hubspot_endpoint === VIEWS.CONTACT).length === 0
							? "associatedcompanyid"
							: ",associatedcompanyid"
					),

				company_properties: form
					?.filter(i => i?.hubspot_endpoint === VIEWS.COMPANY)
					?.map(i => i?.hubspot_field)
					.toString(),
			},
		};
		// }
		if (!body?.id) {
			return addError({ text: "contact_id cannot be empty" });
		}
		fetchCustomObjectDetailsHubspot(body, {
			onSuccess: data => {
				setFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: data?.properties,
					[VIEWS.COMPANY]:
						data?.properties?.associatedcompany != null
							? data?.properties?.associatedcompany
							: {},
				}));

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
		if (customObj?.contact_custom_object != null) {
			setForm(customObj?.contact_custom_object[0].form);
		} else {
			setForm([]);
		}
		// }
	}, [customObj]);
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
					placeholder="eg : https://app.hubspot.com/contacts/22824763/contact/{{contact_id}}"
				/>
			</div>
			<ThemedButton
				className={styles.fetchButton}
				loading={fetchCustomObjectDetailsHubspotLoading}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => handleFetch()}
			>
				Test for {modal}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsCustomObjectModal;
