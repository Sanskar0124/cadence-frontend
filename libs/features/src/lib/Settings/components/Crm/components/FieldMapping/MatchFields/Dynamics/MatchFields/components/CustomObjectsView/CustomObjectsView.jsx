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
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useQuery } from "@cadence-frontend/utils";

const CustomObjectsView = ({
	buildFormFor,
	setBuildFormFor,
	customObject,
	buttonText,
	setButtonText,
	isOnboarding,
}) => {
	const query = useQuery();
	const [originalSFFields, setOriginalSFFields] = useState(DEFAULT_SF_FIELDS);
	const [availableSFFields, setAvailableSFFields] = useState(DEFAULT_SF_FIELDS);
	// const [customObject, setCustomObject] = useState(CUSTOM_OBJECT);
	const [form, setForm] = useState([]);

	const user = useRecoilValue(userInfo);
	const [showFormBuilderModal, setShowFormBuilderModal] = useState(false);
	const [preview, setPreview] = useState(false);
	const {
		fetchCustomObject,
		fetchLeadFields,
		fetchAccountFields,
		fetchContactDynamicsFields,
		setCustomObjectForm,
		setCustomObjectFormLoading,
		customObjectError,
		loading,
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
		fetchLeadFields(null, {
			onSuccess: leadFields => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.LEAD]: leadFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(item => item.type !== "address")
						.map((field, i) => ({ index: i, ...field, dynamics_endpoint: "lead" })),
				}));
			},
		});

		fetchAccountFields(null, {
			onSuccess: accountFields => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.ACCOUNT]: accountFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(item => item.type !== "address")
						.map((field, i) => ({ index: i, ...field, dynamics_endpoint: "account" })),
				}));
			},
		});

		fetchContactDynamicsFields(null, {
			onSuccess: contactFields => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: contactFields
						?.sort((a, b) => a.label.localeCompare(b.label))
						.filter(item => item.type !== "address")
						.map((field, i) => ({ index: i, ...field, dynamics_endpoint: "contact" })),
				}));
			},
		});
	};

	useEffect(() => {
		setAvailableSFFields({
			[VIEWS?.LEAD]: originalSFFields[VIEWS.LEAD]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.dynamics_field === oriField.name &&
							formElement.dynamics_endpoint === "lead"
					).length === 0
				);
			}),
			[VIEWS?.ACCOUNT]: originalSFFields[VIEWS.ACCOUNT]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.dynamics_field === oriField.name &&
							formElement.dynamics_endpoint === "account"
					).length === 0
				);
			}),
			[VIEWS?.CONTACT]: originalSFFields[VIEWS.CONTACT]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.dynamics_field === oriField.name &&
							formElement.dynamics_endpoint === "contact"
					).length === 0
				);
			}),
		});
	}, [originalSFFields, form]);

	// useEffect(() => {
	// 	setCustomObject({
	// 		[VIEWS.LEAD]: customObj?.lead_custom_object,
	// 		[VIEWS.CONTACT]: customObj?.contact_custom_object,
	// 	});
	// }, [customObj]);

	useEffect(() => {
		if (customObject[buildFormFor] && customObject[buildFormFor].length !== 0) {
			setForm(customObject[buildFormFor][0]?.form);
			setButtonText(customObject[buildFormFor][0]?.button_text);
		} else {
			setForm([]);
			setButtonText(COMMON_TRANSLATION.QUALIFICATION[user?.language?.toUpperCase()]);
		}
	}, [buildFormFor, customObject]);

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
			object_type: buildFormFor,
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
			{isOnboarding && (
				<div className={styles.header}>
					<TabNavSlider
						buttons={LEAD_ACCOUNTCONTACT.map(item => ({
							label: item?.label[user?.language?.toUpperCase()],
							value: item.value,
						}))}
						theme={TabNavThemes.SLIDER}
						value={buildFormFor}
						setValue={setBuildFormFor}
						activeBtnClassName={styles.activeTab}
						btnClassName={styles.tabBtn}
						width="410px"
					/>
				</div>
			)}
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
							className={styles.save}
						>
							<div>{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
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
				buildFormFor={buildFormFor}
				setPreview={setPreview}
				originalSFFields={originalSFFields}
				availableSFFields={availableSFFields}
				setAvailableSFFields={setAvailableSFFields}
				fetchCustomObject={fetchCustomObject}
				loading={loading}
				form={form}
				setForm={setForm}
			/>

			<Preview
				form={form}
				isOpen={preview}
				setPreview={setPreview}
				buildFormFor={buildFormFor}
				buttonText={buttonText}
				saveAndExit={saveAndExit}
				onClose={() => handlePreviewClose()}
			/>
		</div>
	);
};

export default CustomObjectsView;
