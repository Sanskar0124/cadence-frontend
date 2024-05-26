import React, { useEffect, useState } from "react";

import styles from "./Sidebar.module.scss";
import Filters from "./components/Filters/Filters";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Close } from "@cadence-frontend/icons";
import { Title } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Sidebar = ({
	viewMode,
	setViewMode,
	onClose,
	filters,
	setFilters,
	// createFilter,
	// setCreateFilter,
	// addFilterBtn,
	// showAddFilterBtn,
	// zohoUsers,
	// setOriginalSFFields,
	// originalSFFields,
}) => {
	const user = useRecoilValue(userInfo);

	return (
		<div className={`${styles.sidebar}`}>
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

				{Object.keys(filters)?.length ? (
					<div
						className={styles.resetAllButton}
						onClick={() => {
							setFilters({});
						}}
					>
						{COMMON_TRANSLATION.REMOVE_ALL[user?.language?.toUpperCase()]}
					</div>
				) : null}
			</div>
			<Filters
				viewMode={viewMode}
				setViewMode={setViewMode}
				onClose={onClose}
				setFilters={setFilters}
				filters={filters}
				// createFilter={createFilter}
				// setCreateFilter={setCreateFilter}
				// addFilterBtn={addFilterBtn}
				// showAddFilterBtn={showAddFilterBtn}
				// zohoUsers={zohoUsers}
				// originalSFFields={originalSFFields}
				// setOriginalSFFields={setOriginalSFFields}
			/>
		</div>
	);
};

export default Sidebar;
