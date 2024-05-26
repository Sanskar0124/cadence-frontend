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

//constants

const TestFieldsModal = ({ modal, currentView, setModal, ringoverFields }) => {
	const [id, setId] = useState("");
	const [url, setUrl] = useState("");
	const [fieldsResult, setFieldsResult] = useState(null);

	const { fetchTestFields, fetchTestFieldsLoading } = useSettings({ enabled: false });
	const { addError } = useContext(MessageContext);
	const onClose = () => {
		setModal(null);
	};

	useEffect(() => {
		setId("");
		setUrl("");
		setFieldsResult(null);
	}, [currentView]);

	function isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch (err) {
			return false;
		}
	}
	const getLeadsID = url => {
		if (isValidUrl(url)) {
			const params = new URLSearchParams(new URL(url).search);
			const lastParamKey = Array.from(params.keys()).pop();
			return params.get(lastParamKey) ?? "";
		} else return "";
	};

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
		} else if (modal === VIEWS.CANDIDATE) {
			result = ringoverFields[VIEWS.CANDIDATE].map(field => {
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
		} else if (modal === VIEWS.CONTACT || modal === VIEWS.ACCOUNT) {
			const result1 = ringoverFields[VIEWS.ACCOUNT].map(field => {
				field.retrievedValue = testFieldsResult?.decodedAccount?.[field.backendField]
					? testFieldsResult?.decodedAccount?.[field.backendField]
					: "Not set";
				return field;
			});
			const result2 = ringoverFields[VIEWS.CONTACT].map(field => {
				field.retrievedValue = testFieldsResult?.decodedContact?.[field.backendField]
					? testFieldsResult?.decodedContact?.[field.backendField]
					: "Not set";
				return field;
			});

			result = [...result1, ...result2];
		}

		const fieldsNotToBeTested = [];
		setFieldsResult(result.filter(r => !fieldsNotToBeTested.includes(r.backendField)));
	}
	const handleFetch = () => {
		if (!url.trim() || !getLeadsID(url))
			return addError({ text: `Enter a valid ${modal} URL.` });

		let body = {};

		const lead = UnParseRingoverFields(ringoverFields[VIEWS.LEAD]);
		const contact = UnParseRingoverFields(ringoverFields[VIEWS.CONTACT]);
		const account = UnParseRingoverFields(ringoverFields[VIEWS.ACCOUNT]);
		const candidate = UnParseRingoverFields(ringoverFields[VIEWS.CANDIDATE]);

		delete lead["disqualification_reason"];
		delete account["disqualification_reason"];
		delete candidate["disqualification_reason"];

		if (modal === VIEWS.LEAD) {
			body = {
				bfm_id: getLeadsID(url),
				type: VIEWS.LEAD,
				bullhorn_lead_map: lead,
			};
		} else if (modal === VIEWS.CONTACT || modal === VIEWS.ACCOUNT) {
			body = {
				bfm_id: getLeadsID(url),
				type: "clientContact",
				bullhorn_contact_map: contact,
				bullhorn_account_map: account,
			};
		} else {
			body = {
				bfm_id: getLeadsID(url),
				type: VIEWS.CANDIDATE,
				bullhorn_candidate_map: candidate,
			};
		}

		fetchTestFields(
			{ body, type: INTEGRATION_TYPE.BULLHORN },
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
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Lead&id=14156";
			case "contact":
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=ClientContact&id=14153";
			case "account":
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=ClientContact&id=14153";
			case "candidate":
				return "https://cls91.bullhornstaffing.com/BullhornSTAFFING/OpenWindow.cfm?Entity=Candidate&id=14171";
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
			<div className={styles.header}>Test object fields</div>
			<div className={styles.body}>
				<div>
					Enter{" "}
					{modal === VIEWS.LEAD
						? "lead"
						: modal === VIEWS.CANDIDATE
						? "candidate"
						: "contact"}{" "}
					ID
				</div>
				<Input
					value={url}
					setValue={setUrl}
					className={styles.urlInput}
					theme={InputThemes.WHITE_WITH_GREY_BORDER}
					placeholder={getPlacholder(modal)}
				/>

				<div className={styles.sideLink}>
					<a
						href={
							"https://ringovercadence.freshdesk.com/en/support/solutions/articles/103000107971-getting-the-url-of-contacts-leads-candidates-in-bullhorn-"
						}
						target="_blank"
						rel="noreferrer"
					>
						Need help?
					</a>
				</div>

				{fieldsResult && (
					<div className={styles.result}>
						<FetchedQuickView fieldsResult={fieldsResult} currentView={modal} />
						<div className={styles.errorLog}>
							<div className={styles.title}>
								<Caution2 color={Colors.redShade3} /> Error log {"("}
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
								Missed fields {"("}
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
				Test for {modal === VIEWS.ACCOUNT ? VIEWS.CONTACT : modal}
			</ThemedButton>
		</Modal>
	);
};

export default TestFieldsModal;
