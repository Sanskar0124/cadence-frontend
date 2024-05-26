import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./CadenceCard.module.scss";
import { Colors } from "@cadence-frontend/utils";
import { Cadence, Minus } from "@cadence-frontend/icons";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import SelectCadence from "../Modals/SelectCadence/SelectCadence";
import { useCompareCadenceData } from "@cadence-frontend/data-access";
import { Skeleton } from "@cadence-frontend/components";

const CadenceCard = ({
	bgColor,
	cadenceColor,
	btnIndex,
	isSelectKpiModalShow,
	setIsSelectKpiModalShow,
	kpi,
	setKpis,
}) => {
	const { getCadenceData, loading, success } = useCompareCadenceData();
	const [modal, setModal] = useState(false);
	const user = useRecoilValue(userInfo);
	const cadenceCardData = kpi?.cardData?.find(item => item?.indexOfBtn === btnIndex);

	const clickHandler = () => {
		setModal(true);
	};
	const deleteHandler = () => {
		if (cadenceCardData.indexOfBtn === btnIndex) {
			setKpis(prev => ({
				...prev,
				cardData: prev.cardData?.map(item =>
					item.indexOfBtn === btnIndex
						? {
								...item,
								isSelected: false,
								data: null,
								cadence_id: null,
						  }
						: item
				),
				responseData: prev?.responseData?.filter(
					item => item?.cadence_id !== cadenceCardData?.cadence_id
				),
			}));
			setIsSelectKpiModalShow(prev => ({
				...prev,
				ids: prev.ids.filter(item => item !== cadenceCardData?.cadence_id),
			}));
		}
	};
	useEffect(() => {
		if (cadenceCardData?.isSelected) {
			if (cadenceCardData?.cadence_id !== null) {
				const body = {
					cadence_id: cadenceCardData?.cadence_id,
					kpiObjects: [...kpi.selected],
				};

				getCadenceData(body, {
					onSuccess: data => {
						const isPresent = kpi?.responseData?.filter(item =>
							data.some(obj => item.cadence_id === obj.cadence_id)
						);
						isPresent.length > 0
							? setKpis(prev => ({
									...prev,
									responseData: prev.responseData?.map(item => {
										const matchedCadence = data.find(
											obj => item.cadence_id === obj.cadence_id
										);
										return matchedCadence ? { ...matchedCadence } : item;
									}),
							  }))
							: setKpis(prev => ({
									...prev,
									responseData: prev.responseData.concat([...data]),
							  }));
					},
					onError: err => {
						console.error(err?.message ?? "unable to redirect");
					},
				});
			} else {
				return 0;
			}
		}
	}, [kpi.selected, cadenceCardData?.isSelected]);

	let foundCadence = kpi?.responseData?.find(
		item => item?.cadence_id === cadenceCardData?.cadence_id
	);

	useEffect(() => {
		if (foundCadence) {
			FindCadence();
		}
	}, [foundCadence]);

	const FindCadence = () => {
		if (foundCadence) {
			let updatedCardData = kpi?.cardData.map(obj =>
				obj?.cadence_id === cadenceCardData.cadence_id
					? {
							...obj,
							data: {
								name: foundCadence?.name,
								cadence_id: foundCadence?.cadence_id,
								cadenceDetails: [
									{
										name: "Tasks",
										count: foundCadence?.totalTasks?.count ?? 0,
									},
									{
										name: "Leads",
										count: foundCadence?.totalLeads?.total_lead_count ?? 0,
									},
								],
							},
					  }
					: obj
			);

			setKpis(prev => ({ ...prev, cardData: [...updatedCardData] }));
		} else {
			return 0;
		}
	};

	return (
		<div
			className={styles.cardcontainer}
			style={{
				backgroundColor:
					cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex
						? Colors.white
						: "transparent",
				border:
					cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex
						? "none"
						: `1px dashed ${Colors.grayShade}`,
			}}
		>
			{cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex && (
				<span className={styles.cardcontainer_removeicon}>
					<Minus color={Colors.veryLightBlue} onClick={deleteHandler} />
				</span>
			)}
			{loading && !foundCadence ? (
				<div className={styles.skeleton_details}>
					{[...Array(2).keys()].map(key => (
						<Skeleton className={styles.detailsPlaceholder} />
					))}
				</div>
			) : (
				<div className={styles.cardcontainer_detailscontainer}>
					<div className={styles.cardcontainer_cadenceicondiv}>
						<span
							className={styles.cardcontainer_cadenceicondiv_icon}
							style={{
								background:
									cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex
										? bgColor
										: Colors.grayGradient,
							}}
						>
							<Cadence
								color={
									cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex
										? cadenceColor
										: Colors.veryLightBlue
								}
							/>
						</span>
					</div>
					<p
						className={
							cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex
								? styles.name
								: `${styles.name} ${styles.noCadence}`
						}
					>
						{cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex
							? cadenceCardData?.data?.name
							: "No Cadence selected"}
					</p>
					<div className={styles.cardcontainer_details}>
						{cadenceCardData?.isSelected && cadenceCardData?.indexOfBtn === btnIndex ? (
							<>
								{cadenceCardData?.data?.cadenceDetails?.map(({ name, count }) => {
									return (
										<div className={styles.cardcontainer_details_values}>
											<span
												className={styles.cardcontainer_details_values_count}
												style={{ color: cadenceColor }}
											>
												{count}
											</span>
											<span className={styles.cardcontainer_details_values_name}>
												{name}
											</span>
										</div>
									);
								})}
							</>
						) : (
							<div className={styles.cardcontainer_details_container}>
								<ThemedButton
									theme={ThemedButtonThemes.WHITE}
									height="36px"
									width="148px"
									className={styles.cardcontainer_details_cadencebtn}
									onClick={clickHandler}
								>
									{CADENCE_TRANSLATION.SELECT_CADENCE[user?.language?.toUpperCase()]}
								</ThemedButton>
							</div>
						)}
					</div>
				</div>
			)}
			{modal && (
				<SelectCadence
					modal={modal}
					setModal={setModal}
					btnIndex={btnIndex}
					isSelectKpiModalShow={isSelectKpiModalShow}
					setIsSelectKpiModalShow={setIsSelectKpiModalShow}
					kpi={kpi}
					setKpis={setKpis}
				/>
			)}
		</div>
	);
};

export default React.memo(CadenceCard);
