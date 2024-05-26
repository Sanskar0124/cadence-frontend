import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { userInfo } from "@cadence-frontend/atoms";
import { Modal, Title } from "@cadence-frontend/components";
import {
	DragNDropFile,
	InputRadio,
	Label,
	Select,
	ThemedButton,
} from "@cadence-frontend/widgets";
import { useState, useContext, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import styles from "./ImportCsvModal.module.scss";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Download } from "@cadence-frontend/icons";
import {
	getSampleCsvUrl,
	navigateToCsvImport,
	importCsvDocsUrl,
	LEADS_TYPE_AVAILABLE,
	getTypeOptions,
	checkExcelFileSupport,
	EXCEL_FILE_EXTNS,
} from "../../constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { capitalize } from "@cadence-frontend/utils";

const ImportCsvModal = ({ modal, setModal, cadence }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [file, setFile] = useState(null);
	const [type, setType] = useState("lead");
	const [isProspecting, setIsProspecting] = useState(false);

	const onImport = async () => {
		if (!file)
			return addError({
				text:
					user?.integration_type === INTEGRATION_TYPE.DYNAMICS
						? "Please add a XLSX file!"
						: isProspecting
						? "Please add a supported file type"
						: "Please add a CSV file!",
			});
		navigateToCsvImport(
			file,
			user.integration_type,
			cadence,
			navigate,
			type,
			isProspecting
		);
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
			showCloseButton
			leftCloseIcon
			className={styles.importCsvModal}
		>
			<Title size="1.1rem" className={styles.title}>
				Import {user?.integration_type !== INTEGRATION_TYPE.DYNAMICS && "leads"}
			</Title>
			<div className={styles.inputFieldsBox}>
				{(user?.integration_type === INTEGRATION_TYPE.HUBSPOT ||
					user?.integration_type === INTEGRATION_TYPE.SELLSY ||
					user?.integration_type === INTEGRATION_TYPE.BULLHORN) && (
					<div className={styles.prospecting}>
						<div>
							<div>
								<InputRadio checked={!isProspecting} onChange={onProspectingChange} />
							</div>
							<div>
								<span>Leads exist in {capitalize(user?.integration_type)}</span>
								<p>
									Your .csv file contain leads that are already present in{" "}
									{capitalize(user?.integration_type)} and hence your activities can be
									synced with your CRM
								</p>
							</div>
						</div>
						<div>
							<div>
								<InputRadio checked={isProspecting} onChange={onProspectingChange} />
							</div>
							<div>
								<span>
									Leads do not exist in {capitalize(user?.integration_type)}{" "}
									{/* <div className={styles.prospecting}>prospecting</div> */}
								</span>
								<p>
									Your .csv file contain leads that are not present in{" "}
									{capitalize(user?.integration_type)} and hence your activities cannot be
									synced with your CRM. You can however export them to your CRM through
									our tool.
								</p>
							</div>
						</div>
					</div>
				)}{" "}
				{LEADS_TYPE_AVAILABLE?.includes(user?.integration_type) && (
					<div>
						<Label>Import</Label>
						<Select
							value={type}
							setValue={setType}
							options={getTypeOptions(user?.integration_type)}
							numberOfOptionsVisible="3"
							placeholder="Select here"
						></Select>
					</div>
				)}
				<div>
					{user?.integration_type === INTEGRATION_TYPE.DYNAMICS && (
						<Label>XLSX file</Label>
					)}
					<DragNDropFile
						className={styles.dropContainer}
						droppedFile={file}
						setDroppedFile={setFile}
						type={type}
						setType={setType}
						options={getTypeOptions(user?.integration_type)}
						integrationType={isProspecting ? null : user?.integration_type}
						extnsAllowed={
							user.integration_type === INTEGRATION_TYPE.SHEETS ||
							checkExcelFileSupport(user, isProspecting)
								? EXCEL_FILE_EXTNS
								: user.integration_type === INTEGRATION_TYPE.DYNAMICS
								? ["xlsx"]
								: ["csv"]
						}
						maxSize={5000000}
					/>
				</div>
			</div>
			<div className={styles.sampleLink}>
				{user?.integration_type === INTEGRATION_TYPE.DYNAMICS ? (
					<a
						href={getSampleCsvUrl(user?.integration_type, type, isProspecting)}
						target="_blank"
						rel="noreferrer"
						download
					>
						<Download size={16} />{" "}
						<span>
							{type === "lead"
								? COMMON_TRANSLATION.SAMPLE_LEAD_XLSX_FILE[user?.language?.toUpperCase()]
								: COMMON_TRANSLATION.SAMPLE_CONTACT_XLSX_FILE[
										user?.language?.toUpperCase()
								  ]}
						</span>
					</a>
				) : (
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
				)}
			</div>
			<div className={styles.helpLinks}>
				{((user?.integration_type === INTEGRATION_TYPE.HUBSPOT && !isProspecting) ||
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
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.importLeadsBtn}
				onClick={onImport}
			>
				Import {user?.integration_type !== INTEGRATION_TYPE.DYNAMICS && "leads"}
			</ThemedButton>
		</Modal>
	);
};

export default ImportCsvModal;
