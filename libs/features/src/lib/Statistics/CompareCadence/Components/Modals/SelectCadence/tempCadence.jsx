import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { SearchBar, TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./SelectCadence.module.scss";
import styles1 from "../../../../components/SelectCadence/SelectCadence.module.scss";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence, useCompareCadenceData } from "@cadence-frontend/data-access";
import { Div, Modal } from "@cadence-frontend/components";
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
	ALL: "all",
	PERSONAL: "personal",
	TEAM: "team",
	COMPANY: "company",
};

const TempCadence = ({
	modal,
	setModal,
	cadenceSelected,
	setCadenceSelected,
	setCadenceData,
	btnIndex,
	dataofKpi,
}) => {
	const [isDropdown, setIsDropdown] = useState(true);
	const [tab, setTab] = useState(CADENCE_TYPES.PERSONAL);
	const [searchValue, setSearchValue] = useState("");
	const [search, setSearch] = useState("");
	const user = useRecoilValue(userInfo);
	const [allCadence, setAllCadence] = useState([]);

	const closeModal = () => {
		setModal(false);
		setCadenceSelected(prevState => ({
			...prevState,
			isCadenceSelected: false,
		}));
	};

	// const dropdownRef = useRef();

	// useOutsideClickHandler(dropdownRef, () => setIsDropdown(false));

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

	//  this extra code for tab name ALL
	const { cadencesData: cadences1 } = useCadence(
		isDropdown,
		CADENCE_TYPES.PERSONAL,
		searchValue
	);
	const { cadencesData: cadences2 } = useCadence(
		isDropdown,
		CADENCE_TYPES.COMPANY,
		searchValue
	);
	const { cadencesData: cadences3 } = useCadence(
		isDropdown,
		CADENCE_TYPES.TEAM,
		searchValue
	);
	// code ends here

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
	const clearCurrentTab = () => {
		setCadenceSelected(prev => ({ ...prev, [tab]: null }));
		setCadenceData(prev => ({ ...prev, data: null, isSelected: false }));
	};

	//search
	const handleSearch = () => setSearchValue(search);

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	useEffect(() => {
		if (tab === CADENCE_TYPES.ALL) {
			setAllCadence(prev => [...prev, ...cadences1, ...cadences2, ...cadences3]);
		}
	}, [tab]);

	console.log(cadenceSelected, "cadence state");

	return (
		<Modal
			isModal={Boolean(modal)}
			onClose={closeModal}
			showCloseButton
			className={styles.container}
		>
			<p className={styles.title}>Select Cadence</p>
			<TabNavSlider
				buttons={[
					{
						label: ` ${COMMON_TRANSLATION.ALL1[user?.language?.toUpperCase()]} `,
						value: "all",
					},
					{
						label: ` ${CADENCE_TRANSLATION.PERSONAL[user?.language?.toUpperCase()]}`,
						value: "personal",
					},
					{
						label: `${TASKS_TRANSLATION.GROUP[user?.language?.toUpperCase()]} `,
						value: "team",
					},
					{
						label: `${CADENCE_TRANSLATION.COMPANY[user?.language?.toUpperCase()]} `,
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
				placeholderText={COMMON_TRANSLATION.SEARCH[user?.language.toUpperCase()]}
			/>
			<div className={`${styles.totalSelected} ${styles.currentTab}`}>
				{cadenceSelected[tab] !== null && (
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
					{(tab === CADENCE_TYPES.ALL ? allCadence : cadences)?.map((cadence, index) => {
						const isLastCadence =
							index === (tab === CADENCE_TYPES.ALL ? allCadence : cadences)?.length - 1;
						return isLastCadence ? (
							<>
								<CadenceRow
									tab={tab}
									cadence={cadence}
									cadenceSelected={cadenceSelected}
									setCadenceSelected={setCadenceSelected}
									setCadenceData={setCadenceData}
									btnIndex={btnIndex}
									dataofKpi={dataofKpi}
									ref={
										(tab === CADENCE_TYPES.ALL ? allCadence : cadences)?.length > 19
											? lastCadenceRef
											: null
									}
								/>
								{isFetchingNextPage && <Placeholder rows={1} />}
							</>
						) : (
							<CadenceRow
								tab={tab}
								cadence={cadence}
								cadenceSelected={cadenceSelected}
								setCadenceSelected={setCadenceSelected}
								setCadenceData={setCadenceData}
								btnIndex={btnIndex}
								dataofKpi={dataofKpi}
							/>
						);
					})}
				</div>
			)}
		</Modal>
	);
};

export default TempCadence;

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
	(
		{
			cadence,
			cadenceSelected,
			setCadenceSelected,
			tab,
			setCadenceData,
			btnIndex,
			dataofKpi,
		},
		ref
	) => {
		const handleClick = cadence => {
			if (cadenceSelected.cadence_id === cadence?.cadence_id) {
				setCadenceSelected(prevState => ({
					...prevState,
					cadence_id: null,
					isCadenceSelected: false,
				}));
				setCadenceData(prev => ({
					...prev,
					data: null,
					isSelected: false,
				}));
			} else {
				setCadenceSelected(prevState => ({
					...prevState,
					cadence_id: cadence?.cadence_id,
					isCadenceSelected: true,
				}));

				setCadenceData(prev => ({
					...prev,
					isSelected: prev.indexOfBtn === btnIndex,
					data: cadence,
					type: cadence.type,
				}));
			}
		};

		return (
			<div
				ref={ref}
				key={cadence.cadence_id}
				onClick={() => handleClick(cadence)}
				className={`${styles.cadence1} ${
					cadenceSelected.cadence_id === cadence?.cadence_id &&
					cadenceSelected.isCadenceSelected
						? styles.selected
						: ""
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
