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
	Common as COMMON_TRASNLATION,
	People as PEOPLE_TRANSLATION,
	Profile as PROFILE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

//components

//constants

const TestFieldsModal = ({ modal, currentView, setModal, ringoverFields }) => {
	const user = useRecoilValue(userInfo);
	//modal has the currentView prop
	const [url, setUrl] = useState("");
	const [fieldsResult, setFieldsResult] = useState(null);
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
		console.log(ringoverFields, testFieldsResult, "Vansh37");
		const result1 = ringoverFields[VIEWS.COMPANY].map(field => {
			if (field.backendField === "zipcode" || field.backendField === "country") {
				field.retrievedValue = testFieldsResult?.["addresses"]?.[0]?.[field?.value?.name]
					? testFieldsResult?.["addresses"]?.[0]?.[field?.value?.name]
					: `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`;
			} else {
				field.retrievedValue = testFieldsResult?.[field.backendField]
					? testFieldsResult?.[field.backendField]
					: `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`;
			}
			return field;
		});
		const result2 = ringoverFields[VIEWS.CONTACT].map(field => {
			field.retrievedValue = testFieldsResult?.[field.backendField]
				? testFieldsResult?.[field.backendField]
				: `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`;
			return field;
		});
		result = [...result1, ...result2];
		const fieldsNotToBeTested = [];
		setFieldsResult(result.filter(r => !fieldsNotToBeTested.includes(r.backendField)));
	}

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
		const body = {
			contact_id: s_contact_id,
			company_map: UnParseRingoverFields(ringoverFields[VIEWS.COMPANY]),
			contact_map: UnParseRingoverFields(ringoverFields[VIEWS.CONTACT]),
		};
		fetchTestFields(
			{ body, type: INTEGRATION_TYPE.SELLSY },
			{
				onSuccess: testFieldsResult => generateMisMatchFields(testFieldsResult),
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
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
				<div>{SETTINGS_TRANSLATION.ENTER_CONTACT_URL[user?.language.toUpperCase()]}</div>
				<Input
					value={url}
					setValue={setUrl}
					className={styles.urlInput}
					theme={InputThemes.WHITE_WITH_GREY_BORDER}
					placeholder="eg : https://www.sellsy.fr/peoples/42847938"
				/>
				{fieldsResult && (
					<div className={styles.result}>
						<FetchedQuickView fieldsResult={fieldsResult} currentView={modal} />
						<div className={styles.errorLog}>
							<div className={styles.title}>
								<Caution2 color={Colors.redShade3} />
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
				disabled={!url.length}
			>
				{SETTINGS_TRANSLATION.TEST_FOR[user?.language.toUpperCase()]} {VIEWS.CONTACT}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsModal;
