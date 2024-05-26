import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MessageContext } from "@cadence-frontend/contexts";
import { Div, ErrorBoundary, Skeleton, Tooltip } from "@cadence-frontend/components";
import { ThemedButton, Toggle } from "@cadence-frontend/widgets";
import {
	TimerGradient,
	NoStep,
	AutomatedThunderIcon,
	PlusOutline,
} from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import Sidebar from "../Sidebar/Sidebar";

import {
	CADENCE_NODE_TYPES,
	CADENCE_STATUS,
	ELONGATED_STEP_NAME_MAP,
	INITIAL_TOUR_STEPS_ENUM,
	PRODUCT_TOUR_STATUS,
} from "@cadence-frontend/constants";
import { ACTIONS } from "../../../constants";
import { VIEW_MODES } from "../../constants";
import { STEP_ICONS, ALPHABETS, getMailStats, getStepStats } from "./constants";

import { convertFromMinutes } from "./utils";
import { isActionPermitted } from "../../../utils";

import { STEP_FIELD_NAME } from "./components/StepInfo/constants";
import { capitalize, Colors, StripHtml } from "@cadence-frontend/utils";

import styles from "./Steps.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import TemplateModal from "../TemplateModal/TemplateModal";
import { useRecoilState } from "recoil";
import { tourInfo } from "@cadence-frontend/atoms";
import { useUser } from "@cadence-frontend/data-access";

const Steps = ({ cadenceSettingsDataAccess, user, viewMode, setViewMode }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const [tour, setTour] = useRecoilState(tourInfo);
	const { updateUser } = useUser();

	let { id: cadence_id } = useParams();
	cadence_id = parseInt(cadence_id);
	const navigate = useNavigate();

	const {
		cadence,
		cadenceLoading,
		cadenceRefetching,
		stepsStats,
		stepsStatsLoading,
		updateNode,
	} = cadenceSettingsDataAccess;

	const [activeStep, setActiveStep] = useState(null);
	const [sidebarWidth, setSidebarWidth] = useState("0%");
	const [data, setData] = useState();
	const [mailStats, setMailStats] = useState(null);
	const [movedLeads, setMovedLeads] = useState(null);
	const [modal, setModal] = useState(false);

	useEffect(() => {
		if (cadence) {
			setData(cadence?.sequence);
			if (
				tour?.status === PRODUCT_TOUR_STATUS.AFTER_ONBOARDING_PENDING &&
				tour?.currentStep ===
					INITIAL_TOUR_STEPS_ENUM.CLICK_HERE_TO_CHECK_OUT_YOUR_FIRST_CADENCE
			) {
				let NEW_STEP =
					tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1];
				updateUser(
					{
						product_tour_step: {
							step: NEW_STEP,
							url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
						},
					},
					{
						onSuccess: () => {
							setTour(prev => ({
								...prev,
								currentStep: NEW_STEP,
								currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
								currentStepCompleted: false,
							}));
						},
						onError: err => {
							addError({
								text: err?.response?.data?.msg,
								desc: err?.response?.data?.error,
								cId: err?.response?.data?.correlationId,
							});
							setTour(prev => ({
								...prev,
								currentStepCompleted: false,
								isError: true,
							}));
						},
					}
				);
			}
		}
		const currTimeout = setTimeout(() => {
			if (cadence?.sequence?.[0]) handleStepClick(cadence.sequence[0]);
			else onSidebarClose();
		}, 400);
		return () => clearTimeout(currTimeout);
	}, [cadence]);

	const onSave = (nodeId, toggleOffIndex, divPercent) => {
		let trydata = (() => {
			let arr = [];
			let divideInto =
				data
					.filter(item => item.node_id === nodeId)?.[0]
					?.data?.templates.filter(temp => temp.percentage !== 0).length - 1;
			let totalLength = data.filter(item => item.node_id === nodeId)?.[0]?.data?.templates
				.length;
			for (let i = 0; i < totalLength; i++) {
				if (
					i === toggleOffIndex ||
					data.filter(item => item.node_id === nodeId)?.[0]?.data?.templates[i]
						.percentage === 0
				)
					arr.push(0);
				else arr.push(Math.floor(divPercent / divideInto));
			}
			let rem = divPercent % divideInto;

			for (let i = 0; rem !== 0; i++) {
				if (
					i !== toggleOffIndex &&
					data.filter(item => item.node_id === nodeId)?.[0]?.data?.templates[i]
						.percentage !== 0
				) {
					arr[i] = arr[i] + 1;
					rem--;
				}
			}
			return {
				...data.filter(item => item.node_id === nodeId)?.[0]?.data,
				templates: data
					.filter(item => item.node_id === nodeId)?.[0]
					?.data?.templates.map((template, i) => {
						if (i === toggleOffIndex) {
							return { ...template, percentage: 0 };
						}
						return {
							...template,
							percentage: template.percentage === 0 ? 0 : template.percentage + arr[i],
						};
					}),
			};
		})();

		let dataToUpdate = {
			node_id: nodeId,
			body: {
				data: trydata,
			},
			type: "",
		};

		updateNode(dataToUpdate, {
			onSuccess: () => {
				addSuccess("Node updated");
			},
			onError: err => {
				addError({ text: "Error while updating, please try again" });
			},
		});
	};

	const handleStepClick = step => {
		setMailStats(null);
		setViewMode(VIEW_MODES.CADENCE_STEP);
		setSidebarWidth("46%");
		setActiveStep(step?.node_id);
		setMovedLeads(
			step?.type === CADENCE_NODE_TYPES.END
				? stepsStats?.[step?.step_number - 1]?.movedLeads
				: null
		);
	};

	const onSidebarClose = () => {
		setActiveStep(null);
		setViewMode(null);
		setSidebarWidth("0");
		setMailStats(null);
		setMovedLeads(null);
	};

	const handleStatClick = (node_id, type, stats, isSMS) => {
		setActiveStep(null);
		setMailStats({ node_id, type, stats, isSMS });
		setViewMode(VIEW_MODES?.MAIL_STATISTICS);
		setSidebarWidth("46%");
		setMovedLeads(null);
	};

	const renderSubject = step => {
		if (
			step.type === CADENCE_NODE_TYPES.REPLY_TO ||
			step.type === CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO
		) {
			let orignal = cadence?.sequence?.find(
				st => st.node_id === step?.data.replied_node_id
			);
			if (orignal?.data?.aBTestEnabled) return;
			return <span>Sub: Re: {orignal?.data.subject}</span>;
		}
		return <span>Sub: {step?.data?.subject}</span>;
	};

	return (
		<div className={styles.container}>
			<ErrorBoundary>
				<div className={styles.steps}>
					{cadenceLoading || cadenceRefetching ? (
						<div className={styles.placeholder}>
							{[...Array(5).keys()].map(() => (
								<div>
									<Div loading />
									<Div loading />
								</div>
							))}
						</div>
					) : cadence?.sequence?.length ? (
						cadence?.sequence?.map((step, index) => {
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
											<TimerGradient size="15px" />{" "}
											{convertFromMinutes(step.wait_time).time}{" "}
											{convertFromMinutes(step.wait_time, user).duration}
										</div>
									)}
									<div
										key={step.node_id}
										className={`${styles.step} ${
											activeStep === step.node_id && styles.activeStep
										}`}
										onClick={() => handleStepClick(step)}
									>
										<div className={styles.left}>
											<div className={styles.header}>
												<div className={styles.stepName}>
													<div className={styles.stepIcon}>{STEP_ICONS[step.type]}</div>
													<div className={styles.stepInfo}>
														<h3>
															<span>
																{COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]}{" "}
																{index + 1}:
															</span>
															<span
																className={
																	step.type === "reply_to" ||
																	step.type === "automated_reply_to"
																		? styles.capitalize
																		: styles.name
																}
															>
																{
																	ELONGATED_STEP_NAME_MAP[step.type]?.[
																		user?.language?.toUpperCase()
																	]
																}
															</span>

															{step?.type === CADENCE_NODE_TYPES.AUTOMATED_MAIL ? (
																<Tooltip text="Automated mail">
																	<AutomatedThunderIcon color={Colors.mainPurple} />
																</Tooltip>
															) : step?.type === CADENCE_NODE_TYPES.AUTOMATED_MESSAGE ||
															  step?.type === CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO ? (
																<AutomatedThunderIcon color={Colors.mainPurple} />
															) : null}
															{step.is_urgent && (
																<div className={styles.urgentTag}>Urgent</div>
															)}
														</h3>
														{!isNodeMailType &&
															!isNodeSMSType &&
															step?.data[STEP_FIELD_NAME[step?.type]]?.length > 0 && (
																<p className={viewMode ? styles.sidebarOpen : ""}>
																	{(step?.data[0]?.[STEP_FIELD_NAME[step?.type]] ||
																		step?.data[STEP_FIELD_NAME[step?.type]]) && (
																		<span>
																			{StripHtml(
																				step?.data[STEP_FIELD_NAME[step?.type]]
																			).slice(0, 200)}
																		</span>
																	)}
																</p>
															)}
													</div>
												</div>
												<div className={styles.stepStats}>
													<div className={styles.toggleBox}>
														{step?.data?.templates?.map((item, i) => {
															return (
																<div
																	className={styles.toggle}
																	onClick={e => {
																		e.stopPropagation();
																		if (
																			item.percentage !== 100 &&
																			item.percentage !== 0 &&
																			isActionPermitted(
																				ACTIONS.UPDATE,
																				cadence?.type,
																				user?.role,
																				user?.user_id === cadence?.user_id
																			)
																		) {
																			onSave(step.node_id, i, item.percentage);
																		}
																	}}
																>
																	<div>{`${isNodeMailType ? "Email" : ""}${
																		isNodeSMSType ? "SMS" : ""
																	} ${ALPHABETS[i]} (${item.percentage}%)`}</div>
																	<Toggle
																		checked={item.percentage !== 0}
																		disabled={
																			item.percentage === 0 ||
																			!isActionPermitted(
																				ACTIONS.UPDATE,
																				cadence?.type,
																				user?.role,
																				user?.user_id === cadence?.user_id
																			)
																		}
																		theme={"PURPLE"}
																	/>
																</div>
															);
														})}
													</div>
													<Div className={styles.statistics}>
														{stepsStatsLoading
															? [...Array(3).keys()].map(_ => (
																	<Skeleton className={styles.statsLoading} />
															  ))
															: step?.type !== CADENCE_NODE_TYPES.END &&
															  getStepStats(user, stepsStats?.[index])?.map(item => {
																	return (
																		(item.value === "DONETASKS" ||
																			item.value === "PEOPLE" ||
																			item.count > 0) && (
																			<Tooltip text={capitalize(item.label)}>
																				<div
																					className={styles[item.className] ?? ""}
																					onClick={e => {
																						e.preventDefault();
																						e.stopPropagation();
																						handleStatClick(step?.node_id, item.value, {
																							count: item.count,
																						});
																					}}
																				>
																					{item.icon}
																					<span>{item.count}</span>
																				</div>
																			</Tooltip>
																		)
																	);
															  })}
													</Div>
												</div>
											</div>
											{(isNodeMailType || isNodeSMSType) && step?.data?.aBTestEnabled ? (
												<div className={styles.mailBox}>
													<div className={styles.body}>
														{step?.data?.templates.map((item, i) => {
															return (
																<div className={styles.mailHead}>
																	<div
																		className={`${styles.mail} ${
																			viewMode ? styles.sidebarOpen : ""
																		}`}
																	>
																		<div>{`${isNodeMailType ? "Email" : ""}${
																			isNodeSMSType ? "SMS" : ""
																		} ${ALPHABETS[i]}`}</div>
																		<p>
																			{step?.type !== CADENCE_NODE_TYPES.REPLY_TO &&
																				step?.type !==
																					CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO &&
																				!isNodeSMSType && (
																					<span>Sub: {item.subject}</span>
																				)}
																			{item.body && (
																				<span>
																					Body:
																					{StripHtml(item.body)}
																				</span>
																			)}
																			{item.message && (
																				<span>
																					Body:
																					{StripHtml(item.message)}
																				</span>
																			)}
																		</p>
																	</div>

																	<Div className={styles.statistics}>
																		{!stepsStatsLoading &&
																			stepsStats[index]?.data &&
																			getMailStats(
																				user,
																				stepsStats[index]?.data?.[item?.ab_template_id]
																			)?.map(stats => {
																				// console.log(stats);

																				return (
																					stats.count > 0 && (
																						<Tooltip
																							text={`${capitalize(stats.label)}: ${
																								stats.count
																							}`}
																						>
																							<div
																								className={
																									(stats.value === "BOUNCED" ||
																										stats.value === "UNSUBSCRIBED") &&
																									styles.red
																								}
																								onClick={e => {
																									e.preventDefault();
																									e.stopPropagation();
																									handleStatClick(
																										step?.node_id,
																										stats.value,
																										{
																											ab_template_id:
																												item?.ab_template_id,
																											count: stats.count,
																											percentage: stats.percentage,
																											total_sent: stats.total_sent,
																										},
																										isNodeSMSType
																									);
																								}}
																							>
																								{stats.icon}
																								<span className={styles.peopleStats}>
																									{stats.percentage + "%"}
																								</span>
																							</div>
																						</Tooltip>
																					)
																				);
																			})}
																	</Div>
																</div>
															);
														})}
													</div>
												</div>
											) : isNodeMailType || isNodeSMSType ? (
												<div className={styles.mailBox}>
													<div className={styles.body}>
														<div className={styles.mailHead}>
															<div
																className={`${styles.mail} ${
																	viewMode ? styles.sidebarOpen : ""
																}`}
															>
																<div>{isNodeMailType ? "Email" : "SMS"}</div>
																<p>
																	{isNodeMailType && renderSubject(step)}
																	{(step?.data[0]?.[STEP_FIELD_NAME[step?.type]] ||
																		step?.data[STEP_FIELD_NAME[step?.type]]) && (
																		<span>
																			{StripHtml(
																				step?.data[STEP_FIELD_NAME[step?.type]]
																			).slice(0, 200)}
																		</span>
																	)}
																</p>
															</div>
															<Div className={styles.statistics}>
																{!stepsStatsLoading &&
																	stepsStats?.[index]?.data &&
																	getMailStats(user, stepsStats[index].data)?.map(
																		item => {
																			return (
																				item.count > 0 && (
																					<Tooltip
																						text={`${capitalize(item.label)}: ${
																							item.count
																						}`}
																					>
																						<div
																							className={
																								(item.value === "BOUNCED" ||
																									item.value === "UNSUBSCRIBED") &&
																								styles.red
																							}
																							onClick={e => {
																								e.preventDefault();
																								e.stopPropagation();
																								handleStatClick(
																									step?.node_id,
																									item.value,
																									{
																										count: item.count,
																										percentage: item.percentage,
																										total_sent: item.total_sent,
																									}
																								);
																							}}
																						>
																							{item.icon}
																							<span className={styles.peopleStats}>
																								{item.percentage + "%"}
																							</span>
																						</div>
																					</Tooltip>
																				)
																			);
																		}
																	)}
															</Div>
														</div>
													</div>
												</div>
											) : null}
										</div>
									</div>
								</>
							);
						})
					) : (
						<div className={styles.noSteps}>
							<NoStep />
							{/* <h4>{COMMON_TRANSLATION.NO_STEPS_ADDED[user?.language?.toUpperCase()]}</h4>
							<ThemedButton
								height="40px"
								width="fit-content"
								style={{ marginTop: "20px" }}
								theme={ThemedButtonThemes.GREY}
								onClick={() => navigate(`/cadence/edit/${cadence_id}`)}
								disabled={
									cadence?.status === CADENCE_STATUS.IN_PROGRESS ||
									cadence?.status === CADENCE_STATUS.PROCESSING ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
							>
								<PlusOutline />
								<div>Add steps</div>
							</ThemedButton> */}
							<h4 className={styles.title}>
								{COMMON_TRANSLATION.DO_NOT_HAVE_STEPS[user?.language?.toUpperCase()]}
							</h4>
							{isActionPermitted(
								ACTIONS.UPDATE,
								cadence?.type,
								user?.role,
								user?.user_id === cadence?.user_id
							) && (
								<>
									<p>
										{
											COMMON_TRANSLATION.YOU_ARE_ONLY_ONE_CLICK_AWAY[
												user?.language?.toUpperCase()
											]
										}
									</p>
									<div className={styles.btncontainer}>
										<ThemedButton
											height="52px"
											width="250px"
											className={`${styles.addStepBtn} ${styles.useTemplateBtn}`}
											theme={ThemedButtonThemes.WHITE}
											onClick={() => navigate(`/cadence/edit/${cadence_id}`)}
										>
											<div>
												{
													CADENCE_TRANSLATION.START_FROM_SCRATCH[
														user?.language.toUpperCase()
													]
												}
											</div>
										</ThemedButton>
										<ThemedButton
											height="52px"
											width="250px"
											className={styles.addStepBtn}
											theme={ThemedButtonThemes.PRIMARY}
											onClick={() => setModal(true)}
										>
											<div>
												{CADENCE_TRANSLATION.USE_TEMPLATE[user?.language.toUpperCase()]}
											</div>
										</ThemedButton>
									</div>
								</>
							)}
						</div>
					)}
				</div>
				<div
					className={styles.sidebar}
					style={{
						width: sidebarWidth,
					}}
				>
					{activeStep != null ? (
						<Sidebar
							stepId={activeStep}
							viewMode={viewMode}
							setViewMode={setViewMode}
							cadence={cadence}
							movedLeads={movedLeads}
							onSidebarClose={onSidebarClose}
							height="calc(100vh - 190px)"
						/>
					) : (
						mailStats !== null && (
							<Sidebar
								statsData={mailStats}
								viewMode={viewMode}
								setViewMode={setViewMode}
								cadence={cadence}
								onSidebarClose={onSidebarClose}
								height="calc(100vh - 190px)"
							/>
						)
					)}
				</div>
				{modal && (
					<TemplateModal
						modal={modal}
						setModal={setModal}
						cadenceSettingsDataAccess={cadenceSettingsDataAccess}
						cadence={cadence}
					/>
				)}
			</ErrorBoundary>
		</div>
	);
};

export default Steps;
