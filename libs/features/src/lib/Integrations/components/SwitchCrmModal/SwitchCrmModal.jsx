import { Modal, Title } from "@cadence-frontend/components";
import styles from "./SwitchCrmModal.module.scss";
import { Colors, capitalize, getIntegrationIcon } from "@cadence-frontend/utils";
import { CONFIRM_TEXT_MAP, STATUS_ICON_MAP, SWITCH_OPTIONS } from "./constants";
import { InputRadio, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useState } from "react";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Caution2, CautionGradient } from "@cadence-frontend/icons";
import { useCompanyIntegration } from "@cadence-frontend/data-access";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "@cadence-frontend/contexts";
import { INTEGRATION_TYPE, SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const SwitchCrmModal = ({ modal, onClose }) => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const navigate = useNavigate();
	const INTEGRATION_ICON = getIntegrationIcon({
		integration_type: modal?.type,
	});

	const { changeCompanyIntegration, changeCompanyIntegrationLoading } =
		useCompanyIntegration();

	const [selectedOption, setSelectedOption] = useState("start_from_scratch");
	const [isConfirm, setIsConfirm] = useState(false);

	const onChangeIntegration = type => {
		changeCompanyIntegration(
			{
				integration: modal?.type,
				option: selectedOption,
			},
			{
				onSuccess: () => {
					sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_SWITCHING_CRM, true);
					navigate("/change/integration");
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	};

	return (
		<Modal
			isModal={modal}
			onClose={onClose}
			showCloseButton
			className={styles.switchCrmModal}
		>
			{isConfirm ? (
				<div className={styles.confirmContainer}>
					<div className={styles.header}>
						<Caution2 color={Colors.red} size="40px" />
						<Title size="1.1rem">Switching CRMs</Title>
						<p>
							Please read the below mentioned points carefully before proceeding to the
							next step
						</p>
					</div>
					<div className={styles.info}>
						<ol type="number">
							<li>
								Once you switch your CRM, as chosen by you all your{" "}
								{CONFIRM_TEXT_MAP[selectedOption]} will be{" "}
								<span>permanently deleted</span> and{" "}
								<span>cannot be retrieved again</span>.
							</li>
							<li>
								After confirming <span>all current users</span>, including you will be{" "}
								<span>logged out</span> of the tool.
							</li>
							<li>
								Users will <span>not be able to log back into</span> the tool until the
								new CRM integration has been <span>set-up</span>.
							</li>
							{user?.integration_type === INTEGRATION_TYPE.SHEETS && (
								<li>
									<span>Re-sync</span> feature for Google sheets will{" "}
									<span>not be available</span>
								</li>
							)}
						</ol>
					</div>
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						onClick={onChangeIntegration}
						loading={changeCompanyIntegrationLoading}
					>
						Please proceed with switch
					</ThemedButton>
				</div>
			) : (
				<div className={styles.switchContainer}>
					<div className={styles.header}>
						<Title size="1.1rem" className={styles.title}>
							<INTEGRATION_ICON color={Colors.salesforce} size="2rem" /> Switch to{" "}
							{capitalize(modal?.type)}
						</Title>
						<p className={styles.desc}>
							We will shortly begin the process of switching from your current CRM to{" "}
							{capitalize(modal?.type)}. Before we begin please select one of the below
							options to help us make your switch seamless.
						</p>
					</div>
					<div className={styles.options}>
						{SWITCH_OPTIONS(user?.integration_type, modal?.type).map(option => (
							<div
								key={option.type}
								className={selectedOption === option.type ? styles.active : ""}
								onClick={() => setSelectedOption(option.type)}
							>
								<div className={styles.header}>
									<InputRadio size={20} checked={selectedOption === option.type} />
									<span>{option.title}</span>
								</div>
								<p>{option.desc}</p>
								<div className={styles.changes}>
									{option.changes_available.map(change => (
										<div key={change.title}>
											<span>
												{STATUS_ICON_MAP[change.status]} {change.title}
											</span>
											{change.desc && <p>{change.desc}</p>}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
					<ThemedButton
						theme={ThemedButtonThemes.PRIMARY}
						onClick={() => setIsConfirm(true)}
					>
						Confirm selection
					</ThemedButton>
				</div>
			)}
		</Modal>
	);
};
export default SwitchCrmModal;
