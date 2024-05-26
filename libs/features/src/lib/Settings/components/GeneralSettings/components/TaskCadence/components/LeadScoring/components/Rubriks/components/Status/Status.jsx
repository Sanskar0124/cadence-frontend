import { InputThemes } from "@cadence-frontend/themes";
import { userInfo } from "@cadence-frontend/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./Status.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { CollapseContainer, Input } from "@cadence-frontend/widgets";
import { LEAD_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { getConstructedStatusObject, RUBRIK_STATUS } from "./constants";

function Status({
	rubrikName = "Status Update",
	leadScoreSettings,
	setLeadScoreSettings,
	lead_integration_type = LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT,
	exception,

	// New
	picklistValues,
	setPicklistValues,
	fetchSfMapLoading,
}) {
	const user = useRecoilValue(userInfo);
	const [statusPicklist, setStatusPicklist] = useState([]);

	useEffect(() => {
		if (!fetchSfMapLoading) {
			let picklist_from_server = [];
			switch (lead_integration_type) {
				case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD: {
					picklist_from_server = picklistValues[LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD];
					let settable_picklist = getConstructedStatusObject({
						picklist_from_server,
						picklist_from_settings:
							leadScoreSettings?.status_update?.picklist_values_lead,
					});

					setStatusPicklist(settable_picklist);
					break;
				}
				case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT: {
					picklist_from_server =
						picklistValues[LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT];
					let settable_picklist = getConstructedStatusObject({
						picklist_from_server,
						picklist_from_settings:
							leadScoreSettings?.status_update?.picklist_values_account,
					});
					setStatusPicklist(settable_picklist);
					break;
				}
				case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT: {
					picklist_from_server = picklistValues[LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT];
					let settable_picklist = getConstructedStatusObject({
						picklist_from_server,
						picklist_from_settings:
							leadScoreSettings?.status_update?.picklist_values_lead,
					});
					setStatusPicklist(settable_picklist);
					break;
				}
				default:
					break;
			}
		}
	}, [picklistValues]);

	useEffect(() => {
		let obj_key = "picklist_values_lead";
		switch (lead_integration_type) {
			case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD: {
				obj_key = "picklist_values_lead";
				break;
			}
			case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT: {
				obj_key = "picklist_values_account";
				break;
			}
			case LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT: {
				obj_key = "picklist_values_lead";
				break;
			}
		}
		setLeadScoreSettings(prev => ({
			...prev,
			status_update: {
				...(prev?.status_update ?? []),
				[obj_key]: statusPicklist,
			},
		}));
	}, [statusPicklist]);

	return (
		<CollapseContainer
			openByDefault={false}
			className={`${styles.statusUpdate} ${exception ? styles.exceptionElement : ""} ${
				exception ? styles.exception : ""
			}`}
			theme="PRIMARY"
			title={
				<div className={styles.collapseHeader}>
					<p>{RUBRIK_STATUS[rubrikName][user?.language.toUpperCase()]}</p>
					<p></p>
				</div>
			}
		>
			<div className={`${styles.statuses}`}>
				{!fetchSfMapLoading &&
					Object.keys(statusPicklist)?.map((status, key) => (
						<div className={styles.statusContainers} key={key}>
							<p className={styles.statusLabel}>{status}</p>
							<div className={styles.inputBox}>
								<Input
									value={statusPicklist}
									setValue={setStatusPicklist}
									name={status}
									className={styles.input}
									width="65px"
									height="40px"
									type="number"
									placeholder={"00"}
									minvalue={0}
									maxValue={1000}
									theme={exception ? InputThemes.WHITE : InputThemes.GREY}
								/>
								<p>{COMMON_TRANSLATION.POINTS[user?.language?.toUpperCase()]}</p>
							</div>
						</div>
					))}
			</div>
		</CollapseContainer>
	);
}

export default Status;
