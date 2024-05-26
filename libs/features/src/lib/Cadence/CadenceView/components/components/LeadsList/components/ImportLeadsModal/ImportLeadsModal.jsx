import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { userInfo } from "@cadence-frontend/atoms";
import { Modal, Title } from "@cadence-frontend/components";
import {
	DragNDropFile,
	Input,
	InputRadio,
	Label,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { useState, useContext, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import styles from "./ImportLeadsModal.module.scss";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import {
	getSampleCsvUrl,
	navigateToCsvImport,
	getSampleSheetsUrl,
	navigateToSheetsImport,
	getTypeOptions,
	checkExcelFileSupport,
	EXCEL_FILE_EXTNS,
	importCsvDocsUrl,
} from "../../constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { capitalize } from "@cadence-frontend/utils";
import { SOURCE, SOURCE_OPTIONS } from "./constants";

const ImportLeadsModal = ({ modal, setModal, cadence }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [file, setFile] = useState(null);
	const [source, setSource] = useState(SOURCE.EXCEL);
	const [type, setType] = useState("lead");
	const [isProspecting, setIsProspecting] = useState(false);
	const [sheetUrl, setSheetUrl] = useState("");

	const onImport = async () => {
		if (source === SOURCE.EXCEL) {
			if (!file)
				return addError({
					text: isProspecting
						? "Please add a supported file type"
						: " Please add a CSV file!",
				});
			navigateToCsvImport(
				file,
				user.integration_type,
				cadence,
				navigate,
				type,
				isProspecting
			);
		} else {
			if (sheetUrl.split("/").length !== 7)
				return addError({ text: "Invalid Sheet Url" });
			navigateToSheetsImport(sheetUrl, user.integration_type, cadence, navigate);
		}
	};

	const onClose = () => {
		setFile(null);
		setModal(false);
	};

	const onProspectingChange = () => setIsProspecting(prev => !prev);

	useEffect(() => {
		return () => setIsProspecting(false);
	}, [modal]);

	return (
		<Modal
			isModal={modal}
			onClose={onClose}
			disableOutsideClick
			showCloseButton
			leftCloseIcon
			className={styles.importLeadsModal}
		>
			<Title size="1.1rem" className={styles.title}>
				Import leads
			</Title>
			<div className={styles.wrapper}>
				<div className={styles.source}>
					<Label>Source</Label>
					<Select
						value={source}
						setValue={setSource}
						options={SOURCE_OPTIONS}
						numberOfOptionsVisible="3"
						placeholder="Select here"
					></Select>
				</div>
				{source === SOURCE.EXCEL ? (
					<>
						{(user?.integration_type === INTEGRATION_TYPE.HUBSPOT ||
							user?.integration_type === INTEGRATION_TYPE.SELLSY ||
							user?.integration_type === INTEGRATION_TYPE.BULLHORN) && (
							<div className={styles.inputGroup}>
								<div className={styles.prospecting}>
									<div>
										<div>
											<InputRadio
												checked={!isProspecting}
												onChange={onProspectingChange}
											/>
										</div>
										<div>
											<span>Leads exist in {capitalize(user?.integration_type)}</span>
											<p>
												Your .csv file contain leads that are already present in{" "}
												{capitalize(user?.integration_type)} and hence your activities can
												be synced with your CRM
											</p>
										</div>
									</div>
									<div>
										<div>
											<InputRadio
												checked={isProspecting}
												onChange={onProspectingChange}
											/>
										</div>
										<div>
											<span>
												Leads do not exist in {capitalize(user?.integration_type)}{" "}
												{/* <div className={styles.prospecting}>prospecting</div> */}
											</span>
											<p>
												Your .csv file contain leads that are not present in{" "}
												{capitalize(user?.integration_type)} and hence your activities
												cannot be synced with your CRM. You can however export them to
												your CRM through our tool.
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
						<div className={styles.inputGroup}>
							<DragNDropFile
								className={styles.dropContainer}
								droppedFile={file}
								setDroppedFile={setFile}
								type={type}
								setType={setType}
								options={getTypeOptions(user?.integration_type)}
								integrationType={isProspecting ? null : user?.integration_type}
								extnsAllowed={
									user.integration_type === INTEGRATION_TYPE.EXCEL ||
									checkExcelFileSupport(user, isProspecting)
										? EXCEL_FILE_EXTNS
										: ["csv"]
								}
								maxSize={5000000}
							/>
						</div>
					</>
				) : (
					<div className={styles.inputGroup} style={{ marginTop: "30px" }}>
						<Label>Enter link</Label>
						<Input
							height="50px"
							value={sheetUrl}
							setValue={setSheetUrl}
							className={styles.input}
							placeholder="Enter link"
							theme={InputThemes.WHITE}
						/>
					</div>
				)}
				<div className={styles.sampleLink}>
					{source === SOURCE.EXCEL ? (
						<span>
							We support{" "}
							{checkExcelFileSupport(user, isProspecting) ? (
								EXCEL_FILE_EXTNS.map((extn, index) => (
									<>
										<a
											href={getSampleCsvUrl(
												user?.integration_type,
												type,
												isProspecting
											).replace("csv", extn)}
											target="_blank"
											rel="noreferrer"
											download
										>
											.{extn}
										</a>
										{index < EXCEL_FILE_EXTNS.length - 2 && ", "}
										{index === EXCEL_FILE_EXTNS.length - 2 && " and "}
									</>
								))
							) : (
								<a
									href={getSampleCsvUrl(user?.integration_type, type, isProspecting)}
									target="_blank"
									rel="noreferrer"
									download
								>
									.csv
								</a>
							)}
						</span>
					) : (
						<a
							href={getSampleSheetsUrl(user?.integration_type)}
							target="_blank"
							rel="noreferrer"
							download
						>
							Sample Google sheet
						</a>
					)}
				</div>
				<div className={styles.helpLinks}>
					{source === SOURCE.EXCEL &&
						((user?.integration_type === INTEGRATION_TYPE.HUBSPOT && !isProspecting) ||
							(user?.integration_type === INTEGRATION_TYPE.BULLHORN && !isProspecting) ||
							(user?.integration_type === INTEGRATION_TYPE.SELLSY && !isProspecting)) && (
							<a
								href={importCsvDocsUrl(user?.integration_type)}
								target="_blank"
								rel="noreferrer"
							>
								{
									SETTINGS_TRANSLATION.READ_SUPPORT_DOCUMENTATION[
										user?.language?.toUpperCase()
									]
								}
							</a>
						)}
				</div>
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.importLeadsBtn}
				onClick={onImport}
			>
				Confirm
			</ThemedButton>
		</Modal>
	);
};

export default ImportLeadsModal;
