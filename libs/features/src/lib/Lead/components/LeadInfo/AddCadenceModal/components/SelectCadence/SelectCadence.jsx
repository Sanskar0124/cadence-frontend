import { forwardRef, useState, useRef, useEffect, useCallback } from "react";
import { useRecoilValue } from "recoil";

import { Label, SearchBar, TabNavSlider } from "@cadence-frontend/widgets";
import { TabNavThemes } from "@cadence-frontend/themes";
import { Tick } from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";
import { useCadence } from "@cadence-frontend/data-access";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Div } from "@cadence-frontend/components";

import styles from "./SelectCadence.module.scss";
import { TYPES_OF_CADENCE_OPTIONS } from "../../constants";
import { CADENCE_TYPES, INTEGRATION_TYPE } from "@cadence-frontend/constants";

const SelectCadence = ({ selectedCadence, setSelectedCadence, lead }) => {
	//Data from recoil
	const user = useRecoilValue(userInfo);

	//States
	const [type, setType] = useState("personal");
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const [filtersApplied, setFiltersApplied] = useState({});

	//Refs
	const observer = useRef();

	//API
	const {
		cadencesData: cadences,
		cadenceLoading,
		filters,
		setFilters,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadence(
		Boolean(
			(type === CADENCE_TYPES.PERSONAL && filtersApplied?.user_id) ||
				(type === CADENCE_TYPES.TEAM && filtersApplied?.sd_id) ||
				(type === CADENCE_TYPES.COMPANY && Object.keys(filtersApplied)?.length === 0)
		),
		type,
		searchValue,
		user?.integration_type === INTEGRATION_TYPE.SHEETS
	);

	//Callback
	const lastCadenceRef = useCallback(
		cadence => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (cadence) observer.current.observe(cadence);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	//search
	const handleSearch = () => setSearchValue(search);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	useEffect(() => {
		setFiltersApplied({ ...filters });
	}, [filters]);

	useEffect(() => {
		if (type === CADENCE_TYPES.PERSONAL) {
			setFilters({ user_id: lead?.User?.user_id });
		} else if (type === CADENCE_TYPES.TEAM) {
			setFilters({ sd_id: lead?.User?.sd_id });
		} else {
			setFilters({});
		}
	}, [type]);

	return (
		<div className={styles.selectCadenceContainer}>
			<div className={styles.searchCadences}>
				<div className={styles.components}>
					<SearchBar
						width="338px"
						height="40px"
						value={search}
						setValue={setSearch}
						onSearch={handleSearch}
						className={styles.searchBar}
						placeholderText={
							CADENCE_TRANSLATION.SEARCH_YOUR_CADENCE[user?.language.toUpperCase()]
						}
					/>
					<div className={styles.tabNavBox}>
						<TabNavSlider
							theme={TabNavThemes.GREY}
							buttons={TYPES_OF_CADENCE_OPTIONS}
							width="338px"
							className={styles.tabNav}
							value={type}
							setValue={setType}
							btnClassName={styles.tabBtn}
							activePillClassName={styles.activePill}
							activeBtnClassName={styles.activeBtn}
						/>
					</div>
				</div>
				{cadenceLoading ? (
					<Placeholder rows={6} />
				) : (
					<div className={styles.cadencesList}>
						<div className={styles.listWrap}>
							{cadences?.map((cadence, index) => {
								const isLastCadence = index === cadences.length - 1 && index % 2 !== 0;
								return isLastCadence ? (
									<>
										<CadenceRow
											type={type}
											cadence={cadence}
											selectedCadence={selectedCadence}
											setSelectedCadence={setSelectedCadence}
											ref={cadences?.length > 19 ? lastCadenceRef : null}
										/>
										{isFetchingNextPage && <Placeholder rows={1} />}
									</>
								) : (
									<CadenceRow
										type={type}
										cadence={cadence}
										selectedCadence={selectedCadence}
										setSelectedCadence={setSelectedCadence}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SelectCadence;

const Placeholder = ({ rows }) => {
	return (
		<div className={styles.placeholderBox}>
			{[...Array(rows).keys()].map(() => (
				<div className={styles.placeholder}>
					<Div loading />
					<Div loading />
				</div>
			))}
		</div>
	);
};

const CadenceRow = forwardRef(
	({ cadence, selectedCadence, setSelectedCadence, type }, ref) => {
		return (
			<div
				ref={ref}
				key={cadence.cadence_id}
				onClick={() => {
					setSelectedCadence(cadence);
				}}
				className={`${styles.cadence} ${
					selectedCadence?.cadence_id === cadence?.cadence_id ? styles.selected : ""
				}`}
			>
				<div className={styles.cadenceDetails}>
					<div className={styles.name}>{cadence.name}</div>
					<div
						className={styles.info}
					>{`${cadence.steps} steps, ${cadence.people}  leads`}</div>
				</div>
				<div className={styles.tick}>
					<Tick />
				</div>
			</div>
		);
	}
);
