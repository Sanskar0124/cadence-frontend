import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./SelectCadence.module.scss";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { CadenceEmpty, PlusOutline, Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence, useStatistics } from "@cadence-frontend/data-access";
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
import { useNavigate } from "react-router-dom";

const CADENCE_TYPES = {
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

const SelectCadence = ({ cadenceSelected, setCadenceSelected, cadenceData }) => {
	const [isDropdown, setIsDropdown] = useState(false);
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const user = useRecoilValue(userInfo);
	const dropdownRef = useRef();
	const activeCadences = cadenceData?.find(item => item.status === "in_progress");
	const [allCadences, setAllCadences] = useState({ active: [], rendered: [] });
	const [fetchCadences, setFetchCadences] = useState([]);
	const navigate = useNavigate();

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

	useEffect(() => {
		if (tab === CADENCE_TYPES.PERSONAL) {
			setAllCadences(prev => ({ ...prev, active: activeCadences?.personal || [] }));
			setFetchCadences(
				activeCadences?.personal.length > 0 &&
					cadences?.filter(
						cadence =>
							!activeCadences?.personal.some(
								activecad => cadence.cadence_id === activecad.cadence_id
							)
					)
			);
		} else if (tab === CADENCE_TYPES.COMPANY) {
			setAllCadences(prev => ({ ...prev, active: activeCadences?.company || [] }));
			setFetchCadences(
				activeCadences?.company.length > 0 &&
					cadences?.filter(
						cadence =>
							!activeCadences?.company.some(
								activecad => cadence.cadence_id === activecad.cadence_id
							)
					)
			);
		} else if (tab === CADENCE_TYPES.TEAM) {
			setAllCadences(prev => ({ ...prev, active: activeCadences?.team || [] }));
			setFetchCadences(
				activeCadences?.team.length > 0 &&
					cadences?.filter(
						cadence =>
							!activeCadences?.team.some(
								activecad => cadence.cadence_id === activecad.cadence_id
							)
					)
			);
		}
	}, [cadences]);

	useEffect(() => {
		if (allCadences.active && fetchCadences) {
			setAllCadences(prev => ({ ...prev, rendered: [...prev.active, ...fetchCadences] }));
		}
	}, [fetchCadences, cadences]);

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
				theme={
					Object.values(cadenceSelected).flat().length > 0
						? ThemedButtonThemes.ACTIVE
						: ThemedButtonThemes.WHITE
				}
				className={styles.selectCadenceBtn}
				onClick={() => setIsDropdown(curr => !curr)}
				height="50px"
			>
				<p
					className={
						Object.values(cadenceSelected).flat().length > 0
							? styles.active
							: styles.capitalize
					}
				>
					{Object.values(cadenceSelected).flat().length > 0
						? `${Object.values(cadenceSelected).flat().length} Cadence(s)`
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
							CADENCE_TRANSLATION.SEARCH_YOUR_CADENCE[user?.language.toUpperCase()]
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
					) : !(searchValue !== "" ? cadences : allCadences?.rendered)?.length ? (
						<div className={styles.noCadence}>
							<CadenceEmpty size="12rem" />
							<h4>
								{CADENCES_TRANSLATION.NO_CADENCE_CREATED[user?.language?.toUpperCase()]}
							</h4>
						</div>
					) : (
						<div
							className={styles.list}
							style={{ height: cadences?.length < 6 && `calc(100vh - 600px)` }}
						>
							{(searchValue !== "" ? cadences : allCadences?.rendered)?.map(
								(cadence, index) => {
									const isLastCadence = index === allCadences?.rendered.length - 1;
									return isLastCadence ? (
										<>
											<CadenceRow
												tab={tab}
												cadence={cadence}
												cadenceSelected={cadenceSelected}
												setCadenceSelected={setCadenceSelected}
												ref={allCadences?.rendered?.length > 19 ? lastCadenceRef : null}
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
								}
							)}
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
				key={cadence?.cadence_id}
				onClick={() => {
					cadenceSelected[tab]?.includes(cadence?.cadence_id)
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
					cadenceSelected[tab]?.includes(cadence?.cadence_id) ? styles.selected : ""
				}`}
			>
				<div className={styles.info}>{cadence?.name}</div>
				<div className={styles.tick}>
					<Tick />
				</div>
			</div>
		);
	}
);
