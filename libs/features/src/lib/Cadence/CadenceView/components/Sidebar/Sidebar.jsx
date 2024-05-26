import Statistics from "../components/LeadsList/components/Statistics/Statistics";
import Filters from "../components/LeadsList/components/Filters/Filters";
import StepInfo from "../Steps/components/StepInfo/StepInfo";
import NodeMailStats from "../Steps/components/NodeMailStats/NodeMailStats";

import { VIEW_MODES } from "../../constants";

import styles from "./Sidebar.module.scss";
import { useEffect } from "react";
import AddWorkflow from "../Workflow/components/AddWorkflow/AddWorkflow";

const Sidebar = ({
	viewMode,
	cadenceName,
	filtersProps,
	additionalFilterProps,
	statsData,
	className,
	leadsLoading,
	stepId,
	cadence,
	movedLeads,
	onSidebarClose,
	height,
	workflow,
	setWorkflow,
	index,
	setIndex,
	setViewMode,
	cadenceWorkflows,
	setCadenceWorkflows,
	activeWorkflow,
	setActiveWorkflow,
}) => {
	const renderComponent = () => {
		switch (viewMode) {
			case VIEW_MODES.STATS:
				return (
					<Statistics
						statsData={statsData}
						cadenceName={cadenceName}
						onClose={onSidebarClose}
						leadsLoading={leadsLoading}
					/>
				);

			case VIEW_MODES.FILTER:
				return (
					<Filters
						{...filtersProps}
						{...additionalFilterProps}
						statsData={statsData}
						onClose={onSidebarClose}
					/>
				);

			case VIEW_MODES.CADENCE_STEP:
				return (
					<StepInfo
						stepId={stepId}
						onClose={onSidebarClose}
						cadence={cadence}
						movedLeads={movedLeads}
					/>
				);

			case VIEW_MODES.MAIL_STATISTICS:
				return (
					<NodeMailStats
						statsData={statsData}
						onClose={onSidebarClose}
						cadence={cadence}
					/>
				);
			case VIEW_MODES.CADENCE_WORKFLOW:
				return (
					<AddWorkflow
						onClose={onSidebarClose}
						workflow={workflow}
						setWorkflow={setWorkflow}
						index={index}
						setIndex={setIndex}
						viewMode={viewMode}
						setViewMode={setViewMode}
						cadenceWorkflows={cadenceWorkflows}
						setCadenceWorkflows={setCadenceWorkflows}
						activeWorkflow={activeWorkflow}
						setActiveWorkflow={setActiveWorkflow}
						cadence={cadence}
					/>
				);
		}
	};

	const marginTop = () => {
		switch (viewMode) {
			case VIEW_MODES.STATS:
			case VIEW_MODES.FILTER:
				return "15px";
			case VIEW_MODES.CADENCE_STEP:
			case VIEW_MODES.MAIL_STATISTICS:
			case VIEW_MODES.CADENCE_WORKFLOW:
				return "0px";
		}
	};

	return (
		<div
			className={`${styles.sidebar} ${className ?? ""} ${
				viewMode ? styles.open : styles.close
			} ${viewMode}`}
			style={{
				height: height ?? "100%",
				marginTop: marginTop(),
			}}
		>
			{renderComponent()}
		</div>
	);
};

export default Sidebar;
