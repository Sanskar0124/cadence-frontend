import { userInfo } from "@cadence-frontend/atoms";
import { PageContainer, Spinner, Title } from "@cadence-frontend/components";
import { SESSION_STORAGE_KEYS, SOCKET_ON_EVENTS } from "@cadence-frontend/constants";
import { SocketContext } from "@cadence-frontend/contexts";
import { CadenceLogo, TickGreen } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { CallIframeContext } from "@salesforce/context";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styles from "./ChangeIntegrationProgress.module.scss";

const STATUS = {
	ERROR: "error",
	SUCCESS: "success",
};

const ChangeIntegrationProgress = () => {
	const navigate = useNavigate();
	const user = useRecoilState(userInfo);
	const { simpleSDK } = useContext(CallIframeContext);

	const { addSocketHandler } = useContext(SocketContext);

	const [progress, setProgress] = useState(0);
	const [logs, setLogs] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		if (!sessionStorage.getItem(SESSION_STORAGE_KEYS.IS_SWITCHING_CRM)) navigate("/home");
		// Prompt confirmation when reload page is triggered
		window.onbeforeunload = () => "";
		// Unmount the window.onbeforeunload event
		addSocketHandler({
			event_name: SOCKET_ON_EVENTS.INTEGRATION_CHANGE_LOGS,
			key: "change-logs",
			handler: data => handleLogsSocket(data),
		});
		return () => (window.onbeforeunload = null);
	}, []);

	const handleLogsSocket = data => {
		if (data?.error) {
			setStatus(STATUS.ERROR);
			return;
		}
		if (data?.completed) {
			setProgress(100);
			setStatus(STATUS.SUCCESS);
			return;
		}
		if (data?.current_step === 0) setLogs(data?.logs);
		setCurrentStep(data?.current_step);
		setProgress((data?.current_step / data?.logs?.length) * 100);
	};

	const logout = () => {
		window.onbeforeunload = null;
		localStorage.clear();
		sessionStorage.clear();
		simpleSDK.destroy();
		window.location.href = "/crm/login?logout=true";
	};

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.logo}>
				<CadenceLogo size="38px" />
				<div>
					<span>
						{COMMON_TRANSLATION.CADENCE[user?.language?.toUpperCase() || "ENGLISH"]}
					</span>
					<span>
						{COMMON_TRANSLATION.BY_RINGOVER[user?.language?.toUpperCase() || "ENGLISH"]}
					</span>
				</div>
			</div>
			<div className={styles.progressContainer}>
				{status !== STATUS.ERROR && (
					<div className={styles.bar}>
						<span>{Math.floor(progress)}% complete</span>
						<progress max="100" value={progress}></progress>
					</div>
				)}
				{status === STATUS.SUCCESS ? (
					<div className={styles.success}>
						<Title size="1.71rem">Switch successful!</Title>
						<p>Please login again to complete the process</p>
						<ThemedButton
							theme={ThemedButtonThemes.PRIMARY}
							onClick={logout}
							width="fit-content"
						>
							Logout
						</ThemedButton>
					</div>
				) : status === STATUS.ERROR ? (
					<div className={styles.error}>
						<span>Something went wrong!</span>
						<p>
							Error occured while changing your integration. Please contact support{" "}
							cadence@ringover.com, Your current integration is not affected
						</p>
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							onClick={() => navigate("/home")}
							width="fit-content"
						>
							Go Back
						</ThemedButton>
					</div>
				) : (
					<>
						<div className={styles.loader}>
							<Spinner className={styles.spinner} />
							<Title size="1.71rem">Switching to new CRM</Title>
						</div>
						<div className={styles.logs}>
							{logs.length > 0 ? (
								logs.map((log, index) => (
									<span className={`${index <= currentStep ? styles.active : ""}`}>
										{index < currentStep && <TickGreen size="24px" />} {log}
										{index === currentStep && "..."}
									</span>
								))
							) : (
								<span>Initialising...</span>
							)}
						</div>
					</>
				)}
			</div>
		</PageContainer>
	);
};
export default ChangeIntegrationProgress;
