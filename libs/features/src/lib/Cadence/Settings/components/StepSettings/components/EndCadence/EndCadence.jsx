import { Checkbox, Label, Select, Toggle } from "@cadence-frontend/widgets";
import React, { useEffect, useRef, useState, useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { CadenceContext } from "../../../../Settings";
import styles from "./EndCadence.module.scss";
import SelectCadence from "./SelectCadence/SelectCadence";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from "@cadence-frontend/components";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

import { CHANGE_LEAD_STATUS_DISABLED, CHANGE_OWNER_DISABLED } from "./constants";
import { Colors } from "@cadence-frontend/utils";

const EndCadence = ({ node }) => {
	const {
		activeStep,
		setActiveStep,
		setSaveVisible,
		cadenceSettingsDataAccess,
		onSaveRef,
		onSuccess,
		employees,
	} = useContext(CadenceContext);

	const { updateNode, allowedStatuses } = cadenceSettingsDataAccess;
	const { id: cadence_id } = useParams();
	const queryClient = useQueryClient();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	//refs
	const dataRef = useRef(null);
	const toggleRef = useRef(null);

	//data states
	const [cadence, setCadence] = useState(node.data.cadence_id);
	const [status, setStatus] = useState({
		lead: node.data.lead_status,
		contact: node.data.contact_status,
		account: node.data.account_status,
	});
	const [reason, setReason] = useState({
		lead: node.data.lead_reason,
		contact: node.data.contact_reason,
		account: node.data.account_reason,
	});
	const [allowedStatusOptions, setAllowedStatusOptions] = useState({
		lead: [],
		contact: [],
		account: [],
	});
	const [ownership, setOwnership] = useState("");
	const [toggle, setToggle] = useState({ status: false, move: false, ownership: false });
	//options states
	const [employeeOptions, setEmployeeOptions] = useState([]);

	//side effects
	useEffect(() => {
		setEmployeeOptions(
			employees
				?.sort((a, b) => a.first_name.localeCompare(b.first_name))
				?.map(op => ({ label: `${op.first_name} ${op.last_name}`, value: op.user_id }))
		);
		if (node.data.cadence_id) setToggle(prev => ({ ...prev, move: true }));
		if (node.data.lead_status || node.data.contact_status || node.data.account_status)
			setToggle(prev => ({ ...prev, status: true }));
		if (node.data.to_user_id) setToggle(prev => ({ ...prev, ownership: true }));
		if (node.data.lead_status || node.data.contact_status || node.data.account_status)
			setStatus(prev => ({
				...prev,
				lead: node.data.lead_status,
				contact: node.data.contact_status,
				account: node.data.account_status,
			}));
		return () => onSave();
	}, []);

	useEffect(() => {
		dataRef.current = {
			cadence_id: cadence,
			lead_status: status.lead,
			contact_status: status.contact,
			account_status: status.account,
			lead_reason: reason.lead,
			contact_reason: reason.contact,
			account_reason: reason.account,
			to_user_id: ownership,
			moved_leads: node.data.moved_leads,
		};
		toggleRef.current = toggle;
	}, [node, cadence, status, reason, ownership, toggle]);

	useEffect(() => {
		let leadStatuses = allowedStatuses?.lead_integration_status?.picklist_values;
		let accountStatuses = allowedStatuses?.account_integration_status?.picklist_values;
		let contactStatuses = allowedStatuses?.contact_integration_status?.picklist_values;
		setAllowedStatusOptions({
			lead: leadStatuses,
			account: accountStatuses,
			contact: contactStatuses,
		});
	}, [allowedStatuses]);

	useEffect(() => {
		setOwnership(node.data.to_user_id);
	}, [employeeOptions]);

	//functions

	const getReasons = (status, type) => {
		if (status === allowedStatuses?.[`${type}_integration_status`]?.disqualified?.value) {
			return allowedStatuses?.[`${type}_disqualification_reasons`]?.picklist_values;
		}
		let customStatus = allowedStatuses?.[
			`${type}_integration_status`
		]?.custom_actions?.find(action => action.value === status);
		if (customStatus && customStatus?.reasons?.length) return customStatus?.reasons;
		return false;
	};

	const onSave = () => {
		if (!toggleRef.current.status) {
			dataRef.current.account_status = "";
			dataRef.current.lead_status = "";
			dataRef.current.contact_status = "";
		}
		if (!toggleRef.current.move) dataRef.current.cadence_id = "";
		if (!toggleRef.current.ownership) dataRef.current.to_user_id = "";
		if (
			dataRef.current.lead_status !==
			allowedStatuses?.lead_integration_status?.disqualified?.value
		)
			dataRef.current.lead_reason = "";
		if (
			dataRef.current.account_status !==
			allowedStatuses?.account_integration_status?.disqualified?.value
		)
			dataRef.current.account_reason = "";

		if (dataRef.current === node.data) return;
		let data = {
			node_id: node.node_id,
			body: {
				data: dataRef.current,
			},
		};

		updateNode(data, {
			onError: (err, updatedData, context) => {
				setActiveStep(updatedData?.node_id);
				setSaveVisible(true);
				addError({
					text: "Error updating End cadence, please try again",
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(["cadence", cadence_id], context.previousCadence);
				onSaveRef.current.onclick = () => onSave();
			},
			onSuccess,
		});
	};

	return (
		<ErrorBoundary>
			<div className={styles.endCadence}>
				<div className={styles.header}>
					<h2 className={styles.title}>
						{CADENCE_TRANSLATION.END_CADENCE[user?.language?.toUpperCase()]}
					</h2>
				</div>
				<div className={styles.box}>
					<Label>Create a workflow {"(optional)"}</Label>
				</div>
				{!CHANGE_LEAD_STATUS_DISABLED.includes(user?.integration_type) && (
					<div className={`${styles.container} ${toggle.status ? styles.open : ""}`}>
						<div className={styles.top}>
							<Checkbox
								className={styles.checkbox}
								checked={toggle.status}
								value="status"
								onChange={() => setToggle(prev => ({ ...prev, status: !prev.status }))}
							/>
							<span>Change status for lead/contact/account</span>
						</div>
						<div className={styles.box}>
							<Label>Change status for lead</Label>
							<Select
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								options={allowedStatusOptions.lead}
								value={status}
								setValue={setStatus}
								isSearchable
								name="lead"
							/>
						</div>
						{getReasons(status.lead, "lead") && (
							<div className={styles.box}>
								<Label>Select Reason for {status.lead}</Label>
								<Select
									placeholder={
										COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
									}
									options={getReasons(status.lead, "lead")}
									value={reason}
									setValue={setReason}
									isSearchable
									name="lead"
								/>
							</div>
						)}
						<div className={styles.box}>
							<Label>Change status for contact</Label>
							<Select
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								options={allowedStatusOptions.contact}
								value={status}
								setValue={setStatus}
								isSearchable
								name="contact"
							/>
						</div>
						{getReasons(status.contact, "contact") && (
							<div className={styles.box}>
								<Label>Select Reason for {status.contact}</Label>
								<Select
									placeholder={
										COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
									}
									options={getReasons(status.contact, "contact")}
									value={reason}
									setValue={setReason}
									isSearchable
									name="contact"
								/>
							</div>
						)}
						<div className={styles.box}>
							<Label>Change status for account</Label>
							<Select
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								options={allowedStatusOptions.account}
								value={status}
								setValue={setStatus}
								isSearchable
								name="account"
							/>
						</div>
						{getReasons(status.account, "account") && (
							<div className={styles.box}>
								<Label>Select Reason for {status.account}</Label>
								<Select
									placeholder={
										COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
									}
									options={getReasons(status.account, "account")}
									value={reason}
									setValue={setReason}
									isSearchable
									name="account"
								/>
							</div>
						)}
					</div>
				)}
				<div
					className={`${styles.container} ${toggle.move ? styles.open : ""}`}
					style={{
						...(user?.integration_type === INTEGRATION_TYPE.SHEETS &&
							!toggle.move && { height: "70px" }),
					}}
				>
					<div className={styles.top}>
						<Checkbox
							className={styles.checkbox}
							checked={toggle.move}
							value="move"
							onChange={() => setToggle(prev => ({ ...prev, move: !prev.move }))}
						/>
						<span>
							{
								CADENCE_TRANSLATION?.MOVE_CONTACTS_LEADS_TO_ANOTHER_CADENCE?.[
									user?.language?.toUpperCase()
								]
							}
							{user?.integration_type === INTEGRATION_TYPE.SHEETS && (
								<span>
									<br />
									*Move to cadence is only allowed for leads imported from CSV/Excel.
									Leads imported from Google Sheets are not supported.
								</span>
							)}
						</span>
					</div>
					<div className={styles.box}>
						<SelectCadence
							isOpen={toggle.move}
							cadenceSelected={cadence}
							setCadenceSelected={setCadence}
						/>
					</div>
				</div>
				{!CHANGE_OWNER_DISABLED.includes(user?.integration_type) && (
					<div className={`${styles.container} ${toggle.ownership ? styles.open : ""}`}>
						<div className={styles.top}>
							<Checkbox
								className={styles.checkbox}
								checked={toggle.ownership}
								value="ownership"
								onChange={() =>
									setToggle(prev => ({ ...prev, ownership: !prev.ownership }))
								}
							/>
							<span>
								{CADENCE_TRANSLATION?.CHANGE_OWNERSHIP?.[user?.language?.toUpperCase()]}{" "}
								<span>*Workflow settings will overwrite this ownership change</span>
							</span>
						</div>
						<div className={styles.box}>
							<Label>Change ownership</Label>
							<Select
								placeholder={
									COMMON_TRANSLATION.SELECT_HERE[user?.language?.toUpperCase()]
								}
								options={employeeOptions}
								value={ownership}
								setValue={setOwnership}
								isSearchable
								menuOnTop
							/>
						</div>
					</div>
				)}
			</div>
		</ErrorBoundary>
	);
};

export default EndCadence;
