import React, { useState } from "react";

import styles from "./Feeds.module.scss";

//components
import { Select } from "@cadence-frontend/widgets";
import EmailModal from "./components/EmailModal/EmailModal";
import PauseCadence from "../../../../Admin/Settings/components/TaskCadence/components/Workflows/components/Action/PauseCadence/PauseCadence";

import { Filters } from "./constants";
import LeadActivity from "./components/LeadActivities/LeadActivity";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

function Feeds() {
	const [filter, setFilter] = useState("");
	const [showEmailModal, setShowEmailModal] = useState(true);
	const [actionData, setActionData] = useState({ data: {} });
	const user = useRecoilValue(userInfo);

	const handleEmailModal = () => {
		setShowEmailModal(prev => !prev);
	};

	return (
		<div className={styles.feed}>
			<div className={styles.feed_heading}>
				<div className={styles.text}>
					{COMMON_TRANSLATION.LIVE_FEED[user?.language?.toupperCase()]}
				</div>
				<div className={styles.filter}>
					<Select
						type="select"
						value={filter}
						setValue={setFilter}
						placeholder="All filters"
						options={Filters.map(filter => ({
							value: filter.value,
							label: (
								<div className={styles.options}>
									{filter.icon}
									<div className={styles.options_text}>{filter.text}</div>
								</div>
							),
						}))}
						numberOfOptionsVisible="10"
					/>
				</div>
			</div>
			<div className={styles.feeds}>
				<LeadActivity
				// activities={activities}
				// lead={lead}
				// leadLoading={leadLoading}
				// userId={userId}
				/>
			</div>
			{/* <div className={styles.feeds}>
				<div className={styles.feeds_feed}>
					<div className={styles.icon_and_feed}>
						<div className={styles.icon}>
							<AtrManualEmail color={Colors.lightBlue} />
						</div>
						<div className={styles.feed_body} onClick={() => handleEmailModal()}>
							<div className={styles.title}>
								<span className={styles.bold}>Lorenza Cleementas</span> is out of office
							</div>
							<div className={styles.subject}>
								Subject: <span>currently unavailable</span>
							</div>
						</div>
					</div>
					<div className={styles.date}>August 11, 13:05</div>
				</div>
				<div className={styles.cadence}>
					<div className={styles.pause}>
						<Pause color={Colors.purpleShade1} />
						<span>Pause cadence</span>
					</div>
					<div className={styles.stop}>
						<Stop color={Colors.purpleShade1} />
						<span>Stop cadence</span>
					</div>
				</div>
			</div> */}
			<div className={styles.EmailModal}>
				<EmailModal isOpen={showEmailModal} onClose={handleEmailModal} />
			</div>
			<PauseCadence actionData={actionData} setActionData={setActionData} />
		</div>
	);
}

export default Feeds;
