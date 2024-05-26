import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import { Modal, Spinner, Title } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useProductTour, useUser } from "@cadence-frontend/data-access";
import { Csv, Grab, SuccessTick } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { DragNDropFile, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Tour as TOUR_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./ImportModal.module.scss";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useQueryClient } from "react-query";

const ImportModal = ({ modal, setModal, refetchLeads }) => {
	const queryClient = useQueryClient();
	let { id: cadence_id } = useParams();
	cadence_id = parseInt(cadence_id);
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { updateUser } = useUser();
	const [tour, setTour] = useRecoilState(tourInfo);
	const { addError } = useContext(MessageContext);
	const [fileStatus, setfileStatus] = useState({ status: "hidden", progress: 0 });

	const { importSampleLeads, importSampleLeadsLoading } = useProductTour();

	useEffect(() => {
		const timer = setTimeout(() => {
			setfileStatus({ status: "uploading", progress: 0 });
		}, 3000);
		const timer2 = setTimeout(() => {
			setfileStatus({ status: "uploaded", progress: 100 });
		}, 5000);
		return () => {
			clearTimeout(timer);
			clearTimeout(timer2);
		};
	}, []);

	const onImport = async () => {
		importSampleLeads(
			{ cadence_id },
			{
				onSuccess: () => {
					refetchLeads();
					onClose();
					queryClient.invalidateQueries("cadences-leads-stats");
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
					setTour(prev => ({
						...prev,
						isError: true,
						currentStepCompleted: false,
					}));
					setModal(false);
				},
			}
		);
	};

	const onClose = () => {
		navigate("?view=list");
		setModal(false);
	};

	return (
		<Modal isModal={modal} onClose={onClose} className={styles.modal} disableOutsideClick>
			<Title size="1.1rem" className={styles.title}>
				{CADENCE_TRANSLATION?.IMPORT_LEADS[user?.language?.toUpperCase()]}
			</Title>
			<DragNDropFile className={styles.dropContainer} disabled />
			{fileStatus.status !== "hidden" && (
				<div className={styles.fileStatus}>
					<div className={styles.file}>
						<Csv size="3rem" />
						<div>
							<span>Sample_leads.csv</span>
							<span>200kb - {fileStatus.progress}%</span>
						</div>
					</div>
					<div
						className={`${styles.status} ${
							fileStatus.status === "uploaded" ? styles.success : ""
						}`}
					>
						{fileStatus.status === "uploading" ? (
							<>
								<Spinner size="20px" color={Colors.lightBlue} />{" "}
								{TOUR_TRANSLATION.UPLOADING[user?.language?.toUpperCase()]}
							</>
						) : (
							<>
								<SuccessTick /> {TOUR_TRANSLATION.UPLOADED[user?.language?.toUpperCase()]}
							</>
						)}
					</div>
					<div className={styles.tooltip}>
						<span>{TOUR_TRANSLATION.SAMPLE_LEADS[user?.language?.toUpperCase()]}</span>
						<p>
							{TOUR_TRANSLATION.LEADS_TO_KICKSTART_CADENCE[user?.language?.toUpperCase()]}
						</p>
					</div>
				</div>
			)}
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.importLeadsBtn}
				onClick={onImport}
				id="tour-import-leads-btn"
				loading={importSampleLeadsLoading}
				disabled={fileStatus.status !== "uploaded"}
			>
				{CADENCE_TRANSLATION?.IMPORT_LEADS[user?.language?.toUpperCase()]}
			</ThemedButton>
			<div className={styles.grabIcon}>
				<div>
					<Csv size="6rem" />
					<Grab />
				</div>
			</div>
		</Modal>
	);
};

export default ImportModal;
