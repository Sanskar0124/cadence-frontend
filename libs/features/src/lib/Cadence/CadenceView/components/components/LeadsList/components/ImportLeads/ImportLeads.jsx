import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "@cadence-frontend/contexts";
import styles from "./ImportLeads.module.scss";
import { DocumentText, Download, Tick } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { Colors, capitalize, getIntegrationIcon } from "@cadence-frontend/utils";
import { getRadioBtns, IMPORT_OPTIONS } from "./constants";
import {
	DragNDropFile,
	GlobalModals,
	Input,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	CADENCE_INTEGRATION_TYPE,
	GLOBAL_MODAL_TYPES,
	INTEGRATION_TYPE,
} from "@cadence-frontend/constants";
import ImportLeadsModal from "../ImportLeadsModal/ImportLeadsModal";
import { getSampleCsvUrl, getSampleSheetsUrl } from "../../constants";
import { navigateToCsvImport, navigateToSheetsImport } from "../../constants";
import { crmRedirectionURL } from "../../../../../utils";

const ImportLeads = ({ cadence, user, user_info }) => {
	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);

	const IntegrationIcon = getIntegrationIcon({
		integration_type: user_info?.integration_type,
		box: true,
	});

	const [file, setFile] = useState(null);
	const [sheetUrl, setSheetUrl] = useState("");
	const [selected, setSelected] = useState(null);
	const [showExpirationModal, setShowExpirationModal] = useState(false);
	const [importLeadsModal, setImportLeadsModal] = useState(false);

	const handleSheetsImportClick = () => {
		if (sheetUrl.split("/").length !== 7) return addError({ text: "Invalid Sheet Url" });
		navigateToSheetsImport(sheetUrl, user_info?.integration_type, cadence, navigate);
	};

	const isIntegrationTokenExpired = () => {
		return user?.Integration_Token?.is_logged_out ?? true;
	};

	useEffect(() => {
		if (file) navigateToCsvImport(file, user_info?.integration_type, cadence, navigate);
	}, [file]);

	useEffect(() => {
		if (
			user_info.integration_type === INTEGRATION_TYPE.SALESFORCE ||
			user_info?.integration_type === INTEGRATION_TYPE.PIPEDRIVE ||
			user_info?.integration_type === INTEGRATION_TYPE.HUBSPOT ||
			user_info?.integration_type === INTEGRATION_TYPE.ZOHO ||
			user_info?.integration_type === INTEGRATION_TYPE.SELLSY ||
			user_info?.integration_type === INTEGRATION_TYPE.BULLHORN
		)
			setSelected(IMPORT_OPTIONS.FROM_INTEGRATION);
		else if (
			user_info.integration_type === INTEGRATION_TYPE.SHEETS &&
			cadence?.integration_type
		) {
			setSelected(
				cadence?.integration_type === "sheets"
					? IMPORT_OPTIONS.GOOGLE_SHEETS
					: IMPORT_OPTIONS.CSV_FILES
			);
		} else setSelected(IMPORT_OPTIONS.CSV_FILES);
	}, []);

	const getImportSection = () => {
		switch (selected) {
			case IMPORT_OPTIONS.CSV_FILES:
				return (
					<>
						<p>
							{COMMON_TRANSLATION?.ADD_A[user_info?.language?.toUpperCase()]}{" "}
							<a
								href={getSampleCsvUrl(user_info?.integration_type)}
								target="_blank"
								rel="noreferrer"
								download
							>
								.csv
							</a>{" "}
							file to import leads for the cadence
						</p>
						<div className={styles.dragNDropSectn}>
							<DragNDropFile
								droppedFile={file}
								setDroppedFile={setFile}
								showFileDetails={false}
								extnsAllowed={
									user_info.integration_type === INTEGRATION_TYPE.SHEETS
										? ["xlsx", "xls", "xlsm", "xlsb", "xml", "csv", "tsv", "txt"]
										: ["csv"]
								}
							/>
						</div>
					</>
				);
			case IMPORT_OPTIONS.FROM_INTEGRATION:
				return (
					<>
						<p>
							Import leads for the cadence from{" "}
							<button
								style={{
									outline: "none",
									border: "none",
									background: "none",
									color: Colors.blueShade1,
									textDecoration: "underline",
								}}
								onClick={() =>
									isIntegrationTokenExpired()
										? setShowExpirationModal(true)
										: window.open(
												crmRedirectionURL(
													user_info.instance_url,
													user_info.integration_type
												)
										  )
								}
								disabled={user_info?.integration_type === INTEGRATION_TYPE.ZOHO}
							>
								{
									COMMON_TRANSLATION?.[user_info?.integration_type?.toUpperCase()]?.[
										user_info?.language?.toUpperCase()
									]
								}
							</button>
						</p>

						<ThemedButton
							height="50px"
							width="fit-content"
							onClick={() =>
								isIntegrationTokenExpired()
									? setShowExpirationModal(true)
									: window.open(
											crmRedirectionURL(
												user_info.instance_url,
												user_info.integration_type
											)
									  )
							}
							theme={ThemedButtonThemes.GREY}
							disabled={user_info?.integration_type === INTEGRATION_TYPE.ZOHO}
						>
							<IntegrationIcon size="1.8rem" />{" "}
							{`Open ${capitalize(user_info?.integration_type)}`}
						</ThemedButton>
					</>
				);
			case IMPORT_OPTIONS.GOOGLE_SHEETS:
				return (
					<>
						<p>
							{COMMON_TRANSLATION?.ADD_A[user_info?.language?.toUpperCase()]}{" "}
							<a
								href={getSampleSheetsUrl(user_info?.integration_type)}
								target="_blank"
								rel="noreferrer"
							>
								{COMMON_TRANSLATION?.GOOGLE_SHEETS[user_info?.language?.toUpperCase()]}
							</a>{" "}
							{
								CADENCE_TRANSLATION?.LINK_TO_IMPORT_LEADS[
									user_info?.language?.toUpperCase()
								]
							}
						</p>
						<Input
							height="50px"
							placeholder={
								CADENCE_TRANSLATION?.ENTER_LINK[user_info?.language?.toUpperCase()]
							}
							value={sheetUrl}
							setValue={setSheetUrl}
						/>
						<ThemedButton
							height="50px"
							theme={ThemedButtonThemes.GREY}
							width="fit-content"
							onClick={handleSheetsImportClick}
							disabled={!sheetUrl.length}
						>
							<Download />{" "}
							{CADENCE_TRANSLATION?.IMPORT_LEADS[user_info?.language?.toUpperCase()]}
						</ThemedButton>
					</>
				);
		}
	};

	return (
		<div className={styles.importLeads}>
			<div>
				<div className={styles.noLeads}>
					<span>
						{
							CADENCE_TRANSLATION?.CURRENTLY_NO_LEADS_PRESENT[
								user_info?.language?.toUpperCase()
							]
						}
					</span>

					<p>
						{user_info?.integration_type === INTEGRATION_TYPE.ZOHO ||
						user_info?.integration_type === INTEGRATION_TYPE.SELLSY
							? "Select your source to import new leads for the Cadence"
							: "Import leads for the cadence from any of the below sources"}
					</p>
				</div>
				{getRadioBtns(user_info?.integration_type, cadence.integration_type)?.length >
					0 && (
					<div className={styles.radioBtnList}>
						{getRadioBtns(user_info?.integration_type, cadence.integration_type)?.map(
							radioBtn =>
								user_info?.integration_type === INTEGRATION_TYPE.ZOHO ||
								user_info?.integration_type === INTEGRATION_TYPE.SELLSY ? (
									<ThemedButton
										theme={ThemedButtonThemes.GREY}
										onClick={() => setImportLeadsModal(true)}
									>
										{" "}
										<DocumentText size={38} height={"40px"} />
										<div>Select source</div>
									</ThemedButton>
								) : (
									<div
										key={radioBtn.value}
										className={`${styles.radioBtn}`}
										style={
											selected === radioBtn.value
												? { border: `1px solid ${radioBtn.border_color}` }
												: { boxShadow: `3px 5px 28px rgba(41, 43, 88, 0.05)` }
										}
										onClick={() =>
											radioBtn.value === IMPORT_OPTIONS.CSV_FILES &&
											(user_info?.integration_type === INTEGRATION_TYPE.SALESFORCE ||
												user_info?.integration_type === INTEGRATION_TYPE.PIPEDRIVE ||
												user_info?.integration_type === INTEGRATION_TYPE.HUBSPOT ||
												user_info?.integration_type === INTEGRATION_TYPE.ZOHO ||
												user_info?.integration_type === INTEGRATION_TYPE.SELLSY ||
												user_info?.integration_type === INTEGRATION_TYPE.BULLHORN)
												? setImportLeadsModal(true)
												: setSelected(radioBtn.value)
										}
									>
										<div className={styles.leftSide}>
											{radioBtn.icon}
											<p>{radioBtn.text}</p>
										</div>
										<div className={styles.rightSide}>
											{selected === radioBtn.value && (
												<span style={{ backgroundColor: radioBtn.tick_bg }}>
													<Tick size={14} />
												</span>
											)}
										</div>
									</div>
								)
						)}
					</div>
				)}

				{user_info?.integration_type !== INTEGRATION_TYPE.ZOHO &&
					user_info?.integration_type !== INTEGRATION_TYPE.SELLSY && (
						<div className={styles.import}>{getImportSection()}</div>
					)}
			</div>
			<ImportLeadsModal
				modal={importLeadsModal}
				setModal={setImportLeadsModal}
				cadence={cadence}
			/>
			<GlobalModals
				type={GLOBAL_MODAL_TYPES.INTEGRATION_TOKEN_EXPIRED}
				modalProps={{
					isModal: showExpirationModal,
					setModal: setShowExpirationModal,
					onClose: () => setShowExpirationModal(false),
					disableOutsideClick: false,
				}}
			/>
		</div>
	);
};

export default ImportLeads;
