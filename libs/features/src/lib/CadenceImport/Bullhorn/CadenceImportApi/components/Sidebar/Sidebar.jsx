import React from "react";

import styles from "./Sidebar.module.scss";

import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Close } from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import Filter from "./components/Filter/Filter";

const Sidebar = ({
	viewMode,
	setViewMode,
	onClose,
	leadType,
	filters,
	setFilters,
	createFilter,
	setCreateFilter,
	addFilterBtn,
	showAddFilterBtn,
	bullhornUsers,
	setOriginalBFFields,
	originalBFFields,
}) => {
	const user = useRecoilValue(userInfo);

	return (
		<div className={`${styles.sidebar}`}>
			(
			<div className={styles.header}>
				<div className={styles.top}>
					<ThemedButton
						onClick={onClose}
						className={styles.closeBtn}
						theme={ThemedButtonThemes.ICON}
					>
						<Close color={"#000"} />
					</ThemedButton>
					<Title size="1.35rem" className={styles.heading}>
						{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}
					</Title>
				</div>

				{filters[leadType]?.length ? (
					<div
						className={styles.resetAllButton}
						onClick={() => {
							setFilters(prev => ({ ...prev, [leadType]: [] }));
						}}
					>
						{COMMON_TRANSLATION.REMOVE_ALL[user?.language?.toUpperCase()]}
					</div>
				) : null}
			</div>
			)
			<Filter
				viewMode={viewMode}
				setViewMode={setViewMode}
				onClose={onClose}
				leadType={leadType}
				setFilters={setFilters}
				filters={filters}
				createFilter={createFilter}
				setCreateFilter={setCreateFilter}
				addFilterBtn={addFilterBtn}
				showAddFilterBtn={showAddFilterBtn}
				originalBFFields={originalBFFields}
				setOriginalBFFields={setOriginalBFFields}
			/>
		</div>
	);
};

export default Sidebar;
