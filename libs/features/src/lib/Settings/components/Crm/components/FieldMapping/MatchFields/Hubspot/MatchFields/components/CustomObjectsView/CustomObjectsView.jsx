import React, { useState, useContext, useEffect } from "react";
import styles from "./CustomObjectsView.module.scss";

import { ThemedButtonThemes, TabNavThemes } from "@cadence-frontend/themes";
import { LEAD_ACCOUNTCONTACT } from "./constants";
import { TabNavSlider, Label, Input, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { DEFAULT_HS_FIELDS } from "./components/FormBuilderModal/constants";
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
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";

const CustomObjectsView = ({
	customObject,
	buttonText,
	setButtonText,
	setCustomObject,
}) => {
	const [originalHSFields, setOriginalHSFields] = useState(DEFAULT_HS_FIELDS);
	const [availableHSFields, setAvailableHSFields] = useState(DEFAULT_HS_FIELDS);
	// const [customObject, setCustomObject] = useState(CUSTOM_OBJECT);
	const [form, setForm] = useState([]);
	const user = useRecoilValue(userInfo);
	const [showFormBuilderModal, setShowFormBuilderModal] = useState(false);
	const [preview, setPreview] = useState(false);
	const {
		fetchCustomObject,
		fetchContactHpFields,
		fetchCompanyHpFields,
		setCustomObjectForm,
		setCustomObjectFormLoading,
		customObjectError,
		hLoading,
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
		fetchContactHpFields(null, {
			onSuccess: contactFields => {
				setOriginalHSFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: contactFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(item => item.type !== "file")
						.map((field, i) => ({ index: i, ...field, hubspot_endpoint: "contact" })),
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

		fetchCompanyHpFields(null, {
			onSuccess: companyFields => {
				setOriginalHSFields(prev => ({
					...prev,
					[VIEWS.COMPANY]: companyFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(item => item.type !== "file")
						.map((field, i) => ({
							index: i,
							...field,
							hubspot_endpoint: "company",
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
		setAvailableHSFields({
			[VIEWS?.CONTACT]: originalHSFields[VIEWS.CONTACT]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.hubspot_field === oriField.name &&
							formElement.hubspot_endpoint === "contact"
					).length === 0
				);
			}),
			[VIEWS?.COMPANY]: originalHSFields[VIEWS.COMPANY]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.hubspot_field === oriField.name &&
							formElement.hubspot_endpoint === "company"
					).length === 0
				);
			}),
		});
	}, [originalHSFields, form]);

	// useEffect(() => {
	// 	setCustomObject({
	// 		[VIEWS.LEAD]: customObj?.lead_custom_object,
	// 		[VIEWS.CONTACT]: customObj?.contact_custom_object,
	// 	});
	// }, [customObj]);

	useEffect(() => {
		if (customObject[VIEWS.CONTACT] && customObject[VIEWS.CONTACT].length !== 0) {
			setForm(customObject[VIEWS.CONTACT][0]?.form);
			setButtonText(customObject[VIEWS.CONTACT][0]?.button_text);
		} else {
			setForm([]);
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
	}, [customObject]);

	useEffect(() => {
		if (window.location.pathname.includes("onboarding"))
			localStorage.setItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET, true);
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
			object_type: VIEWS.CONTACT,
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
				originalHSFields={originalHSFields}
				availableHSFields={availableHSFields}
				setAvailableHSFields={setAvailableHSFields}
				fetchCustomObject={fetchCustomObject}
				loading={hLoading}
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
