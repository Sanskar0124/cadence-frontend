import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./SelectCadence.module.scss";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { Div } from "@cadence-frontend/components";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Cadence as CADENCES_TRANSLATION,
} from "@cadence-frontend/languages";
import { useOutsideClickHandler } from "@cadence-frontend/utils";

const CADENCE_TYPES = {
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

const SelectCadence = ({ cadenceSelected, setCadenceSelected }) => {
	const [isDropdown, setIsDropdown] = useState(false);
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const user = useRecoilValue(userInfo);

	const dropdownRef = useRef();

	useOutsideClickHandler(dropdownRef, () => setIsDropdown(false));

	const observer = useRef();
	const elementRef = useRef(null);

	const {
		cadencesData: cadences,
		cadenceLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadence(isDropdown, tab, searchValue);

	const lastCadenceRef = useCallback(
		cadence => {
			if (tab === CADENCE_TYPES.PERSONAL) return;
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (cadence) observer.current.observe(cadence);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	const clearAll = () => setCadenceSelected({ personal: [], team: [], company: [] });
	const clearCurrentTab = () => setCadenceSelected(prev => ({ ...prev, [tab]: [] }));

	//search
	const handleSearch = () => setSearchValue(search);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	return (
		<div className={styles.selectCadence} ref={dropdownRef}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.selectCadenceBtn}
				onClick={() => setIsDropdown(curr => !curr)}
				height="40px"
			>
				<p
					className={
						Object.values(cadenceSelected).flat().length > 0
							? styles.capitalizeFirstLetter
							: styles.capitalize
					}
				>
					{Object.values(cadenceSelected).flat().length > 0
						? `${Object.values(cadenceSelected).flat().length} ${
								CADENCE_TRANSLATION.CADENCE[user?.language.toUpperCase()]
						  }(s)`
						: CADENCES_TRANSLATION.ALL_CADENCES[user?.language?.toUpperCase()]}
				</p>
				<TriangleDown />
			</ThemedButton>
			{isDropdown && (
				<div
					ref={elementRef}
					className={`${styles.dropdown} ${isDropdown ? styles.open : ""}`}
				>
					<div className={styles.totalSelected}>
						<span>
							{COMMON_TRANSLATION.TOTAL_SELECTED[user?.language?.toUpperCase()]} :{" "}
							{Object.values(cadenceSelected).flat().length}
						</span>
						{Object.values(cadenceSelected).flat().length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={clearAll}
							>
								<div>{COMMON_TRANSLATION.CLEAR_ALL[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					<TabNavSlider
						theme={TabNavThemes.GREY}
						buttons={[
							{
								label: ` ${CADENCE_TRANSLATION.PERSONAL[user?.language?.toUpperCase()]} ${
									cadenceSelected.personal.length > 0
										? `(${cadenceSelected.personal.length})`
										: ""
								}`,
								value: "personal",
							},
							{
								label: `${TASKS_TRANSLATION.GROUP[user?.language?.toUpperCase()]} ${
									cadenceSelected.team.length > 0
										? `(${cadenceSelected.team.length})`
										: ""
								}`,
								value: "team",
							},
							{
								label: `${CADENCE_TRANSLATION.COMPANY[user?.language?.toUpperCase()]} ${
									cadenceSelected.company.length > 0
										? `(${cadenceSelected.company.length})`
										: ""
								}`,
								value: "company",
							},
						]}
						value={tab}
						setValue={setTab}
						className={styles.tabs}
						btnClassName={styles.tabBtns}
						activeBtnClassName={styles.tabBtnActive}
						activePillClassName={styles.activePill}
					/>
					<SearchBar
						width="100%"
						height="40px"
						value={search}
						setValue={setSearch}
						onSearch={handleSearch}
						className={styles.searchBar}
						placeholderText={
							CADENCES_TRANSLATION.SEARCH_YOUR_CADENCE[user?.language.toUpperCase()]
						}
					/>
					<div className={`${styles.totalSelected} ${styles.currentTab}`}>
						<span>
							{COMMON_TRANSLATION.SELECTED[user?.language?.toUpperCase()]} :{" "}
							{`(${cadenceSelected[tab].length})`}
						</span>
						{cadenceSelected[tab].length > 0 && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								width="fit-content"
								onClick={clearCurrentTab}
							>
								<div>{COMMON_TRANSLATION.CLEAR[user?.language?.toUpperCase()]}</div>
							</ThemedButton>
						)}
					</div>
					{cadenceLoading ? (
						<Placeholder rows={4} />
					) : (
						<div className={styles.list}>
							{cadences?.map((cadence, index) => {
								const isLastCadence = index === cadences.length - 1;
								return isLastCadence ? (
									<>
										<CadenceRow
											tab={tab}
											cadence={cadence}
											cadenceSelected={cadenceSelected}
											setCadenceSelected={setCadenceSelected}
											ref={cadences?.length > 19 ? lastCadenceRef : null}
										/>
										{isFetchingNextPage && <Placeholder rows={1} />}
									</>
								) : (
									<CadenceRow
										tab={tab}
										cadence={cadence}
										cadenceSelected={cadenceSelected}
										setCadenceSelected={setCadenceSelected}
									/>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SelectCadence;

const Placeholder = ({ rows }) => {
	return (
		<div>
			{[...Array(rows).keys()].map(() => (
				<Div loading className={styles.placeholder} />
			))}
		</div>
	);
};

const CadenceRow = forwardRef(
	({ cadence, cadenceSelected, setCadenceSelected, tab }, ref) => {
		return (
			<div
				ref={ref}
				key={cadence.cadence_id}
				onClick={() => {
					cadenceSelected[tab].includes(cadence?.cadence_id)
						? setCadenceSelected(prevState => ({
								...prevState,
								[tab]: prevState[tab].filter(item => item !== cadence?.cadence_id),
						  }))
						: setCadenceSelected(prevState => ({
								...prevState,
								[tab]: [...prevState[tab], cadence?.cadence_id],
						  }));
				}}
				className={`${styles.cadence} ${
					cadenceSelected[tab].includes(cadence?.cadence_id) ? styles.selected : ""
				}`}
			>
				<div className={styles.info}>{cadence.name}</div>
				<div className={styles.tick}>
					<Tick />
				</div>
			</div>
		);
	}
);
