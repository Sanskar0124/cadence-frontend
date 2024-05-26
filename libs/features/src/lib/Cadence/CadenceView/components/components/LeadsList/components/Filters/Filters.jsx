import { useState, useEffect } from "react";
import styles from "./Filters.module.scss";

import { ThemedButton } from "@cadence-frontend/widgets";
import { ErrorBoundary, Title, Tooltip } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { DEFAULT_FILTER_OPTIONS, CADENCE_STATUS_ENUMS } from "./constants";
import Owner from "./components/Owner/Owner";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const Filters = ({
	filters,
	setFilters,
	filtersCount,
	owner,
	setOwner,
	statsData,
	onClose,
}) => {
	const [showOwners, setShowOwners] = useState(false);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		localStorage.setItem("cadence_leads_filters", JSON.stringify(filters));
	}, [filters]);
	console.log(filters, "Filters32");
	const handleRadioSelect = (ENUM, filterType) => {
		if (filters?.[filterType] === ENUM)
			setFilters(prev => ({ ...prev, [filterType]: null }));
		else
			setFilters(prev => ({
				...prev,
				[filterType]: ENUM,
			}));
	};

	const decideTheme = (ENUM, filterType) => {
		return filters?.[filterType]?.includes(ENUM) ? styles.active : "";
	};

	const checkFiltersLength = () => {
		return filtersCount !== 0 || owner.length !== 0;
	};

	const reset = filterType => {
		if (filterType === "ALL") {
			setFilters(DEFAULT_FILTER_OPTIONS);
			setOwner([]);
			return;
		}
		setFilters(prev => ({
			...prev,
			[filterType]: typeof prev[filterType] === "boolean" ? false : null,
		}));
	};

	return (
		<>
			<div className={styles.title}>
				<ThemedButton
					className={styles.closeBtn}
					onClick={onClose}
					theme={ThemedButtonThemes.ICON}
				>
					<Tooltip text="Close">
						<Close color={"#567191"} />
					</Tooltip>
				</ThemedButton>
				<Title size="1.35rem" className={styles.heading}>
					{COMMON_TRANSLATION.FILTERS[user?.language.toUpperCase()]}
				</Title>
				{checkFiltersLength() && (
					<ThemedButton
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => reset("ALL")}
					>
						<div>{COMMON_TRANSLATION.RESET_ALL[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				)}
			</div>

			<div className={styles.body}>
				<ErrorBoundary>
					<div className={styles.filterType}>
						<div className={styles.taskType}>
							<div className={styles.label}>
								{COMMON_TRANSLATION.STATUS[user?.language.toUpperCase()]}
							</div>
							{filters?.status && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => reset("status")}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>{" "}
						<div className={styles.filterOptions}>
							{Object.keys(CADENCE_STATUS_ENUMS).map(key => (
								<ThemedButton
									onClick={() => handleRadioSelect(key, "status")}
									theme={ThemedButtonThemes.GREY}
									className={decideTheme(key, "status")}
									width="fit-content"
								>
									<div>{CADENCE_STATUS_ENUMS[key][user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							))}
						</div>
					</div>

					<div className={styles.filterType}>
						<div className={styles.taskType}>
							<div className={styles.label}>
								{CADENCE_TRANSLATION.OWNER?.[user?.language?.toUpperCase()]}
							</div>
							{owner && (
								<ThemedButton
									theme={ThemedButtonThemes.TRANSPARENT}
									width="fit-content"
									onClick={() => setOwner([])}
								>
									<div>{COMMON_TRANSLATION.RESET[user?.language?.toUpperCase()]}</div>
								</ThemedButton>
							)}
						</div>{" "}
						<div className={styles.filterOptions}>
							<ThemedButton
								onClick={() => setShowOwners(true)}
								theme={ThemedButtonThemes.GREY}
								className={owner?.length ? styles.active : ""}
								width="fit-content"
							>
								{CADENCE_TRANSLATION.SELECT_OWNER?.[user?.language?.toUpperCase()]}
							</ThemedButton>
						</div>
					</div>

					<Owner
						open={showOwners}
						setOpen={setShowOwners}
						owner={owner}
						setOwner={setOwner}
						statsData={statsData}
					/>
				</ErrorBoundary>
			</div>
		</>
	);
};

export default Filters;
