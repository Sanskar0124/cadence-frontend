import { Modal, Div } from "@cadence-frontend/components";
import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import styles from "./SelectCadence.module.scss";
import { TabNavSlider, SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import {
	Cadence as CADENCE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilState, useRecoilValue } from "recoil";
import { kpiObjects, userInfo } from "@cadence-frontend/atoms";
import { TABS, CADENCE_STATUS } from "../../../Constants";
import { CadencesGradient, Tick, TickGradient, Timelapse } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { useCadencesNew, useCompareCadenceData } from "@cadence-frontend/data-access";

const SelectCadence = ({
	modal,
	setModal,
	btnIndex,
	isSelectKpiModalShow,
	setIsSelectKpiModalShow,
	kpi,
	setKpis,
}) => {
	const user = useRecoilValue(userInfo);
	const [tab, setTab] = useState(TABS.ALL);
	const [search, setSearch] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const observer = useRef();

	const closeModal = () => {
		setModal(false);
		setIsSelectKpiModalShow(prev => {
			const ids = kpi?.cardData
				.filter(item => item.cadence_id !== null)
				.map(item => item.cadence_id);

			return {
				...prev,
				ids: ids,
			};
		});
	};

	//search
	const handleSearch = () => setSearchValue(search);

	const {
		cadencesData: cadences,
		cadenceLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadencesNew(tab, searchValue);

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

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

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
						label: ` ${COMMON_TRANSLATION.ALL[user?.language?.toUpperCase()]} `,
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
			{cadenceLoading ? (
				<Placeholder rows={7} />
			) : (
				<div className={styles.list}>
					{cadences?.map((cadence, index) => {
						const isLastCadence = index === cadences.length - 1;
						return isLastCadence ? (
							<>
								<CadenceRow
									cadence={cadence}
									btnIndex={btnIndex}
									cadenceIdData={isSelectKpiModalShow}
									setCadenceIdData={setIsSelectKpiModalShow}
									setKpis={setKpis}
									kpi={kpi}
									ref={cadences?.length > 19 ? lastCadenceRef : null}
									closeModal={closeModal}
								/>
								{isFetchingNextPage && (
									<div>
										<Div loading className={styles.cadenceplaceholder} />
									</div>
								)}
							</>
						) : (
							<CadenceRow
								cadence={cadence}
								btnIndex={btnIndex}
								cadenceIdData={isSelectKpiModalShow}
								setCadenceIdData={setIsSelectKpiModalShow}
								setKpis={setKpis}
								kpi={kpi}
								closeModal={closeModal}
							/>
						);
					})}
				</div>
			)}
		</Modal>
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
	({ cadence, btnIndex, cadenceIdData, kpi, setKpis, closeModal }, ref) => {
		const selectedCadence = kpi?.cardData?.find(item => item.indexOfBtn === btnIndex);
		const countPeople = arr => {
			let people = arr.reduce((prevstate, curr) => prevstate + curr.leads_for_user, 0);
			return people;
		};

		const handleClick = cadence => {
			if (selectedCadence.cadence_id === cadence?.cadence_id) {
				setKpis(prev => ({
					...prev,
					cardData: prev.cardData.map(item =>
						item.indexOfBtn === btnIndex
							? {
									...item,
									isSelected: false,
									data: null,
									cadence_id: null,
							  }
							: item
					),
				}));
			} else {
				setKpis(prev => ({
					...prev,
					cardData: prev.cardData.map(item =>
						item.indexOfBtn === btnIndex
							? {
									...item,
									isSelected: item.indexOfBtn === btnIndex,
									data: { name: cadence.name },
									cadence_id: cadence.cadence_id,
							  }
							: item
					),
				}));
			}
			closeModal();
		};

		return (
			<div
				ref={ref}
				key={cadence.cadence_id}
				className={
					selectedCadence.cadence_id === cadence?.cadence_id
						? `${styles.cadence} ${styles.selectedcadence}`
						: styles.cadence
				}
				onClick={() =>
					cadenceIdData?.ids.includes(cadence.cadence_id) ? null : handleClick(cadence)
				}
				style={{
					cursor: cadenceIdData?.ids.includes(cadence.cadence_id)
						? "not-allowed"
						: "pointer",
				}}
			>
				<div className={styles.details}>
					<div
						className={
							selectedCadence.cadence_id === cadence?.cadence_id
								? `${styles.cadenceicon} ${styles.gradientbg}`
								: styles.cadenceicon
						}
					>
						{selectedCadence.cadence_id === cadence?.cadence_id ? (
							<Tick color={Colors.white} />
						) : (
							<CadencesGradient size={18} />
						)}
					</div>
					<div className={styles.nameanddetails}>
						<p className={styles.name}>{cadence.name}</p>
						<div className={styles.cadenceinfo}>
							<span>{`${cadence?.LeadToCadences.length}  ${
								cadence?.LeadToCadences.length > 1 ? `users` : `user`
							}`}</span>
							<span>
								&nbsp;&bull;&nbsp;
								{`${cadence.Nodes?.length} ${
									cadence.Nodes?.length > 1 ? `steps` : `step`
								}`}
							</span>
							<span>&bull;&nbsp;{`${countPeople(cadence?.LeadToCadences)} people`}</span>
						</div>
					</div>
				</div>
				<div
					className={`${styles.status} ${
						cadence.status === "in_progress"
							? styles.inprogress
							: cadence.status === "paused"
							? styles.paused
							: styles.idle
					}`}
				>
					{cadence.status === "paused" ? (
						<>
							{cadence.status}
							<Timelapse size={13} />
						</>
					) : (
						CADENCE_STATUS[cadence.status]
					)}
				</div>
			</div>
		);
	}
);
