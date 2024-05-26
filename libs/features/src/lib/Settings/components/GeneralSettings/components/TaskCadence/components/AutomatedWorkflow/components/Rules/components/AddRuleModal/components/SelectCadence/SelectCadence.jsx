import React from "react";
import styles from "./SelectCadence.module.scss";
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Cadences, Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { Div } from "@cadence-frontend/components";
import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { getTabs } from "./utils";
import { useOutsideClickHandler } from "@cadence-frontend/utils";

const SelectCadence = ({
	isOpen,
	cadenceSelected,
	setCadenceSelected,
	user,
	setIsCadenceSelect,
}) => {
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const cadenceDropDownRef = useRef(null);
	useOutsideClickHandler(cadenceDropDownRef, () => setIsCadenceSelect(false), true);

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
	//search
	const handleSearch = () => setSearchValue(search);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	return (
		<div className={styles.selectCadence} ref={cadenceDropDownRef}>
			<div className={styles.dropdown}>
				<TabNavSlider
					theme={TabNavThemes.GREY}
					buttons={getTabs(user.role, user?.language)}
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
					className={styles.searchBar}
					onSearch={handleSearch}
				/>
				{cadenceLoading ? (
					<Placeholder rows={4} />
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
										setIsCadenceSelect={setIsCadenceSelect}
									/>
									{isFetchingNextPage && <Placeholder rows={1} />}
								</>
							) : (
								<CadenceRow
									cadence={cadence}
									cadenceSelected={cadenceSelected}
									setCadenceSelected={setCadenceSelected}
									setIsCadenceSelect={setIsCadenceSelect}
								/>
							);
						})}
					</div>
				)}
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

const CadenceRow = forwardRef(
	({ cadence, cadenceSelected, setCadenceSelected, setIsCadenceSelect }, ref) => {
		return (
			<div
				ref={ref}
				key={cadence.cadence_id}
				onClick={e => {
					// e.stopPropagation()
					setCadenceSelected({ id: cadence.cadence_id, name: cadence.name });
					setIsCadenceSelect(false);
				}}
				className={`${styles.cadence} ${
					cadenceSelected.id === cadence.cadence_id ? styles.selected : ""
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
