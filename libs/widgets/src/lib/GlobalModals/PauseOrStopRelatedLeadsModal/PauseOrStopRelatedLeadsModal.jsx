import { Div, Modal, Skeleton, Title } from "@cadence-frontend/components";
import {
	Checkbox,
	CollapseContainer,
	ThemedButton,
	Toggle,
} from "@cadence-frontend/widgets";
import React, { useState, useCallback, useContext, useMemo, useEffect } from "react";
import LeadsWrapper from "./components/LeadWrapper/LeadWrapper";
import styles from "./PauseOrStopRelatedLeadsModal.module.scss";
import { useRelatedLeads } from "@cadence-frontend/data-access";
import Duration from "./components/Duration/Duration";
import { defaultPauseStateFields } from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import moment from "moment-timezone";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Cadence as CADENCE_TRANSLATION,
	Tasks as TASKS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";

function PauseOrStopRelatedLeadsModal({
	modal,
	lead,
	operation,
	onSubmit,
	stopLoading,
	cadence_ids,
	activity,
}) {
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [status, setStatus] = useState(false);
	const [selectedLeadIds, setSelectedLeadIds] = useState({});
	const [pauseTime, setPauseTime] = useState(defaultPauseStateFields);
	const type = "lead";
	const body = {
		cadence_ids,
		status: modal?.status || lead?.status,
		reason: "unknown",
	};
	const [selectedAll, setSelectedAll] = useState(false);
	const { data, relatedLeadLoading } = useRelatedLeads({ lead });

	//converted pauseTime into numeric epoch time
	const getEpochTime = () => {
		const { DD, MM, YYYY, time } = pauseTime;
		try {
			if (!DD || !MM || !YYYY || !time) throw new Error();
			return Math.floor(
				new Date(
					moment(`${DD}${MM}${YYYY}${time}`, "DDMMYYYYHH:mm").toISOString()
				).getTime()
			);
		} catch (err) {
			addError({ text: "Please select a valid date and time" });
			return null;
		}
	};

	//on fetching related leads , mark all selected
	useEffect(() => {
		if (!relatedLeadLoading && data) {
			let lead_ids = {};
			data
				?.filter(({ present_in_cadence }) => present_in_cadence)
				?.forEach(({ lead_id_db }) => {
					lead_ids[lead_id_db] = selectedAll;
				});
			setSelectedLeadIds(lead_ids);
		}
	}, [data, selectedAll]);

	const handleChange = useCallback(() => {
		setStatus(!status);
	}, [status]);

	const handleClick = () => {
		const pauseFor = getEpochTime();
		const reqBody = {
			...body,
			pauseFor,
			lead_ids: status
				? [
						...Object.keys(selectedLeadIds).filter(key => selectedLeadIds[key]),
						lead.lead_id,
				  ]
				: [lead?.lead_id],
		};
		reqBody.lead_ids = [
			...new Set(
				reqBody.lead_ids?.map(id => (typeof id === "string" ? parseInt(id) : id))
			),
		];
		onSubmit(reqBody);
	};

	return (
		<div className={styles.folder}>
			<div className={styles.stopRelatedLeadsModal}>
				<div className={styles.title}>
					<Title size="1.1rem"> {operation} Cadence</Title>
				</div>

				{(activity?.Cadence?.name ||
					activity?.Lead?.LeadToCadences?.filter(
						cadence => cadence?.Cadences?.[0]?.cadence_id === activity?.cadence_id
					)?.[0]?.Cadences?.[0]?.name) && (
					<div className={styles.infoBox}>
						<span className={styles.headText}>
							{CADENCE_TRANSLATION.CADENCE_NAME[user?.language?.toUpperCase()]}
						</span>

						<span className={styles.cadenceName}>
							{activity?.Cadence?.name ||
								activity?.Lead?.LeadToCadences?.filter(
									cadence => cadence?.Cadences?.[0]?.cadence_id === activity?.cadence_id
								)?.[0]?.Cadences?.[0]?.name}
						</span>
					</div>
				)}

				<div className={styles.infoBox}>
					<span className={styles.headText}>
						{TASKS_TRANSLATION.LEAD_NAME[user?.language?.toUpperCase()]}
					</span>
					<LeadsWrapper
						lead={lead}
						checkBox={
							<Checkbox
								className={styles.checkBox}
								checked={false}
								style={{ visibility: "hidden" }}
							/>
						}
					/>
				</div>
				{(relatedLeadLoading ||
					data?.filter(
						({ present_in_cadence, lead_id_db }) =>
							present_in_cadence && lead_id_db !== lead.lead_id
					).length > 0) && (
					<Div className={styles.relatedLeadsToggle} loading={relatedLeadLoading}>
						<span>
							{operation} cadence for related {type + "s"}
						</span>

						<Toggle
							name={"stopRelatedLeads"}
							checked={status}
							onChange={handleChange}
							theme="PURPLE"
							className={styles.toggle}
						/>
					</Div>
				)}
				{/* 
					show collapse container only when 
					related leads toggle button is on and 
					related leads in not empty
				*/}
				{status &&
					(relatedLeadLoading ||
						data?.filter(
							({ present_in_cadence, lead_id_db }) =>
								present_in_cadence && lead_id_db !== lead.lead_id
						).length > 0) && (
						<CollapseContainer
							openByDefault={false}
							title={<div className={styles.titleSelector}>Related {type}s</div>}
							className={styles.CollapseContainer}
						>
							{relatedLeadLoading ? (
								<Placeholder />
							) : (
								<div className={styles.leadNameSelector}>
									<div className={styles.header}>
										<div style={{ marginRight: "auto", color: "#8193A8" }}>
											{type === "lead" ? "Lead" : "Contact"} Name
										</div>
										<Checkbox
											className={styles.checkbox}
											checked={selectedAll}
											onChange={() => {
												if (!selectedAll) {
													let lead_ids = {};
													data?.forEach(({ lead_id_db }) => {
														lead_ids[lead_id_db] = true;
													});
													setSelectedLeadIds(lead_ids);
												} else {
													let lead_ids = {};
													data?.forEach(({ lead_id_db }) => {
														lead_ids[lead_id_db] = false;
													});
													setSelectedLeadIds(lead_ids);
												}
												setSelectedAll(!selectedAll);
											}}
										/>
									</div>
									{data
										?.filter(
											relatedLead =>
												relatedLead.present_in_cadence &&
												relatedLead.lead_id_db !== lead.lead_id
										)
										?.map(relatedLead => {
											return (
												<LeadsWrapper
													lead={relatedLead}
													checkBox={
														<Checkbox
															className={styles.checkBox}
															checked={!!selectedLeadIds[relatedLead.lead_id_db]}
															onChange={() => {
																setSelectedLeadIds({
																	...selectedLeadIds,
																	[relatedLead.lead_id_db]:
																		!selectedLeadIds[relatedLead.lead_id_db],
																});
															}}
														/>
													}
												/>
											);
										})}
								</div>
							)}
						</CollapseContainer>
					)}
				{/* show duration container only when operation is pause 
					stop does not need it
				*/}
				{operation === "Pause" && (
					<Duration pauseTime={pauseTime} setPauseTime={setPauseTime} />
				)}

				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={handleClick}
					loading={stopLoading}
					loadingText={operation === "Stop" ? "Stopping" : "Pausing"}
					style={{ marginTop: "10px" }}
				>
					{operation} cadence
				</ThemedButton>
			</div>
		</div>
	);
}

export default PauseOrStopRelatedLeadsModal;

const Placeholder = () => {
	return (
		<div style={{ padding: "10px" }}>
			<Skeleton
				className={styles.loader}
				style={{ backgroundColor: "#eee", margin: "5px", height: "30px" }}
			/>
			<Skeleton
				className={styles.loader}
				style={{ backgroundColor: "#eee", margin: "5px", height: "30px" }}
			/>
			<Skeleton
				className={styles.loader}
				style={{ backgroundColor: "#eee", margin: "5px", height: "30px" }}
			/>
		</div>
	);
};
