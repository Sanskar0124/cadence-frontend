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
		const result1 = ringoverFields[VIEWS.ORGANIZATION].map(field => {
			field.retrievedValue =
				testFieldsResult?.[field.backendField] === null
					? `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
					: testFieldsResult?.[
							field.backendField === "zip_code" ? "zipcode" : field.backendField //to be changed done cz of backend issue
					  ];
			return field;
		});
		const result2 = ringoverFields[VIEWS.PERSON].map(field => {
			field.retrievedValue =
				testFieldsResult?.[field.backendField] === null
					? `${SETTINGS_TRANSLATION.NOT_SET[user?.language.toUpperCase()]}`
					: testFieldsResult?.[
							field.backendField === "zip_code" ? "zipcode" : field.backendField
					  ];
			return field;
		});
		result = [...result1, ...result2];

		const fieldsNotToBeTested = [];
		setFieldsResult(result.filter(r => !fieldsNotToBeTested.includes(r.backendField)));
	}

	const handleFetch = () => {
		let pd_id = url.substring(url.indexOf("/person/"));
		pd_id = pd_id.substring(8, pd_id.includes("?") ? pd_id.indexOf("?") : pd_id.length);
		const body = {
			person_id: pd_id,
			person_map: UnParseRingoverFields(ringoverFields[VIEWS.PERSON]),
			organization_map: UnParseRingoverFields(ringoverFields[VIEWS.ORGANIZATION]),
		};
		fetchTestFields(
			{ body, type: INTEGRATION_TYPE.PIPEDRIVE },
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
					placeholder="eg : https://ringovertest-sandbox.pipedrive.com/person/1 "
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
				{modal === VIEWS.ACCOUNT ? VIEWS.PERSON : modal}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsModal;
