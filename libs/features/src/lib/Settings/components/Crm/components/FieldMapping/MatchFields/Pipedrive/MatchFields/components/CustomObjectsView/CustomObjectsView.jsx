import React, { useState, useContext, useEffect } from "react";
import styles from "./CustomObjectsView.module.scss";

import { ThemedButtonThemes, TabNavThemes } from "@cadence-frontend/themes";
import { LEAD_ACCOUNTCONTACT } from "./constants";
import { TabNavSlider, Label, Input, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { DEFAULT_SF_FIELDS } from "./components/FormBuilderModal/constants";
import { VIEWS } from "./constants";
import { useCustomObject, useSettings } from "@cadence-frontend/data-access";
import FormBuilderModal from "./components/FormBuilderModal/FormBuilderModal";
import Preview from "./components/FormBuilderModal/components/Preview/Preview";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const CustomObjectsView = ({
	customObject,
	buttonText,
	setButtonText,
	setCustomObject,
}) => {
	const [originalPDFields, setOriginalPDFields] = useState(DEFAULT_SF_FIELDS);
	const [availablePDFields, setAvailablePDFields] = useState(DEFAULT_SF_FIELDS);
	// const [customObject, setCustomObject] = useState(CUSTOM_OBJECT);
	const [form, setForm] = useState([]);
	const user = useRecoilValue(userInfo);
	const [showFormBuilderModal, setShowFormBuilderModal] = useState(false);
	const [preview, setPreview] = useState(false);
	const {
		fetchCustomObject,
		fetchPersonFields,
		fetchOrganizationFields,
		setCustomObjectForm,
		setCustomObjectFormLoading,
		customObjectError,
		ploading,
	} = useCustomObject(true);

	const { addError, addSuccess } = useContext(MessageContext);

	const handleClick = () => {
		if (buttonText === "") {
			return addError({ text: "Text Displayed is required" });
		} else {
			setShowFormBuilderModal(true);
		}
	};

	const fetchFields = () => {
		fetchPersonFields(null, {
			onSuccess: personFields => {
				setOriginalPDFields(prev => ({
					...prev,
					[VIEWS.PERSON]: personFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(
							item =>
								item.type !== "address" &&
								item.type !== "user" &&
								item.type !== "org" &&
								item.type !== "picture" &&
								item.type !== "visible_to" &&
								item.editable != null
						)
						.map((field, i) => ({ index: i, ...field, pipedrive_endpoint: "person" })),
				}));
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});

		fetchOrganizationFields(null, {
			onSuccess: organizationFields => {
				setOriginalPDFields(prev => ({
					...prev,
					[VIEWS.ORGANIZATION]: organizationFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(
							item =>
								item.type !== "address" &&
								item.type !== "user" &&
								item.type !== "org" &&
								item.type !== "picture" &&
								item.type !== "visible_to" &&
								item.editable != null
						)
						.map((field, i) => ({
							index: i,
							...field,
							pipedrive_endpoint: "organization",
						})),
				}));
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};
	useEffect(() => {
		setAvailablePDFields({
			[VIEWS?.PERSON]: originalPDFields[VIEWS.PERSON]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.pipedrive_field === oriField.name &&
							formElement.pipedrive_endpoint === "person"
					).length === 0
				);
			}),
			[VIEWS?.ORGANIZATION]: originalPDFields[VIEWS.ORGANIZATION]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.pipedrive_field === oriField.name &&
							formElement.pipedrive_endpoint === "organization"
					).length === 0
				);
			}),
		});
	}, [originalPDFields, form]);

	// useEffect(() => {
	// 	setCustomObject({
	// 		[VIEWS.LEAD]: customObj?.lead_custom_object,
	// 		[VIEWS.CONTACT]: customObj?.contact_custom_object,
	// 	});
	// }, [customObj]);

	useEffect(() => {
		if (customObject[VIEWS.PERSON] && customObject[VIEWS.PERSON].length !== 0) {
			setForm(customObject[VIEWS.PERSON][0]?.form);
			setButtonText(customObject[VIEWS.PERSON][0]?.button_text);
		} else {
			setForm([]);
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
	}, [customObject]);

	useEffect(() => {
		fetchFields();
	}, []);
	const handleClose = () => {
		// console.log(preview,"hello");
		// if (!preview) fetchCustomObject();
		setShowFormBuilderModal(false);
	};
	const handleSave = () => {
		if (buttonText.trim() === "") return addError({ text: "Text Displayed is required" });
		const body = {
			object_type: VIEWS.PERSON,
			custom_object: [
				{
					button_text: buttonText,
					form: form.filter(item => item.type !== ""),
				},
			],
		};
		setCustomObjectForm(body, {
			onSuccess: () => {
				return addSuccess("Form saved Successfully");
			},
			onError: err => {
				return addError({
					text: err?.response.data.msg || "Error in saving the form",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	const handlePreviewClose = () => {
		setPreview(false);
		setShowFormBuilderModal(true);
	};
	const saveAndExit = () => {
		setPreview(false);
	};
	useEffect(() => {
		if (customObjectError) {
			return addError({
				text: customObjectError?.response?.data.msg,
				desc: customObjectError?.response?.data?.error ?? "Please contact support",
				cId: customObjectError?.response?.data?.correlationId,
			});
		}
	}, [customObjectError]);
	return (
		<div>
			{/* <div className={styles.header}>
				<TabNavSlider
					buttons={LEAD_ACCOUNTCONTACT}
					theme={TabNavThemes.SLIDER}
					value={buildFormFor}
					setValue={setBuildFormFor}
					activeBtnClassName={styles.activeTab}
					btnClassName={styles.tabBtn}
					width="410px"
				/>
			</div> */}
			<div className={styles.body}>
				<div className={styles.input}>
					<Label required>
						{SETTINGS_TRANSLATION.TEXT_DISPLAYED[user?.language?.toUpperCase()]}
					</Label>
					<div className={styles.inputBox}>
						<Input
							type="text"
							width="500px"
							height="40px"
							value={buttonText}
							setValue={setButtonText}
						/>
						<ThemedButton
							theme={ThemedButtonThemes.TRANSPARENT}
							loading={setCustomObjectFormLoading}
							onClick={() => handleSave()}
							loadingText="Saving"
							width="fitContent"
						>
							{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
						</ThemedButton>
						{/* <div className={styles.save}>Save</div> */}
					</div>
				</div>
				<div className={styles.button}>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width="fit-content"
						height="39px"
						onClick={() => {
							handleClick();
						}}
					>
						{SETTINGS_TRANSLATION.OPEN_FORM_BUILDER[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
				<div className={styles.info}>
					{
						SETTINGS_TRANSLATION.OPEN_FORM_BUILDER_TO_CRESTE_CUSTOM_FORM[
							user?.language?.toUpperCase()
						]
					}
				</div>
			</div>
			<FormBuilderModal
				isOpen={showFormBuilderModal}
				onClose={() => handleClose()}
				buttonText={buttonText}
				setPreview={setPreview}
				originalPDFields={originalPDFields}
				availablePDFields={availablePDFields}
				setAvailablePDFields={setAvailablePDFields}
				fetchCustomObject={fetchCustomObject}
				loading={ploading}
				form={form}
				setForm={setForm}
			/>

			<Preview
				form={form}
				isOpen={preview}
				setPreview={setPreview}
				buttonText={buttonText}
				saveAndExit={saveAndExit}
				onClose={() => handlePreviewClose()}
			/>
		</div>
	);
};

export default CustomObjectsView;
