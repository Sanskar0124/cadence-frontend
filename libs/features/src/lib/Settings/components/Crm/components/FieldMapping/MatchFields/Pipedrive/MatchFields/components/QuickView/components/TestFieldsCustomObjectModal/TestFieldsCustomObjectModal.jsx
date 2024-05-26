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
		fetchCustomObjectDetailsPipedrive,
		fetchCustomObjectDetailsPipedriveLoading,
	} = useCustomObject(true);
	const { addError } = useContext(MessageContext);
	const handleFetch = () => {
		let pd_id = url.substring(url.indexOf("/person/"));
		pd_id = pd_id.substring(8, pd_id.includes("?") ? pd_id.indexOf("?") : pd_id.length);

		let body;
		// let references_person = [];
		// let references_organization = [];

		// form.forEach(item => {
		// 	if (item.reference_field_name) {
		// 		if (item.pobject === VIEWS.PERSON) {
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
			id: pd_id,
			// type: modal,
			// ...(references_person.length > 0 && { references_person }),
			// ...(references_organization.length > 0 && { references_organization }),
		};
		// }
		if (!pd_id) {
			return addError({ text: "person_id cannot be empty" });
		}
		fetchCustomObjectDetailsPipedrive(body, {
			onSuccess: data => {
				fields[VIEWS.PERSON] = data.data;
				fields[VIEWS.ORGANIZATION] = data.data.org_id != null ? data.data.org_id : {};
				setFields(prev => ({
					...prev,
					[VIEWS.PERSON]: data.data,
					[VIEWS.ORGANIZATION]: data.data.org_id != null ? data.data.org_id : {},
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
		// if (buildFormFor === "lead") {
		// 	if (customObj?.lead_custom_object != null) {
		// 		setForm(customObj?.lead_custom_object[0].form);
		// 	} else {
		// 		setForm([]);
		// 	}
		// } else {
		if (customObj?.person_custom_object != null) {
			setForm(customObj?.person_custom_object[0].form);
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
					placeholder="eg : https://ringovertest-sandbox.pipedrive.com/person/1"
				/>
			</div>
			<ThemedButton
				className={styles.fetchButton}
				loading={fetchCustomObjectDetailsPipedriveLoading}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => handleFetch()}
			>
				Test for {modal}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsCustomObjectModal;
