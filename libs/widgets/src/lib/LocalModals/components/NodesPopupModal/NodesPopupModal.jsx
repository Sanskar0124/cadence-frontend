import { useState, useEffect } from "react";
// components
import { Div, Modal } from "@cadence-frontend/components";
import styles from "./NodesPopupModal.module.scss";
import SingleNode from "./components/SingleNode/SingleNode";
import ModalTop from "./components/ModalTop/ModalTop";
import { ENUMS } from "@cadence-frontend/constants";
import { useCadenceAssociated } from "@cadence-frontend/data-access";
import { Colors } from "@cadence-frontend/utils";
import { ErrorGradient, TickGradient, TickGreen } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const NodesPopupModal = ({ modal, setModal, lead, cadenceList, leadLoading }) => {
	const handleClose = () => {
		setModal(null);
	};

	const { cadenceAssociated, cadenceAssociatedLoading, fetchCadenceAssociated } =
		useCadenceAssociated(Boolean(modal), lead?.lead_id, modal?.cadence?.cadence_id);

	const [nodes, setnodes] = useState([]);
	const [unsubscribedNodeId, setUnsubscribedNodeIds] = useState(null);
	const [activeNodeId, setActiveNodeId] = useState(null);
	const [showData, setShowData] = useState(true);

	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (modal) fetchCadenceAssociated();
	}, [modal]);

	useEffect(() => {
		if (modal && cadenceAssociated) {
			setnodes(cadenceAssociated[0]?.nodes ?? []);
			setUnsubscribedNodeIds(cadenceAssociated[0]?.cadence?.unsubscribe_node_id);
		}
	}, [modal, cadenceAssociated]);

	const isMissedCall = node =>
		node.type === "call" && node.incoming && node.status.startsWith("Missed call");

	const Calculatesteps = () => {
		if (nodes?.find(node => node.status === "ongoing")) {
			return (
				<span>
					{COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]}{" "}
					{nodes.find(node => node.status === "ongoing").step_number}/{nodes.length}
				</span>
			);
		}
		if (nodes?.filter(node => node.status === "skipped").length) {
			let skippedNodes = nodes.filter(node => node.status === "skipped");
			return (
				<span>
					{COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]}{" "}
					{skippedNodes[skippedNodes.length - 1].step_number}/{nodes.length}
				</span>
			);
		}
		return (
			<span>
				{COMMON_TRANSLATION.STEP[user?.language?.toUpperCase()]} 0/{nodes.length}
			</span>
		);
	};

	const Calculatecompletion = () => {
		if (
			nodes[nodes.length - 1]?.status === "completed" ||
			nodes[nodes.length - 1]?.status === "skipped"
		) {
			return <span>100% {COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}</span>;
		}
		if (nodes?.find(node => node.status === "ongoing")) {
			return (
				<span>
					{Math.round(
						((parseInt(nodes.find(node => node.status === "ongoing").step_number) - 1) /
							parseInt(nodes.length)) *
							100
					)}
					% {COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}
				</span>
			);
		}
		if (nodes?.filter(node => node.status === "skipped").length) {
			let skippedNodes = nodes.filter(node => node.status === "skipped");
			return (
				<span>
					{Math.round(
						((parseInt(skippedNodes[skippedNodes.length - 1].step_number) - 1) /
							parseInt(nodes.length)) *
							100
					)}
					% {COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}
				</span>
			);
		}
		return <span>0% {COMMON_TRANSLATION.DONE[user?.language?.toUpperCase()]}</span>;
	};

	const renderNodeIcon = node => {
		const nodeId = parseInt(node.node_id);
		const unsubscribedId = parseInt(unsubscribedNodeId);

		if (node.Tasks[0]?.metadata && node.Tasks[0]?.metadata?.task_reason?.length)
			return <ErrorGradient size="1.7rem" />;
		else if (nodeId === unsubscribedId) {
			return ENUMS["unsubscribe"]?.icon?.default;
		} else if (
			node.status === "completed" &&
			(node.node_id < unsubscribedNodeId || unsubscribedNodeId === null)
		) {
			if (isMissedCall(node)) return ENUMS[node.type]?.icon?.missed;
			return <TickGreen size="1.7rem" color={Colors.default} />;
		} else if (isMissedCall(node)) return ENUMS[node.type]?.icon?.missed;
		else if (
			node.status === "ongoing" &&
			(node.node_id < unsubscribedNodeId || unsubscribedNodeId === null)
		) {
			return ENUMS[node.type]?.icon.gradient;
		} else if (node.status === "skipped") {
			return ENUMS["task_skipped"]?.icon.red;
		} else if (node.status === "paused") {
			return ENUMS["pause_cadence"]?.icon.yellow;
		} else if (node.node_id !== unsubscribedNodeId) {
			return ENUMS[node.type]?.icon.notdone;
		}
	};

	return (
		<Modal
			isModal={modal ? true : false}
			onClose={handleClose}
			showCloseButton
			disableCloseHover
			closeColor="#f5f6f7"
			className={styles.nopadModal}
		>
			<div className={styles.NodesPopupModal}>
				<div className={styles.top}>
					<ModalTop
						cadence={modal?.cadence}
						steps={Calculatesteps()}
						completion={Calculatecompletion()}
					/>
				</div>
				{cadenceAssociatedLoading ? (
					<Placeholder />
				) : (
					<div className={styles.nodes}>
						{nodes?.map((node, index) => (
							<SingleNode
								key={node.node_id}
								loading={leadLoading}
								node={
									cadenceList &&
									cadenceList[0]?.Tasks &&
									(cadenceList[0]?.Cadences[0]?.status === "paused" ||
										cadenceList[0]?.status === "paused") &&
									cadenceList[0]?.Tasks[0]?.Node.step_number === index + 1
										? { ...node, status: "paused" }
										: node
								}
								unsubscribedNodeId={unsubscribedNodeId}
								after={index !== nodes.length - 1}
								before={index !== 0}
								renderNodeIcon={renderNodeIcon}
								index={index}
								activeNodeId={activeNodeId}
								setActiveNodeId={setActiveNodeId}
								showData={showData}
								setShowData={setShowData}
								nodes={nodes}
							/>
						))}
					</div>
				)}
			</div>
		</Modal>
	);
};

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(6).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};

NodesPopupModal.propTypes = {};

export default NodesPopupModal;
