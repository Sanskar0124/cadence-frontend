import { userInfo } from "@cadence-frontend/atoms";
import { Container, Title } from "@cadence-frontend/components";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TabNavThemes } from "@cadence-frontend/themes";
import { BackButton, TabNavSlider } from "@cadence-frontend/widgets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styles from "./Integrations.module.scss";
import CrmCard from "./components/CrmCard/CrmCard";
import { INTEGRATIONS_TABNAV_OPTIONS } from "./constants";
import SwitchCrmModal from "./components/SwitchCrmModal/SwitchCrmModal";

const Integrations = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);

	// const [activeTab, setActiveTab] = useState("crm");
	const [switchCrmModal, setSwitchCrmModal] = useState(false);

	const onBackToSettings = () => navigate("/settings");

	return (
		<Container className={styles.integrationsContainer}>
			<div className={styles.header}>
				<BackButton onClick={onBackToSettings} text="Settings" />
				<Title size="2rem">
					{COMMON_TRANSLATION.INTEGRATIONS[user?.language?.toUpperCase()]}
				</Title>
				{/* <TabNavSlider
					theme={TabNavThemes.SLIDER}
					buttons={INTEGRATIONS_TABNAV_OPTIONS.map(opt => ({
						label: opt.label[user?.language?.toUpperCase()],
						value: opt.value,
					}))}
					value={activeTab}
					setValue={setActiveTab}
					activeBtnClassName={styles.activeTab}
					btnClassName={styles.tabBtn}
					className={styles.tabNav}
					activePillClassName={styles.activePill}
					width="200px"
				/> */}
			</div>
			<div className={styles.container}>
				{Object.values(INTEGRATION_TYPE)
					.filter(
						it => ![INTEGRATION_TYPE.GOOGLE_SHEETS, INTEGRATION_TYPE.EXCEL].includes(it)
					)
					.map(type => (
						<CrmCard key={type} type={type} setSwitchCrmModal={setSwitchCrmModal} />
					))}
			</div>
			{switchCrmModal && (
				<SwitchCrmModal modal={switchCrmModal} onClose={() => setSwitchCrmModal(false)} />
			)}
		</Container>
	);
};

export default Integrations;
