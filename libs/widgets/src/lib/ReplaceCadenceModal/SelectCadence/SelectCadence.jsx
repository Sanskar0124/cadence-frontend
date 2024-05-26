/* eslint-disable react/jsx-no-useless-fragment */
import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./SelectCadence.module.scss";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
	CadenceEmpty,
	Cadences,
	PlusOutline,
	Tick,
	TriangleDown,
} from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { Div } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";

import { CADENCE_TYPES, INTEGRATION_TYPE } from "@cadence-frontend/constants";

import { getTabs } from "./utils";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const SelectCadence = ({ isOpen, cadenceSelected, setCadenceSelected, user }) => {
	const [tab, setTab] = useState(CADENCE_TYPES.RECENT);
	const integration_type = useRecoilValue(userInfo).integration_type;
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const observer = useRef();

	const {
		cadencesData: cadences,
		cadenceLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadence(
		isOpen,
		tab,
		searchValue,
		Boolean(integration_type === INTEGRATION_TYPE.SHEETS)
	);

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
		<div className={styles.selectCadence}>
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

				{cadenceSelected !== "" && (
					<div className={styles.clear}>
						<ThemedButton
							theme={ThemedButtonThemes.TRANSPARENT}
							width="fit-content"
							onClick={() => setCadenceSelected("")}
						>
							<div>{COMMON_TRANSLATION.CLEAR[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					</div>
				)}

				{cadenceLoading ? (
					<Placeholder rows={6} />
				) : !cadences?.length ? (
					<div className={styles.noCadence}>
						<CadenceEmpty size="12rem" />
						<h4>No cadence created</h4>
						<ThemedButton
							theme={ThemedButtonThemes.GREY}
							width="fit-content"
							onClick={() => navigate("/cadence?create=true")}
							className={styles.btnCreateCadence}
						>
							<PlusOutline />
							<div>
								{CADENCE_TRANSLATION.CREATE_NEW_CADENCE[user?.language?.toUpperCase()]}
							</div>
						</ThemedButton>
					</div>
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
			</div>
		</div>
	);
};

export default SelectCadence;

const Placeholder = ({ rows }) => {
	return (
		<div style={{ height: "calc(100vh - 400px)" }}>
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
			onClick={() => setCadenceSelected({ id: cadence.cadence_id, name: cadence.name })}
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
});
