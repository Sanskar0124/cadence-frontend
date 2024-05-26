import { Modal, Skeleton, Title } from "@cadence-frontend/components";
import {
	Checkbox,
	CollapseContainer,
	ThemedButton,
	Toggle,
} from "@cadence-frontend/widgets";
import React, { useState, useCallback, useContext, useEffect } from "react";
import LeadsWrapper from "./components/LeadWrapper/LeadWrapper";
import Duration from "./components/Duration/Duration";
import { defaultPauseStateFields } from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import moment from "moment-timezone";
import styles from "./PauseOrStopRelatedLeadsModal.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";

const leadName = "Lead Name";
const type = "lead";

function PauseOrStopRelatedLeadsModal({
	modal,
	setModal,
	lead,
	operation,
	onSubmit,
	stopLoading,
	data,
	relatedLeadLoading,
}) {
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [status, setStatus] = useState(false);
	const [selectedLeadIds, setSelectedLeadIds] = useState({});
	const [pauseTime, setPauseTime] = useState(defaultPauseStateFields());

	const body = {
		cadence_ids: [modal.cadence_id],
		status: modal?.status,
		reason: "unknown",
	};
	const [selectedAll, setSelectedAll] = useState(false);
	const handleClose = () => {
		setPauseTime(defaultPauseStateFields());
		setModal(null);
	};

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

		if (operation === "Pause" && pauseFor <= Date.now()) {
			return addError({ text: "Select a valid resume time!" });
		}

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
		<Modal
			isModal={modal}
			setModal={setModal}
			onClose={handleClose}
			showCloseButton
			leftCloseIcon={true}
			disableOutsideClick
			className={styles.modal}
		>
			<div className={styles.folder}>
				<div className={styles.stopRelatedLeadsModal}>
					<div className={styles.title}>
						<Title size="1.1rem"> {operation} Cadence</Title>
					</div>
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
					{relatedLeadLoading ? (
						<Placeholder rows={1} />
					) : (
						data?.filter(
							relatedLead =>
								relatedLead.present_in_cadence && relatedLead.lead_id_db !== lead.lead_id
						).length > 0 && (
							<div className={styles.relatedLeadsToggle}>
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
							</div>
						)
					)}
					{/* show collapse container only when related leads toggle button is on and k
					related leads in not empty */}
					{status && (
						<CollapseContainer
							openByDefault={false}
							title={
								<div className={styles.titleSelector + " " + styles.headText}>
									Related {type}s
								</div>
							}
							className={styles.CollapseContainer}
						>
							{relatedLeadLoading ? (
								<Placeholder rows={3} />
							) : (
								<div className={styles.leadNameSelector}>
									<div className={styles.header} style={{ marginBottom: "25px" }}>
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
					{/*duration container only when operation is pause*/}
					{operation === "Pause" && (
						<Duration pauseTime={pauseTime} setPauseTime={setPauseTime} />
					)}
					<ThemedButton
						theme="PRIMARY"
						onClick={handleClick}
						loading={stopLoading}
						loadingText={operation === "Stop" ? "Stopping" : "Pausing"}
						style={{ marginTop: "10px" }}
					>
						{operation} cadence
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
}

export default PauseOrStopRelatedLeadsModal;

const Placeholder = ({ rows }) => {
	return (
		<div style={{ padding: "10px" }}>
			{[...Array(rows).keys()].map(() => (
				<Skeleton
					className={styles.loader}
					style={{ backgroundColor: "#eee", margin: "5px", height: "30px" }}
				/>
			))}
		</div>
	);
};
