import React, { useState } from "react";
import styles from "./StepsContainer.module.scss";
import { BackButton, ThemedButton } from "@cadence-frontend/widgets";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	ChevronLeft,
	NotePen,
	Pen,
	Steps,
	Automation,
	Duration,
	TimerGradient,
	NoStep,
	AutomatedThunderIcon,
} from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Div, ErrorBoundary, Skeleton, Tooltip } from "@cadence-frontend/components";
import { convertFromMinutes, getTotalDurationOfCadence } from "./utils";
import { STEP_ICONS } from "./constants";
import { CADENCE_NODE_TYPES, ELONGATED_STEP_NAME_MAP } from "@cadence-frontend/constants";
import { STEP_FIELD_NAME } from "../../../Steps/components/StepInfo/constants";
import { useCadencesTemplates } from "@cadence-frontend/data-access";
import { useNavigate, useParams } from "react-router-dom";

const StepsContainer = ({ nodeData, setIsSelected, cadenceId, setModal }) => {
	const automationNodeLength = nodeData?.nodes.filter(item =>
		item.type.includes("automated")
	).length;
	const user = useRecoilValue(userInfo);
	const navigate = useNavigate();
	let { id: cadence_id } = useParams();
	cadence_id = parseInt(cadence_id);
	const [error, setError] = useState("");
	const { getSelectedTemplate, templateLoading, success } = useCadencesTemplates(
		{
			template: false,
		},
		{}
	);

	const handleSelectedTemplate = (nodeData, setModal) => {
		const body = {
			cadence_id: cadenceId,
			cadence_template_id: nodeData.cadence_template_id.toString(),
		};

		getSelectedTemplate(body, {
			onSuccess: data => {
				setModal(false);
				navigate(`/cadence/edit/${cadence_id}`);
			},
			onError: err => {
				setError(err?.message ?? "unable to redirect");
			},
		});
	};

	return (
		<div className={styles.stepscontainer}>
			<ErrorBoundary>
				<div className={styles.backbtn} onClick={() => setIsSelected(false)}>
					<ChevronLeft color={Colors.darkBlue} size={10} />
					<span>Back</span>
				</div>
				<div className={styles.steps}>
					<div className={styles.templatedetails}>
						<p className={styles.templatetype}>{nodeData.type}</p>
						<p className={styles.name}>{nodeData?.name}</p>
						<div className={styles.details}>
							<div>
								<Duration color={Colors.lightBlue} />
								<span>Duration: {getTotalDurationOfCadence(nodeData?.nodes)} </span>
							</div>
							<div>
								<Automation color={Colors.lightBlue} />
								<span>
									Automation:
									{(
										(automationNodeLength / nodeData?.nodes?.length) *
										100
									).toFixed()}%{" "}
								</span>
							</div>
							<div>
								<Steps color={Colors.lightBlue} />{" "}
								<span>Steps: {nodeData?.nodes?.length} </span>
							</div>
						</div>
						<div className={styles.allsteps}>
							{nodeData?.nodes.length === 0 ? (
								<div className={styles.linePlaceholders}>
									{[...Array(4).keys()].map(key => (
										<Skeleton className={styles.linePlaceholder} />
									))}
								</div>
							) : (
								nodeData?.nodes?.length > 0 &&
								nodeData?.nodes.map((step, index) => {
									const isNodeMailType = [
										CADENCE_NODE_TYPES.MAIL,
										CADENCE_NODE_TYPES.AUTOMATED_MAIL,
										CADENCE_NODE_TYPES.REPLY_TO,
										CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO,
									].includes(step?.type)
										? true
										: false;
									const isNodeSMSType = [
										CADENCE_NODE_TYPES.MESSAGE,
										CADENCE_NODE_TYPES.AUTOMATED_MESSAGE,
									].includes(step?.type);
									return (
										<>
											{index !== 0 && (
												<div className={styles.waitTime}>
													<span>
														<TimerGradient size="15px" />
													</span>{" "}
													&nbsp; &nbsp;&nbsp; Wait for &nbsp;
													{convertFromMinutes(step?.wait_time).time}{" "}
													{convertFromMinutes(step?.wait_time, user).duration}
												</div>
											)}
											<div key={step?.data?.type} className={`${styles.step} `}>
												<div className={styles.left}>
													<div className={styles.header}>
														<div className={styles.stepName}>
															<div className={styles.stepIcon}>
																{STEP_ICONS[step?.type]}
															</div>
															<div className={styles.stepInfo}>
																<h3>
																	<span>
																		{
																			COMMON_TRANSLATION.STEP[
																				user?.language?.toUpperCase()
																			]
																		}{" "}
																		{index + 1}:
																	</span>
																	<span style={{ fontWeight: 600 }}>
																		{
																			ELONGATED_STEP_NAME_MAP[step?.type][
																				user?.language?.toUpperCase()
																			]
																		}
																	</span>
																	{step?.type === CADENCE_NODE_TYPES.AUTOMATED_MAIL ? (
																		<Tooltip text="Automated mail">
																			<AutomatedThunderIcon color={Colors.mainPurple} />
																		</Tooltip>
																	) : step?.type ===
																			CADENCE_NODE_TYPES.AUTOMATED_MESSAGE ||
																	  step?.type ===
																			CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO ? (
																		<AutomatedThunderIcon color={Colors.mainPurple} />
																	) : null}
																	{step?.is_urgent && (
																		<div className={styles.urgentTag}>Urgent</div>
																	)}
																</h3>
															</div>
														</div>
													</div>
												</div>
											</div>
										</>
									);
								})
							)}
						</div>
					</div>
				</div>
				<div className={styles.messageandbtncontainer}>
					<div className={styles.messageandicon}>
						<Pen size={20} />
						<div className={styles.message}>
							{COMMON_TRANSLATION.TEMPLATE_MODAL_MSG[user?.language.toUpperCase()]}
						</div>
					</div>
					<ThemedButton
						height="52px"
						className={styles.templatebtn}
						theme={ThemedButtonThemes.PRIMARY}
						onClick={() => handleSelectedTemplate(nodeData, setModal)}
						loading={templateLoading}
					>
						{CADENCE_TRANSLATION.USE_THIS_TEMPLATE[user?.language.toUpperCase()]}
					</ThemedButton>
				</div>
			</ErrorBoundary>
		</div>
	);
};

export default StepsContainer;
