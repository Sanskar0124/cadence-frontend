import { Div, ErrorBoundary } from "@cadence-frontend/components";
import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { useCadence } from "@cadence-frontend/data-access";
import { Tick } from "@cadence-frontend/icons";
import { TabNavThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider } from "@cadence-frontend/widgets";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import styles from "./SelectCadence.module.scss";

const BUTTONS = [
	{ label: "Recent", value: "recent" },
	{ label: "Personal", value: "personal" },
	{ label: "Group", value: "team" },
	{ label: "Company", value: "company" },
];

const SelectCadence = ({ isOpen, cadenceSelected, setCadenceSelected }) => {
	const [tab, setTab] = useState(CADENCE_TYPES.RECENT);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");

	const observer = useRef();

	const {
		cadencesData: cadences,
		cadenceLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadence(isOpen, tab, searchValue);

	const lastCadenceRef = useCallback(
		cadence => {
			if (tab === CADENCE_TYPES.RECENT) return;
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

	return (
		<div className={styles.selectCadence}>
			<div className={styles.dropdown}>
				<TabNavSlider
					width="70%"
					theme={TabNavThemes.WHITE}
					buttons={BUTTONS}
					value={tab}
					setValue={setTab}
					className={styles.tabs}
					btnClassName={styles.tabBtns}
					activeBtnClassName={styles.tabBtnActive}
					activePillClassName={styles.activePill}
				/>
				<SearchBar
					width="70%"
					height="40px"
					value={search}
					setValue={setSearch}
					className={styles.searchBar}
					onSearch={handleSearch}
				/>
				<ErrorBoundary>
					{cadenceLoading ? (
						<Placeholder rows={6} />
					) : (
						<div className={styles.list}>
							{cadences?.map((cadence, index) => {
								const isLastCadence = index === cadences.length - 1;
								return isLastCadence ? (
									<>
										<CadenceRow
											cadence={cadence}
											cadenceSelected={cadenceSelected}
											setCadenceSelected={setCadenceSelected}
											// ref={lastCadenceRef}
											ref={cadences?.length > 19 ? lastCadenceRef : null}
										/>
										{isFetchingNextPage && <Placeholder rows={1} />}
									</>
								) : (
									<CadenceRow
										cadence={cadence}
										cadenceSelected={cadenceSelected}
										setCadenceSelected={setCadenceSelected}
									/>
								);
							})}
						</div>
					)}
				</ErrorBoundary>
			</div>
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

const CadenceRow = forwardRef(({ cadence, cadenceSelected, setCadenceSelected }, ref) => {
	return (
		<div
			ref={ref}
			key={cadence.cadence_id}
			// onClick={() => setCadenceSelected({ id: cadence.cadence_id, name: cadence.name })}
			onClick={() => setCadenceSelected(cadence.cadence_id)}
			className={`${styles.cadence} ${
				cadenceSelected === cadence.cadence_id ? styles.selected : ""
			}`}
		>
			<div className={styles.info}>{cadence.name}</div>
			<div className={styles.tick}>
				<Tick />
			</div>
		</div>
	);
});
