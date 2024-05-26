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
import { capitalize } from "@cadence-frontend/utils";

const CustomObjectsView = ({
	buildFormFor,
	setBuildFormFor,
	customObject,
	buttonText,
	setButtonText,
	setCustomObject,
	isOnboarding,
}) => {
	const [originalSFFields, setOriginalSFFields] = useState(DEFAULT_SF_FIELDS);

	const [availableSFFields, setAvailableSFFields] = useState(DEFAULT_SF_FIELDS);
	const [form, setForm] = useState([]);
	const user = useRecoilValue(userInfo);
	const [showFormBuilderModal, setShowFormBuilderModal] = useState(false);
	const [preview, setPreview] = useState(false);
	const {
		fetchCustomObject,
		fetchLeadFields,
		fetchAccountFields,
		fetchCandidateFields,
		fetchContactBullhornFields,
		setCustomObjectForm,
		setCustomObjectFormLoading,
		customObjectError,
		loading,
	} = useCustomObject(true);

	const { addError, addSuccess } = useContext(MessageContext);

	useEffect(() => {
		if (window.location.pathname.includes("onboarding"))
			localStorage.setItem(LOCAL_STORAGE_KEYS.FIELD_MAP_DEFAULT_SET, true);
		fetchFields();
	}, []);

	useEffect(() => {
		setAvailableSFFields({
			[VIEWS?.LEAD]: originalSFFields[VIEWS.LEAD]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.bullhorn_field === oriField.name &&
							formElement.bullhorn_endpoint === "lead"
					).length === 0
				);
			}),
			[VIEWS?.ACCOUNT]: originalSFFields[VIEWS.ACCOUNT]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.bullhorn_field === oriField.name &&
							formElement.bullhorn_endpoint === "account"
					).length === 0
				);
			}),
			[VIEWS?.CONTACT]: originalSFFields[VIEWS.CONTACT]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.bullhorn_field === oriField.name &&
							formElement.bullhorn_endpoint === "contact"
					).length === 0
				);
			}),
			[VIEWS?.CANDIDATE]: originalSFFields[VIEWS.CANDIDATE]?.filter(oriField => {
				return (
					form?.filter(
						formElement =>
							formElement.bullhorn_field === oriField.name &&
							formElement.bullhorn_endpoint === "candidate"
					).length === 0
				);
			}),
		});
	}, [originalSFFields, form]);

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
		if (customObjectError) {
			return addError({
				text: customObjectError?.response?.data.msg,
				desc: customObjectError?.response?.data?.error ?? "Please contact support",
				cId: customObjectError?.response?.data?.correlationId,
			});
		}
	}, [customObjectError]);

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
					[VIEWS.LEAD]:
						leadFields
							?.sort((a, b) => a.label?.localeCompare(b.label))
							.map((field, i) => ({ index: i, ...field, sobject: "lead" })) ?? [],
				}));
			},
		});

		fetchAccountFields(null, {
			onSuccess: accountFields => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.ACCOUNT]:
						accountFields
							?.sort((a, b) => a.label?.localeCompare(b.label))
							.map((field, i) => ({ index: i, ...field, sobject: "account" })) ?? [],
				}));
			},
		});

		fetchContactBullhornFields(null, {
			onSuccess: contactFields => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.CONTACT]:
						contactFields
							?.sort((a, b) => a.label?.localeCompare(b.label))
							.map((field, i) => ({ index: i, ...field, sobject: "contact" })) ?? [],
				}));
			},
		});

		fetchCandidateFields(null, {
			onSuccess: candidateFields => {
				setOriginalSFFields(prev => ({
					...prev,
					[VIEWS.CANDIDATE]:
						candidateFields
							?.sort((a, b) => a.label?.localeCompare(b.label))
							.map((field, i) => ({ index: i, ...field, sobject: "candidate" })) ?? [],
				}));
			},
		});
	};

	const handleClose = () => {
		// console.log(preview,"hello");
		// if (!preview) fetchCustomObject();
		setShowFormBuilderModal(false);
	};
	const handleSave = () => {
		if (buttonText.trim() === "") return addError({ text: "Text Displayed is required" });
		const body = {
			object_type: buildFormFor === "contact" ? "clientContact" : buildFormFor,
			custom_object: [
				{
					button_text: buttonText,
					form: form
						.filter(item => item.type !== "")
						.map(item => {
							if (item.reference_field_name) {
								delete item["reference_field_name"];
							}
							return item;
						})
						.map(f => ({
							...f,
							bullhorn_endpoint:
								f.bullhorn_endpoint === "contact"
									? "clientContact"
									: f.bullhorn_endpoint === "account"
									? "clientCorporation"
									: f.bullhorn_endpoint,
						})),
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

	return (
		<div>
			<div className={styles.header}>
				{isOnboarding && (
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
						width="485px"
						noAnimation
					/>
				)}
			</div>

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
							value={capitalize(buttonText)}
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
