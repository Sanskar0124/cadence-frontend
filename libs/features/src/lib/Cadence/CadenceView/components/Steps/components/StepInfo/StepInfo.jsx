import { useNodeStats } from "@cadence-frontend/data-access";
import { useEffect, useState } from "react";

import { userInfo } from "@cadence-frontend/atoms";
import { Tooltip } from "@cadence-frontend/components";
import { CADENCE_NODE_TYPES, STEP_NAME_MAP } from "@cadence-frontend/constants";
import { Close } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import Content from "./components/Content/Content";
import EndCadenceView from "./components/EndCadenceView/EndCadenceView";
import PeopleAndUser from "./components/PeopleAndUser/PeopleAndUser";
import { ALPHABETS } from "./constants";
import styles from "./StepInfo.module.scss";

const TABS = {
	CONTENT: "content",
	PEOPLE_AND_USER: "people_and_user",
};

const BUTTONS = [
	{ label: COMMON_TRANSLATION.CONTENT, value: TABS.CONTENT },
	{ label: COMMON_TRANSLATION.PEOPLE_AND_USER, value: TABS.PEOPLE_AND_USER },
];

const StepInfo = ({ stepId, onClose, cadence, movedLeads }) => {
	const { nodeStats, nodeStatsLoading } = useNodeStats(stepId);
	const [tab, setTab] = useState(TABS.CONTENT);
	const [templateIndex, setTemplateIndex] = useState(0);
	const [step, setStep] = useState(cadence?.sequence?.find(s => s.node_id === stepId));
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		setTemplateIndex(0);
	}, [stepId]);
	useEffect(() => {
		setStep(cadence?.sequence?.find(s => s.node_id === stepId));
	}, [cadence, stepId]);
	return (
		<div className={styles.stepInfo}>
			<div className={styles.header}>
				<ThemedButton
					className={styles.closeBtn}
					onClick={onClose}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text={COMMON_TRANSLATION.CLOSE[user?.language?.toUpperCase()]}>
						<Close color={"#567191"} />
					</Tooltip>
				</ThemedButton>
				<h3>
					<span>
						{COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]} {step?.step_number}:
					</span>
					{STEP_NAME_MAP[step?.type]}
				</h3>
			</div>
			<div className={styles.main}>
				{step?.type === CADENCE_NODE_TYPES.END ? (
					<EndCadenceView data={step.data} movedLeads={movedLeads} />
				) : (
					<div className={styles.contentAndPeople}>
						{step?.data?.aBTestEnabled && (
							<div className={styles.mailSlider}>
								<TabNavSlider
									buttons={step?.data?.templates?.map((_, i) => ({
										label: `${
											[
												CADENCE_NODE_TYPES.AUTOMATED_MESSAGE,
												CADENCE_NODE_TYPES.MESSAGE,
											]?.includes(step?.type)
												? "SMS"
												: "Mail"
										} ${ALPHABETS[i]}`,
										value: i,
									}))}
									theme={TabNavThemes.SLIDER}
									value={templateIndex}
									setValue={setTemplateIndex}
									activeBtnClassName={styles.activeTab}
									btnClassName={styles.tabBtn}
									width="100%"
									name="mail"
								/>
							</div>
						)}
						<div className={styles.navSlider}>
							<TabNavSlider
								theme={TabNavThemes.GREY}
								buttons={BUTTONS.map(opt => ({
									label: opt.label[user?.language?.toUpperCase()],
									value: opt.value,
								}))}
								value={tab}
								setValue={setTab}
								className={styles.tabs}
								btnClassName={styles.tabBtns}
								activeBtnClassName={styles.tabBtnActive}
								activePillClassName={styles.activePill}
								name="stepinfo"
							/>
						</div>
						<div className={styles.contentBox}>
							{tab === TABS.CONTENT ? (
								<Content step={step} templateIndex={templateIndex} cadence={cadence} />
							) : (
								<PeopleAndUser stats={nodeStats} loading={nodeStatsLoading} />
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StepInfo;
