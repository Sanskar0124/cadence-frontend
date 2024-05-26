import { ErrorBoundary } from "@cadence-frontend/components";
import { NoWorkflow, PlusOutline } from "@cadence-frontend/icons";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useState } from "react";
import Placeholder from "../../../components/Placeholder/Placeholder";
import { VIEW_MODES } from "../../constants";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Workflow.module.scss";
import { isActionPermitted } from "../../../utils";
import { ACTIONS } from "../../../constants";

const Workflow = ({
	user,
	viewMode,
	setViewMode,
	sidebarWidth,
	setSidebarWidth,
	cadence_id,
	workflows,
	setWorkflows,
	cadenceWorkflowsLoading,
	activeWorkflow,
	setActiveWorkflow,
	addNewWorkflow,
	cadence,
}) => {
	const [singleWorkflow, setSingleWorkflow] = useState("");

	const [workflowIndex, setWorkflowIndex] = useState();
	const onSidebarClose = () => {
		setActiveWorkflow("");
		setViewMode(null);
		setSidebarWidth("0");
	};

	useEffect(() => {
		if (activeWorkflow) {
			setSingleWorkflow(workflows?.find(w => w?.id === activeWorkflow));
		}
	}, [activeWorkflow]);

	const handleWorkflowClick = (workflow, index, activeWorkflow) => {
		if (activeWorkflow === workflow?.id) {
			setActiveWorkflow("");
			setViewMode(VIEW_MODES.CADENCE_WORKFLOW);
		} else {
			setActiveWorkflow(workflow?.id);
			setViewMode(VIEW_MODES.CADENCE_WORKFLOW);
		}
		setSingleWorkflow(workflow);
		setWorkflowIndex(index + 1);
		setSidebarWidth("66%");
	};
	useEffect(() => {
		if (!activeWorkflow) {
			setViewMode(null);
		}
	}, [activeWorkflow]);

	return (
		<div className={styles.container}>
			<ErrorBoundary>
				<div className={styles.workflow}>
					{cadenceWorkflowsLoading ? (
						<Placeholder />
					) : workflows?.length > 0 ? (
						workflows?.map((workflow, index) => (
							<div className={styles.workflowsContainer} key={workflow?.workflow_id}>
								<div
									className={`${styles.workflowDetails} ${
										activeWorkflow === workflow?.id ? styles.active : ""
									}`}
									onClick={() => {
										handleWorkflowClick(workflow, index, activeWorkflow);
									}}
								>
									<p>
										{COMMON_TRANSLATION?.WORKFLOW[user?.language?.toUpperCase()]}{" "}
										{index + 1} - {workflow?.name}
									</p>
								</div>
							</div>
						))
					) : (
						<div className={styles.noWorkflow}>
							<NoWorkflow />
							<h4>
								{COMMON_TRANSLATION.NO_WORKFLOW_ADDED[user?.language?.toUpperCase()]}
							</h4>
							<ThemedButton
								height="40px"
								width="fit-content"
								className={styles.addWorkflowBtn}
								theme={ThemedButtonThemes.GREY}
								onClick={addNewWorkflow}
								disabled={
									!isActionPermitted(
										ACTIONS.UPDATE,
										cadence?.type,
										user?.role,
										user?.user_id === cadence?.user_id
									)
								}
							>
								<PlusOutline />
								<div>
									{CADENCE_TRANSLATION.ADD_WORKFLOW[user?.language?.toUpperCase()]}
								</div>
							</ThemedButton>
						</div>
					)}
				</div>
				{viewMode === VIEW_MODES.CADENCE_WORKFLOW && (
					<div
						className={styles.sidebar}
						style={{
							width: sidebarWidth,
						}}
					>
						<Sidebar
							activeWorkflow={activeWorkflow}
							setActiveWorkflow={setActiveWorkflow}
							viewMode={viewMode}
							setViewMode={setViewMode}
							onSidebarClose={onSidebarClose}
							height="calc(100vh - 190px)"
							workflow={singleWorkflow ?? {}}
							setWorkflow={setSingleWorkflow}
							index={workflowIndex}
							setIndex={setWorkflowIndex}
							cadenceWorkflows={workflows}
							setCadenceWorkflows={setWorkflows}
							cadence={cadence}
						/>
					</div>
				)}
			</ErrorBoundary>
		</div>
	);
};

export default Workflow;
