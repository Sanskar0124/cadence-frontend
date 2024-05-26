import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";
import {
	INTEGRATION_TYPE,
	LEAD_INTEGRATION_TYPES,
	SETTING_PRIORITY,
} from "@cadence-frontend/constants";
import { useSettings } from "@cadence-frontend/data-access";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import OutgoingCall from "./components/OutgoingCall/OutgoingCall";
import StandardRubrik from "./components/StandardRubrik/StandardRubrik";
import Status from "./components/Status/Status";
import {
	ALLOWED_INTEGRATIONS_FOR_STATUS_POINTS,
	LEAD_SCORE_PANELS,
	LEAD_SCORE_RUBRIKS,
} from "./constants";
import styles from "./Rubriks.module.scss";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { LEVEL_TO_NAME } from "../../../../../../constants";
import { Select } from "@cadence-frontend/widgets";
import ResetScore from "./components/ResetScore/ResetScore";

function Rubriks({
	exception,
	users,
	subDepartments,
	data,
	setData,

	// New
	picklistValues,
	setPicklistValues,
	fetchSfMapLoading,
	...rest
}) {
	const [value, setValue] = useState(data);
	let user = useRecoilValue(userInfo);

	useEffect(() => {
		if (exception) setData({ ...value });
		else {
			setData(prev => ({
				...prev,
				...value,
				exceptions: prev?.exceptions,
			}));
		}
	}, [value]);

	return (
		<div className={exception ? styles.exception : ""}>
			{exception && (
				<div className={styles.selectSetting}>
					<Title className={styles.title} size="1.1rem">
						{CADENCE_TRANSLATION.SELECT_A[user?.language?.toUpperCase()]}{" "}
						{LEVEL_TO_NAME[data?.priority][user?.language?.toUpperCase()]}
					</Title>
					<div className={styles.description}></div>
					<div>
						<Select
							width={"80%"}
							value={value}
							setValue={setValue}
							name={data.priority === SETTING_PRIORITY.USER ? "user_id" : "sd_id"}
							options={data.priority === SETTING_PRIORITY.USER ? users : subDepartments}
							isSearchable
							placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
						/>
					</div>
				</div>
			)}
			{Object.keys(LEAD_SCORE_PANELS)?.map((panel, key) => {
				switch (LEAD_SCORE_PANELS[panel]) {
					case LEAD_SCORE_PANELS.OUTGOING_CALL: {
						return (
							<OutgoingCall
								leadScoreSettings={value}
								setLeadScoreSettings={setValue}
								rubrikName={panel}
								exception={exception}
							/>
						);
					}
					case LEAD_SCORE_PANELS.STATUS_UPDATE: {
						if (!ALLOWED_INTEGRATIONS_FOR_STATUS_POINTS?.includes(user?.integration_type))
							return null;
						if (user?.integration_type === INTEGRATION_TYPE.SALESFORCE) {
							return (
								<>
									<Status
										lead_integration_type={LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT}
										leadScoreSettings={value}
										setLeadScoreSettings={setValue}
										rubrikName={"Contact Status Update"}
										exception={exception}
										//New
										picklistValues={picklistValues}
										setPicklistValues={setPicklistValues}
										fetchSfMapLoading={fetchSfMapLoading}
									/>
									<Status
										lead_integration_type={LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD}
										leadScoreSettings={value}
										setLeadScoreSettings={setValue}
										rubrikName={"Lead Status Update"}
										exception={exception}
										//New
										picklistValues={picklistValues}
										setPicklistValues={setPicklistValues}
										fetchSfMapLoading={fetchSfMapLoading}
									/>
								</>
							);
						}
						if (user?.integration_type === INTEGRATION_TYPE.HUBSPOT) {
							return (
								<Status
									lead_integration_type={LEAD_INTEGRATION_TYPES.HUBSPOT_CONTACT}
									leadScoreSettings={value}
									setLeadScoreSettings={setValue}
									exception={exception}
									//New
									picklistValues={picklistValues}
									setPicklistValues={setPicklistValues}
									fetchSfMapLoading={fetchSfMapLoading}
								/>
							);
						}
						return null;
					}
					case LEAD_SCORE_PANELS.RESET_SCORE: {
						return (
							<ResetScore
								leadScoreSettings={value}
								setLeadScoreSettings={setValue}
								rubrikName={panel}
								exception={exception}
							/>
						);
					}
					default: {
						return (
							<StandardRubrik
								leadScoreSettings={value}
								setLeadScoreSettings={setValue}
								rubrikName={panel}
								exception={exception}
							/>
						);
					}
				}
			})}
		</div>
	);
}

export default Rubriks;
