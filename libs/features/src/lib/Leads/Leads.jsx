import { useState, useEffect, useRef, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

//components
import { SearchBar, SearchResults, ThemedButton } from "@cadence-frontend/widgets";
import {
	Container,
	Title,
	Button,
	Tooltip,
	ErrorBoundary,
} from "@cadence-frontend/components";
import LeadCard from "./components/LeadCard/LeadCard";
import { Sort as SortIcon, NoTasks, Calendar } from "@cadence-frontend/icons";
import Sidebar from "./components/Sidebar/Sidebar";
import { useLeads, useLeadsSearch } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import Placeholder from "./components/Placeholder/Placeholder";

import { VIEW_MODES } from "./constants";

import styles from "./Leads.module.scss";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const Leads = () => {
	const user = useRecoilValue(userInfo);

	const navigate = useNavigate();

	const {
		filters,
		setFilters,
		userId,
		setUserId,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
		isFetchingNextPage,
		leadsData,
	} = useLeads({ leadsData: true });

	const { searchLeads, searchResults, searchLoading, searchError } = useLeadsSearch();

	const [searchValue, setSearchValue] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [viewMode, setViewMode] = useState(null);
	const [sidebarWidth, setSidebarWidth] = useState("0%");
	const [filtersCount, setFiltersCount] = useState(0);
	const [cardInfoWidth, setCardInfoWidth] = useState("400px");

	const observer = useRef();

	const lastLeadRef = useCallback(
		leadNode => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});
			if (leadNode) observer.current.observe(leadNode);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	useEffect(() => {
		if (viewMode === VIEW_MODES.LEAD) {
			setSidebarWidth("50%");
			setCardInfoWidth("300px");
		} else if (viewMode === null) {
			setSidebarWidth("0%");
			setCardInfoWidth("400px");
		} else {
			setSidebarWidth("30%");
			setCardInfoWidth("350px");
		}
	}, [viewMode]);

	useEffect(() => {
		setFiltersCount(0);
		Object.keys(filters).forEach(key => {
			if (filters[key]?.length > 0) setFiltersCount(prev => prev + filters[key].length);
		});
	}, [filters]);

	const onSearch = () => {
		if (searchValue) searchLeads(searchValue);
		if (!isSearchFocused) setIsSearchFocused(true);
	};

	const onClose = () => {
		setViewMode(null);
	};

	const handleClick = leadId => navigate(`/leads/${leadId}`);

	return (
		<Container className={styles.tasks} onClick={() => setIsSearchFocused(false)}>
			<div className={styles.header}>
				<div>
					<div className={styles.title}>
						<Title>{COMMON_TRANSLATION.PEOPLE[user?.language?.toUpperCase()]}</Title>
					</div>
				</div>
				<div className={styles.right}>
					<div className={styles.search}>
						<SearchBar
							onSearch={onSearch}
							value={searchValue}
							setValue={setSearchValue}
							onClick={() => setIsSearchFocused(true)}
						/>
						<SearchResults
							input={searchValue}
							results={searchResults}
							active={isSearchFocused}
							loading={searchLoading}
							error={searchError}
						/>
					</div>
					<ThemedButton
						btnwidth="fit-content"
						theme={
							viewMode === VIEW_MODES.FILTER || filtersCount > 0
								? ThemedButtonThemes.ACTIVE
								: ThemedButtonThemes.WHITE
						}
						className={styles.filterBtn}
						onClick={() => {
							setViewMode(viewMode !== VIEW_MODES.FILTER ? VIEW_MODES.FILTER : null);
						}}
					>
						<SortIcon />
						<div>
							{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}{" "}
							{`${!filtersCount ? "" : "(" + filtersCount + ")"}`}
						</div>
					</ThemedButton>
					<div className={styles.divider} />
					<Tooltip text="Calendar" className={styles.calendarTooltip}>
						<ThemedButton
							width="50px"
							theme={
								viewMode === VIEW_MODES.CALENDAR
									? ThemedButtonThemes.ACTIVE
									: ThemedButtonThemes.WHITE
							}
							onClick={() => {
								setViewMode(
									viewMode !== VIEW_MODES.CALENDAR ? VIEW_MODES.CALENDAR : null
								);
							}}
							className={styles.calendarBtn}
						>
							<Calendar />
						</ThemedButton>
					</Tooltip>
				</div>
			</div>
			<div
				className={`${styles.body} `}
				style={{ width: !viewMode ? `calc(100%-${sidebarWidth})` : "100%" }}
			>
				<div className={styles.tasksContainer}>
					{isLoading ? (
						<Placeholder rows={10} />
					) : leadsData?.length > 0 ? (
						<ErrorBoundary>
							{leadsData.map((lead, index) => {
								const isLastLead = index === leadsData.length - 1;
								return isLastLead ? (
									<>
										<LeadCard
											lead={lead}
											cardInfoWidth={cardInfoWidth}
											viewMode={viewMode}
											onClick={() => handleClick(lead.lead_id)}
											key={lead.lead_id}
											ref={leadsData?.length > 19 ? lastLeadRef : null}
										/>
										{isFetchingNextPage && (
											<LeadCard
												lead={lead}
												cardInfoWidth={cardInfoWidth}
												viewMode={viewMode}
												onClick={() => null}
												key={lead.lead_id}
												loading={true}
											/>
										)}
									</>
								) : (
									<LeadCard
										lead={lead}
										cardInfoWidth={cardInfoWidth}
										viewMode={viewMode}
										onClick={() => handleClick(lead.lead_id)}
										key={lead.lead_id}
									/>
								);
							})}
						</ErrorBoundary>
					) : (
						<div className={styles.noTasks}>
							<NoTasks />
							<h4>{COMMON_TRANSLATION.NO_PEOPLE_FOUND[user?.language?.toUpperCase()]}</h4>
						</div>
					)}

					{/* {!isFetching && leadsData?.pages[0]?.length === 0 && (
						<div className={styles.noTasks}>
							<NoTasks />
							<h4>No leads found</h4>
						</div>
					)} */}
				</div>
				<div
					style={{
						width: sidebarWidth,
						// display: sidebarWidth === "0%" ? "none" : "initial",
						transition: "0.25s ease-in-out",
						position: "relative",
					}}
				>
					<Sidebar
						filterProps={{ filters, setFilters, filtersCount }}
						viewMode={viewMode}
						setViewMode={setViewMode}
						onClose={onClose}
						userId={userId}
						setUserId={setUserId}
					/>
				</div>
			</div>
		</Container>
	);
};

export default Leads;
