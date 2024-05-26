import { useSettings } from "@cadence-frontend/data-access";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal } from "@cadence-frontend/components";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect } from "react";
import { VIEWS } from "../../../../constants";
import { UnParseRingoverFields } from "../../../../utils";
import FetchedQuickView from "./components/FetchedQuickView";
import styles from "./TestFieldsModal.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";
import { useContext } from "react";
import { Caution2 } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//components

//constants

const FIELDS_WITH_DIFFERENT_KEYS = {
	zip_code: "zipcode",
	company_phone_number: "phone_number",
};

const TestFieldsModal = ({ modal, currentView, setModal, ringoverFields }) => {
	//modal has the currentView prop
	const [url, setUrl] = useState("");
	const [fieldsResult, setFieldsResult] = useState(null);
	const { fetchTestFields, fetchTestFieldsLoading } = useSettings({ enabled: false });
	const { addError } = useContext(MessageContext);
	const onClose = () => {
		setModal(null);
	};
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		setUrl("");
		setFieldsResult(null);
	}, [currentView]);

	function generateMisMatchFields(testFieldsResult) {
		let result = [];
		if (modal === VIEWS.LEAD) {
			result = ringoverFields[VIEWS.LEAD].map(field => {
				if (field.backendField !== "phone_numbers" && field.backendField !== "emails") {
					field.retrievedValue =
						testFieldsResult?.[
							Object.keys(FIELDS_WITH_DIFFERENT_KEYS).includes(field.backendField)
								? FIELDS_WITH_DIFFERENT_KEYS[field.backendField]
								: field.backendField
						] === null //null means value is there but not set|||| undefined means field mismatched i.e error / failure in matching
							? `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
							: testFieldsResult?.[
									Object.keys(FIELDS_WITH_DIFFERENT_KEYS).includes(field.backendField)
										? FIELDS_WITH_DIFFERENT_KEYS[field.backendField]
										: field.backendField
							  ];
				} else {
					field.retrievedValue = null;
					testFieldsResult?.[field.backendField].filter(i => {
						if (i.type === field.value.name) {
							field.retrievedValue =
								i?.phone_number ??
								i?.email_id ??
								`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`;
							return true;
						}
						return false;
					});
				}
				return field;
			});
		} else {
			const result1 = ringoverFields[VIEWS.ACCOUNT].map(field => {
				field.retrievedValue =
					testFieldsResult?.[field.backendField] === null
						? `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
						: testFieldsResult?.[
								field.backendField === "zip_code" ? "zipcode" : field.backendField //to be changed done cz of backend issue
						  ];
				return field;
			});
			const result2 = ringoverFields[VIEWS.CONTACT].map(field => {
				if (field.backendField !== "phone_numbers" && field.backendField !== "emails") {
					field.retrievedValue =
						testFieldsResult?.[field.backendField] === null
							? `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
							: testFieldsResult?.[
									field.backendField === "zip_code" ? "zipcode" : field.backendField
							  ];
				} else {
					field.retrievedValue = null;
					testFieldsResult?.[field.backendField].filter(i => {
						if (i.type === field.value.name) {
							field.retrievedValue =
								i?.phone_number ??
								i?.email_id ??
								`${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`;
							return true;
						}
						return false;
					});
				}
				return field;
			});
			result = [...result1, ...result2];
		}
		const fieldsNotToBeTested = ["disqualification_reason"];
		setFieldsResult(result.filter(r => !fieldsNotToBeTested.includes(r.backendField)));
	}

	const handleFetch = () => {
		let sf_id = url.substring(url.indexOf(modal === VIEWS.LEAD ? "Lead/" : "Contact/"));
		sf_id = sf_id.substring(modal === VIEWS.LEAD ? 5 : 8);
		sf_id = sf_id.substring(0, sf_id.indexOf("/"));
		let body = {};
		if (modal === VIEWS.LEAD) {
			body = {
				salesforce_id: sf_id,
				type: VIEWS.LEAD,
				salesforce_lead_map: UnParseRingoverFields(ringoverFields[VIEWS.LEAD]),
			};
		} else {
			body = {
				salesforce_id: sf_id,
				type: VIEWS.CONTACT,
				salesforce_contact_map: UnParseRingoverFields(ringoverFields[VIEWS.CONTACT]),
				salesforce_account_map: UnParseRingoverFields(ringoverFields[VIEWS.ACCOUNT]),
			};
		}
		fetchTestFields(
			{ body, type: INTEGRATION_TYPE.SALESFORCE },
			{
				onSuccess: testFieldsResult => generateMisMatchFields(testFieldsResult),
				onError: err => {
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	return (
		<Modal
			isModal={modal}
			disableOutsideClick={true}
			onClose={() => onClose()}
			className={styles.testFieldsModal}
			showCloseButton={true}
		>
			<div className={styles.header}>
				{SETTINGS_TRANSLATION.TEST_OBJECT_FILEDS[user?.language.toUpperCase()]}
			</div>
			<div className={styles.body}>
				<div>
					{modal === VIEWS.LEAD
						? SETTINGS_TRANSLATION.ENTER_LEAD_URL[user?.language.toUpperCase()]
						: SETTINGS_TRANSLATION.ENTER_CONTACT_URL[user?.language.toUpperCase()]}
				</div>
				<Input
					value={url}
					setValue={setUrl}
					className={styles.urlInput}
					theme={InputThemes.WHITE_WITH_GREY_BORDER}
					placeholder="eg : https://ringover.lightning.force.com/lightning/r/Lead/00Q7T000001tIafUAE/view "
				/>
				{fieldsResult && (
					<div className={styles.result}>
						<FetchedQuickView fieldsResult={fieldsResult} currentView={modal} />
						<div className={styles.errorLog}>
							<div className={styles.title}>
								<Caution2 color={Colors.redShade3} />{" "}
								{SETTINGS_TRANSLATION.ERROR_LOG[user?.language.toUpperCase()]} {"("}
								{
									fieldsResult.filter(
										field => !field.retrievedValue && field.value.name !== ""
									).length
								}
								{")"}
							</div>
							<div className={styles.fields + " " + styles.error}>
								{fieldsResult.map(field =>
									!field.retrievedValue && field.value.name !== "" ? (
										<div>{field.label}</div>
									) : null
								)}
							</div>
						</div>
						<div className={styles.missingFields}>
							<div className={styles.title}>
								{SETTINGS_TRANSLATION.MISSED_FIELDS[user?.language.toUpperCase()]} {"("}
								{fieldsResult.filter(field => field.value.name === "").length}
								{")"}
							</div>
							<div className={styles.fields + " " + styles.missing}>
								{fieldsResult.map(field =>
									field.value.name === "" ? <div>{field.label}</div> : null
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<ThemedButton
				className={styles.fetchButton}
				loading={fetchTestFieldsLoading}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => handleFetch()}
			>
				{SETTINGS_TRANSLATION.TEST_FOR[user?.language.toUpperCase()]}{" "}
				{modal === VIEWS.ACCOUNT ? VIEWS.CONTACT : modal}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsModal;
