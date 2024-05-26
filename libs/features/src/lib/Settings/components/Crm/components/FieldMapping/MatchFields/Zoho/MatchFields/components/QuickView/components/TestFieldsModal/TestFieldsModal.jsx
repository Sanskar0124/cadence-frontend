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
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//components

//constants

const TestFieldsModal = ({ modal, currentView, setModal, ringoverFields }) => {
	//modal has the currentView prop
	const [url, setUrl] = useState("");
	const [fieldsResult, setFieldsResult] = useState(null);
	const user = useRecoilValue(userInfo);

	const { fetchTestFields, fetchTestFieldsLoading } = useSettings({ enabled: false });
	const { addError } = useContext(MessageContext);
	const onClose = () => {
		setModal(null);
	};

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
						testFieldsResult?.[field.backendField] === null //null means value is there but not set|||| undefined means field mismatched i.e error / failure in matching
							? "Not set"
							: testFieldsResult?.[
									field.backendField === "zip_code" ? "zipcode" : field.backendField
							  ];
				} else {
					field.retrievedValue = null;
					testFieldsResult?.[field.backendField].filter(i => {
						if (i.type === field.value.name) {
							field.retrievedValue = i?.phone_number ?? i?.email_id ?? "Not set";
							return true;
						}
						return false;
					});
				}
				return field;
			});
		} else {
			const result1 = ringoverFields[VIEWS.ACCOUNT].map(field => {
				field.retrievedValue = testFieldsResult?.decodedAccount?.[
					field.backendField === "zip_code" ? "zipcode" : field.backendField
				]
					? testFieldsResult?.decodedAccount?.[
							field.backendField === "zip_code" ? "zipcode" : field.backendField
					  ]
					: "Not set";
				return field;
			});
			const result2 = ringoverFields[VIEWS.CONTACT].map(field => {
				field.retrievedValue = testFieldsResult?.decodedContact?.[
					field.backendField === "zip_code" ? "zipcode" : field.backendField
				]
					? testFieldsResult?.decodedContact?.[
							field.backendField === "zip_code" ? "zipcode" : field.backendField
					  ]
					: "Not set";
				return field;
			});

			result = [...result1, ...result2];
		}

		const fieldsNotToBeTested = [];
		setFieldsResult(result.filter(r => !fieldsNotToBeTested.includes(r.backendField)));
	}
	const handleFetch = () => {
		let zfm_id =
			url.split("/")[url.split("/").length - 1] ||
			url.split("/")[url.split("/").length - 2];

		let body = {};

		const lead = UnParseRingoverFields(ringoverFields[VIEWS.LEAD]);
		const contact = UnParseRingoverFields(ringoverFields[VIEWS.CONTACT]);
		const account = UnParseRingoverFields(ringoverFields[VIEWS.ACCOUNT]);

		delete lead["disqualification_reason"];
		delete account["disqualification_reason"];

		if (modal === VIEWS.LEAD) {
			body = {
				zfm_id: zfm_id,
				type: VIEWS.LEAD,
				zoho_lead_map: lead,
			};
		} else {
			body = {
				zfm_id: zfm_id,
				type: VIEWS.CONTACT,
				zoho_contact_map: contact,
				zoho_account_map: account,
			};
		}
		fetchTestFields(
			{ body, type: INTEGRATION_TYPE.ZOHO },
			{
				onSuccess: testFieldsResult => {
					generateMisMatchFields(testFieldsResult);
				},
				onError: err => {
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	const getPlacholder = modal => {
		switch (modal) {
			case "lead":
				return "Leads";
			case "contact":
				return "Contacts";
			case "account":
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
					placeholder={`eg: https://crm.zoho.in/crm/org60019268588/tab/${getPlacholder(
						modal
					)}/445725000000263410/`}
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
								{SETTINGS_TRANSLATION.MISSED_FIELDS[user?.language.toUpperCase()]}
								{"("}
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
