import { useState, useEffect } from "react";
import styles from "./SingleNode.module.scss";
//components
import { Div } from "@cadence-frontend/components";
import {
	AutomatedThunderIcon,
	ClickGradient,
	Timer,
	TimerGradient,
	ViewGradient,
} from "@cadence-frontend/icons";
import RenderNodePreview from "./components/RenderNodePreview/RenderNodePreview";

//constants
import { Colors } from "@cadence-frontend/utils";
import { CADENCE_NODE_TYPES, STEP_NAME_MAP } from "@cadence-frontend/constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const SingleNode = ({
	node,
	after,
	before,
	loading,
	renderNodeIcon,
	index,
	unsubscribedNodeId,
	activeNodeId,
	setActiveNodeId,
	showData,
	setShowData,
	nodes,
}) => {
	const [colors, setColors] = useState({
		main: Colors.veryLightBlue,
		textColor: Colors.veryLightBlue,
		timerColor: Colors.mainPurple,
	});
	const user = useRecoilValue(userInfo);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		AssignColor(node);
	}, [node]);

	const AssignColor = node => {
		const nodeId = parseInt(node.node_id);
		const unsubscribedId = parseInt(unsubscribedNodeId);

		if (node.Tasks[0]?.metadata && node.Tasks[0]?.metadata?.task_reason?.length) {
			setColors({
				main: Colors.redShade3,
				textColor: Colors.redShade3,
				timerColor: Colors.mainPurple,
			});
		} else if (nodeId === unsubscribedId || node.status === "skipped") {
			setColors({
				main: Colors.redShade3,
				textColor: Colors.redShade3,
				timerColor: Colors.mainPurple,
			});
		} else if (node.status === "ongoing") {
			setColors({
				main: Colors.mainPurple,
				textColor: Colors.mainPurple,
				timerColor: Colors.mainPurple,
			});
		} else if (node.status === "completed") {
			setColors({
				main: Colors.mainPurple,
				textColor: Colors.blackShade6,
				timerColor: Colors.mainPurple,
			});
		} else if (node.status === "paused") {
			setColors({
				main: Colors.yellow,
				textColor: Colors.veryLightBlue,
				timerColor: Colors.mainPurple,
			});
		}
	};

	const NodeOnClick = () => {
		if (activeNodeId === node.node_id) {
			setShowData(!showData);
			setActiveNodeId(null);
		} else if (activeNodeId === null) {
			setShowData(true);
			setActiveNodeId(node.node_id);
		} else {
			setActiveNodeId(node.node_id);
		}
	};

	const ConvertFromMinutes = mins => {
		let h = Math.floor(mins / 60);
		let d = Math.floor(h / 24);
		h = h - d * 24;
		let m = Math.floor(mins % 60);
		if (mins % 1440 === 0)
			return {
				time: d,
				duration:
					d <= 1
						? COMMON_TRANSLATION.DAY[user?.language?.toUpperCase()]
						: COMMON_TRANSLATION.DAYS[user?.language?.toUpperCase()],
			};
		else if (mins % 60 === 0)
			return {
				time: h,
				duration: COMMON_TRANSLATION.HOURS[user?.language?.toUpperCase()],
			};
		return { time: m, duration: COMMON_TRANSLATION.MINS[user?.language?.toUpperCase()] };
	};

	return (
		<Div
			className={`${styles.singleNode} ${loading ? styles.loading : ""} `}
			loading={loading}
		>
			{before ? (
				<div className={styles.singleNode__timeWrapper}>
					<div className={styles.singleNode__time}>
						{node.status === "ongoing" || node.status === "completed" ? (
							<TimerGradient
								style={{
									width: "12px",
									height: "14px",
								}}
							/>
						) : (
							<Timer
								style={{
									width: "12px",
									height: "14px",
									color: colors.textColor,
								}}
							/>
						)}

						<div
							className={
								node.status === "completed" ||
								node.status === "skipped" ||
								node.status === "ongoing" ||
								node.id === unsubscribedNodeId
									? styles.singleNode__time__textcomplete
									: styles.singleNode__time__text
							}
						>
							{ConvertFromMinutes(node.wait_time).time}{" "}
							{ConvertFromMinutes(node.wait_time).duration}
						</div>
					</div>
				</div>
			) : (
				""
			)}

			<div
				className={`${styles.singleNode__main} ${
					node.status === "ongoing" && styles.ongoing
				}`}
				onClick={NodeOnClick}
				style={{ borderColor: colors.main }}
			>
				<div
					className={`${styles.singleNode__alwaysshow}  ${
						after
							? colors.main === Colors.veryLightBlue || colors.main === Colors.yellow
								? styles.after_verylightblue
								: colors.main === Colors.mainPurple
								? styles.after_purple
								: colors.main === Colors.greenShade1
								? styles.after_green
								: colors.main === Colors.redShade3
								? styles.after_red
								: ""
							: ""
					} ${
						before
							? colors.main === Colors.veryLightBlue || colors.main === Colors.yellow
								? styles.before_verylightblue
								: colors.main === Colors.mainPurple
								? styles.before_purple
								: colors.main === Colors.greenShade1
								? styles.before_green
								: colors.main === Colors.redShade3
								? styles.before_red
								: ""
							: ""
					}`}
				>
					<div classname={styles.icon__cover}>
						<div className={`${styles.icon}`}>{renderNodeIcon(node)}</div>
					</div>

					<div className={`${styles.nodePreview}`}>
						<div
							className={styles.title}
							style={{ color: node.status === "paused" ? colors.main : colors.textColor }}
						>
							<p> Step {index + 1}: </p> {STEP_NAME_MAP[node?.type]}{" "}
							<span className={styles.isAutomated}>
								{(node?.type === CADENCE_NODE_TYPES.AUTOMATED_MAIL ||
									node?.type === CADENCE_NODE_TYPES.AUTOMATED_MESSAGE ||
									node?.type === CADENCE_NODE_TYPES.AUTOMATED_REPLY_TO) && (
									<AutomatedThunderIcon color={Colors.veryLightBlue} />
								)}
							</span>
						</div>
					</div>

					<div className={styles.trackInfo}>
						{node?.Emails?.[0]?.status === "clicked" && (
							<>
								<span>
									<ViewGradient size="18px" />
								</span>
								<span>
									<ClickGradient size="18px" />
								</span>
							</>
						)}
						{node?.Emails?.[0]?.status === "opened" && (
							<span>
								<ViewGradient size="18px" />
							</span>
						)}
						{node.status === "paused" && (
							<span className={styles.pausedText}>Paused for lead</span>
						)}
					</div>
				</div>
				{showData && activeNodeId === node.node_id && (
					<RenderNodePreview node={node} setIsActive={setIsActive} nodes={nodes} />
				)}
			</div>
		</Div>
	);
};

export default SingleNode;
