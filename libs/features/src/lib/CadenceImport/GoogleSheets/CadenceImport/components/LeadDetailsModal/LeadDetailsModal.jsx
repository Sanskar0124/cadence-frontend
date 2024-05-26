import { useEffect, useState } from "react";
import { Modal } from "@cadence-frontend/components";

import styles from "./LeadDetailsModal.module.scss";
import { Tasks as TASKS_TRANSLATION } from "@cadence-frontend/languages";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import moment from "moment-timezone";
import { Star } from "@cadence-frontend/icons";

const LeadDetailsModal = ({ modal, setModal }) => {
	const handleClose = () => setModal(null);
	const [showNoInfo, setShowNoInfo] = useState(false);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		setShowNoInfo(
			!modal?.Lead_phone_numbers?.length &&
				!modal?.Lead_emails?.length &&
				!modal?.linkedin_url
		);
	}, [modal]);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.leadDetailsModal}>
				<div className={styles.additionalInfo}>
					<span>
						{CADENCE_TRANSLATION?.CREATED_ON[user?.language?.toUpperCase()]}:{" "}
						{moment(modal?.created_at).format("DD/MM/YY")}
					</span>
					{/* {modal && modal["Lead ID"]?.length > 0 && (
						<span>
							{TASKS_TRANSLATION.LEAD_ID[user?.language?.toUpperCase()]}:
							{modal && (modal["Lead ID"]?.length > 0 ? modal["Lead ID"] : "NA")}
						</span>
					)} */}
					{modal && modal?.success_lead_id && (
						<span>
							{TASKS_TRANSLATION.LEAD_ID[user?.language?.toUpperCase()]}:
							{modal && (modal.success_lead_id ? modal?.success_lead_id : "NA")}
						</span>
					)}
				</div>
				<div className={styles.heading}>
					<h3>{CADENCE_TRANSLATION?.LEAD_DETAILS[user?.language?.toUpperCase()]}</h3>
				</div>
				<div className={styles.main}>
					<div className={styles.col1}>
						<div className={styles.group}>
							<label>full name</label>
							<div className={styles.text}>
								{modal && modal.first_name} {modal && (modal.last_name ?? "")}
							</div>
						</div>
						<div className={styles.group}>
							<label>{COMMON_TRANSLATION.COMPANY[user?.language?.toUpperCase()]}</label>
							<div className={styles.text}>{modal?.company ?? <span>NA</span>}</div>
						</div>
						<div className={styles.group}>
							<label>
								{COMMON_TRANSLATION.COMPANY_COUNTRY[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text}>
								{modal && (modal.country.length > 0 ? modal.country : <span>NA</span>)}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{TASKS_TRANSLATION.COMPANY_URL[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text}>
								{modal && (modal.url.length > 0 ? modal.url : <span>NA</span>)}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text}>
								{modal && (modal.size.length > 0 ? modal.size : <span>NA</span>)}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{TASKS_TRANSLATION.COMPANY_PHONE_NUMBER[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text}>
								{modal &&
									(modal.company_phone_number.length > 0 ? (
										modal.company_phone_number
									) : (
										<span>NA</span>
									))}
							</div>
						</div>
						<div className={styles.group}>
							<label>{TASKS_TRANSLATION.POSITION[user?.language?.toUpperCase()]}</label>
							<div className={styles.text}>
								{modal &&
									(modal.job_position.length > 0 ? modal.job_position : <span>NA</span>)}
							</div>
						</div>
						<div className={styles.group}>
							<label>{COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()]}</label>
							<div className={styles.text}>
								{modal &&
									(modal.linkedin_url.length > 0 ? modal.linkedin_url : <span>NA</span>)}
							</div>
						</div>
					</div>
					<div className={styles.col2}>
						{modal?.emails?.length > 0 &&
							modal?.emails?.map(email => (
								<div className={styles.group} key={email.type}>
									<label>{email.type ?? "Email"}</label>
									<div className={styles.text}>
										{email.email_id?.length ? email.email_id : <span>NA</span>}{" "}
									</div>
								</div>
							))}
						{modal?.phone_numbers?.length > 0 &&
							modal?.phone_numbers?.map(pn => (
								<div className={styles.group} key={pn.type}>
									<label>{pn.type}</label>
									<div className={styles.text}>
										{pn.phone_number?.length ? pn.phone_number : <span>NA</span>}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default LeadDetailsModal;
