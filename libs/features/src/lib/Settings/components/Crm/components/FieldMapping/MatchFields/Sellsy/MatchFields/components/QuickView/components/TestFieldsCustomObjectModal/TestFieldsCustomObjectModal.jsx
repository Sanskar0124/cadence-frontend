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
		fetchCustomObjectDetails,
		fetchCustomObjectDetailsLoading,
	} = useCustomObject(true);
	const { addError } = useContext(MessageContext);
	const handleFetch = () => {
		if (url.split("/").length < 4 || url.indexOf("/peoples/") < 0)
			return addError({ text: "Please enter a valid Url" });
		let s_contact_id = url.substring(url.indexOf("/peoples/") + 9);
		s_contact_id = s_contact_id.substring(
			0,
			s_contact_id.indexOf("/") !== -1
				? s_contact_id.indexOf("/")
				: s_contact_id.indexOf("?") !== -1
				? s_contact_id.indexOf("?")
				: s_contact_id.length
		);
		if (!s_contact_id) return addError({ text: "Please enter a valid Url" });
		let body;
		body = {
			contact_id: s_contact_id,
			custom_object: form,
		};
		if (!body?.contact_id) {
			return addError({ text: "contact_id cannot be empty" });
		}

		fetchCustomObjectDetails(body, {
			onSuccess: data => {
				setFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: (() => {
						let obj = { ...(data?.contact ?? data) };
						if (Object.keys(obj).length === 0) return {};
						delete obj._embed;
						data?.contact?._embed
							? data?.contact?._embed.custom_fields?.forEach(
									i => (obj[i?.code] = i?.value)
							  )
							: data?._embed.custom_fields?.forEach(i => (obj[i?.code] = i?.value));
						obj["smart_tags"] =
							data?.contact?._embed?.smart_tags ?? data?._embed?.smart_tags ?? [];
						return obj;
					})(),
					[VIEWS.COMPANY]: (() => {
						let obj = { ...(data?.company ?? {}) };
						if (Object.keys(obj).length === 0) return {};
						delete obj._embed;
						data?.company?._embed &&
							data?.company?._embed.custom_fields?.forEach(
								i => (obj[i?.code] = i?.value)
							);
						obj["smart_tags"] = data?.company?._embed?.smart_tags ?? [];
						return obj;
					})(),
				}));

				onClose();
				setShowCustomObjectFormModal(true);
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	useEffect(() => {
		if (customObj?.contact_custom_object != null) {
			setForm(customObj?.contact_custom_object?.form);
		} else {
			setForm([]);
		}
		// }
	}, [customObj]);
	useEffect(() => {
		setUrl("");
	}, []);

	console.log(fields, "Fieldss");
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
					placeholder="eg : https://www.sellsy.fr/peoples/42847938"
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
