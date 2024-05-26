import moment from "moment-timezone";
import { createContext, useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Container, Div, Spinner, Title } from "@cadence-frontend/components";
import { BackButton } from "@cadence-frontend/widgets";
import { useCadenceSettings, useEmployees } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import Steps from "./components/Steps/Steps";
import StepSettings from "./components/StepSettings/StepSettings";

import styles from "./Settings.module.scss";
import { MessageContext } from "@cadence-frontend/contexts";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { isActionPermitted } from "../utils";
import { ACTIONS } from "../constants";
import { CADENCE_STATUS } from "@cadence-frontend/constants";
import { CheckCircle2 } from "@cadence-frontend/icons";

export const CadenceContext = createContext();

const Settings = () => {
	const role = useRecoilValue(userInfo).role;
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { id: cadence_id } = useParams();
	const cadenceSettingsDataAccess = useCadenceSettings(
		{
			cadence: true,
			companySettings: true,
			allowedStatuses: true,
		},
		cadence_id
	);
	const {
		updateLoading,
		lastSaved,
		addLoading,
		deleteLoading,
		cadence,
		cadenceLoading,
		error,
	} = cadenceSettingsDataAccess;
	const { employees } = useEmployees(true, role);
	let onSaveRef = useRef(null);

	const [saving, setSaving] = useState(null);
	const [activeStep, setActiveStep] = useState(false);
	const [saveVisible, setSaveVisible] = useState(false);
	const [backTriggered, setBackTriggered] = useState(false);
	const { addConfirmMessage, stepChangeable } = useContext(MessageContext);

	//TEMP: kept null to fix BackTriggered functionality
	const onSuccess = () => null;

	useEffect(() => {
		if (addLoading) setSaving("Adding step");
		else if (deleteLoading) setSaving("Deleting step");
		else if (updateLoading) setSaving("Saving changes");
		const loading = addLoading || updateLoading || deleteLoading;
		const currTimeout = setTimeout(() => setSaving(null), !loading ? 800 : 1600);
		return () => clearTimeout(currTimeout);
	}, [addLoading, updateLoading, deleteLoading]);

	useEffect(() => {
		if (backTriggered && !updateLoading) {
			navigate(`/cadence/${cadence?.cadence_id}`);
			setBackTriggered(false);
		}
	}, [backTriggered, updateLoading]);

	useEffect(() => {
		if (cadence) {
			if (
				!isActionPermitted(
					ACTIONS.UPDATE,
					cadence?.type,
					user.role,
					user.user_id === cadence?.user_id
				) ||
				cadence?.status === CADENCE_STATUS.IN_PROGRESS ||
				cadence?.status === CADENCE_STATUS.PROCESSING
			)
				navigate(-1);
		}
	}, [cadence]);

	return (
		<CadenceContext.Provider
			value={{
				activeStep,
				setActiveStep,
				saveVisible,
				setSaveVisible,
				cadenceSettingsDataAccess,
				onSaveRef,
				onSuccess,
				employees,
			}}
		>
			<Container className={styles.settings}>
				<div className={styles.header}>
					<div className={styles.left}>
						<BackButton
							text="Steps list"
							onClick={
								stepChangeable === true
									? () => {
											setActiveStep(false);
											setTimeout(() => {
												setBackTriggered(true);
											}, 500);
											return false;
									  }
									: () => {
											if (stepChangeable.type === "unsubscribeError") {
												addConfirmMessage({
													msg: "Unsubscribe Link is mandatory for automated mails",
													fun: stepChangeable.fun,
													type: stepChangeable.type,
												});
											}
											return false;
									  }
							}
							link={`/cadence/${cadence?.cadence_id}`}
							disabled={updateLoading || deleteLoading}
						/>
						<Div loading={cadenceLoading} className={styles.title}>
							<Title size="1.42rem">{cadence?.name}</Title>
						</Div>
					</div>
					<div className={styles.right}>
						{saving ? (
							<span className={`${styles.status} ${styles.saving}`}>
								<Spinner className={styles.spinner} />
								{saving}
							</span>
						) : lastSaved !== null ? (
							<span className={`${styles.status} ${styles.saved}`}>
								<CheckCircle2 />
								Saved {moment(lastSaved.time).fromNow()}
							</span>
						) : null}
						{/* {error && <span className={styles.error}>Failed to fetch cadence</span>} */}
					</div>
				</div>
				<div className={styles.container}>
					<Steps />
					<StepSettings cadence={cadence} />
				</div>
			</Container>
		</CadenceContext.Provider>
	);
};

export default Settings;
