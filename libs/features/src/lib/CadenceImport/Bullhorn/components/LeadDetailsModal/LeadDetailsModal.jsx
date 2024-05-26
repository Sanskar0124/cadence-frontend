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
import { VIEWS } from "../../constants";

const LeadDetailsModal = ({ modal, setModal, leadType }) => {
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
					{modal && modal?.success_lead_id && (
						<span>
							{TASKS_TRANSLATION.LEAD_ID[user?.language?.toUpperCase()]}:
							{modal && (modal.success_lead_id ? modal?.success_lead_id : "NA")}
						</span>
					)}
				</div>
				<div className={styles.heading}>
					{leadType?.toString() === "lead" ? (
						<h3>{CADENCE_TRANSLATION?.LEAD_DETAILS[user?.language?.toUpperCase()]}</h3>
					) : leadType?.toString() === "contact" ? (
						<h3>{CADENCE_TRANSLATION?.CONTACT_DETAILS[user?.language?.toUpperCase()]}</h3>
					) : (
						<h3>
							{CADENCE_TRANSLATION?.CANDIDATE_DETAILS[user?.language?.toUpperCase()]}
						</h3>
					)}
				</div>
				<div className={styles.main}>
					<div className={styles.col1}>
						<div className={styles.group}>
							<label>full name</label>
							<div
								className={styles.text}
								title={`${modal?.first_name ?? ""} ${modal?.last_name ?? ""}`}
							>
								{modal?.first_name ?? ""} {modal?.last_name ?? ""}
							</div>
						</div>
						<div className={styles.group}>
							<label>{COMMON_TRANSLATION.COMPANY[user?.language?.toUpperCase()]}</label>
							<div className={styles.text} title={modal?.Account?.name ?? ""}>
								{modal?.Account?.name ?? <span>NA</span>}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{COMMON_TRANSLATION.COMPANY_COUNTRY[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text} title={modal?.Account?.country ?? ""}>
								{modal?.Account?.country ?? <span>NA</span>}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{TASKS_TRANSLATION.COMPANY_URL[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text} title={modal?.Account?.url ?? ""}>
								{modal?.Account?.url ?? <span>NA</span>}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{TASKS_TRANSLATION.COMPANY_SIZE[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text} title={modal?.Account?.size ?? ""}>
								{modal?.Account?.size ?? <span>NA</span>}
							</div>
						</div>
						<div className={styles.group}>
							<label>
								{TASKS_TRANSLATION.COMPANY_PHONE_NUMBER[user?.language?.toUpperCase()]}
							</label>
							<div className={styles.text} title={modal?.Account?.phone_number ?? ""}>
								{modal?.Account?.phone_number ?? <span>NA</span>}
							</div>
						</div>
						<div className={styles.group} title={modal?.job_position ?? ""}>
							<label>{TASKS_TRANSLATION.POSITION[user?.language?.toUpperCase()]}</label>
							<div className={styles.text}>{modal?.job_position ?? <span>NA</span>}</div>
						</div>
						<div className={styles.group} title={modal?.linkedin_url ?? ""}>
							<label>{COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()]}</label>
							<div className={styles.text}>{modal?.linkedin_url ?? <span>NA</span>}</div>
						</div>
						{leadType === VIEWS.CANDIDATE && (
							<>
								<div className={styles.group}>
									<label>
										{COMMON_TRANSLATION.COMPANY_ZIPCODE[user?.language?.toUpperCase()]}
									</label>
									<div className={styles.text} title={modal?.Account?.zip_code ?? ""}>
										{modal?.Account?.zip_code ?? modal?.Account?.zipcode ?? (
											<span>NA</span>
										)}
									</div>
								</div>

								<div className={styles.group}>
									<label>
										{COMMON_TRANSLATION.COMPANY_COUNTRY[user?.language?.toUpperCase()]}
									</label>
									<div className={styles.text} title={modal?.Account?.country ?? ""}>
										{modal?.Account?.country ?? <span>NA</span>}
									</div>
								</div>
							</>
						)}
					</div>
					<div className={styles.col2}>
						{modal?.emails?.length > 0 &&
							modal?.emails?.map(email => (
								<div className={styles.group} key={email.lem_id}>
									<label>{email.type ?? "Email"}</label>
									<div className={styles.text} title={email.email_id ?? ""}>
										{email.email_id?.length ? <p>{email.email_id}</p> : <span>NA</span>}{" "}
										{email.is_primary && email.email_id?.length > 0 && (
											<i>
												<Star size={14.8} color="#d7d8f7d0" />
											</i>
										)}
									</div>
								</div>
							))}
						{modal?.phone_numbers?.length > 0 &&
							modal?.phone_numbers?.map(pn => (
								<div className={styles.group} key={pn.lpn_id}>
									<label>{pn.type}</label>
									<div className={styles.text} title={pn.phone_number ?? ""}>
										{pn.phone_number?.length ? <p>{pn.phone_number}</p> : <span>NA</span>}
										{pn.is_primary && pn.phone_number?.length > 0 && (
											<i>
												<Star size={14.8} color="#d7d8f7d0" />
											</i>
										)}
									</div>
								</div>
							))}
					</div>
					{/* {modal?.Lead_phone_numbers?.filter(phone => phone.phone_number.length > 0)
							?.length > 0 && (
							<div className={styles.group}>
								<label>
									{COMMON_TRANSLATION.PHONE_NUMBER[user?.language?.toUpperCase()]}(s)
								</label>
								{modal?.Lead_phone_numbers?.filter(
									phone => phone.phone_number.length > 0
								)?.map(pn => (
									<div className={styles.box} key={pn.lpn_id}>
										<span>{pn.type} </span>
										{pn.phone_number}{" "}
										<span className={styles.primary}>{pn.is_primary && `(Primary)`}</span>{" "}
									</div>
								))}
							</div>
						)}
					{modal?.Lead_emails?.filter(email => email.email_id.length > 0).length >
							0 && (
							<div className={styles.group}>
								<label>Email(s)</label>
								{modal?.Lead_emails?.filter(email => email.email_id.length > 0)?.map(
									email => (
										<div className={styles.box} key={email.lem_id}>
											<span>{email.type ?? "Email"} </span>
											{email.email_id}{" "}
											<span className={styles.primary}>
												{email.is_primary && `(Primary)`}
											</span>
										</div>
									)
								)}
							</div>
						)}
					{modal?.linkedin_url && (
						<div className={styles.group}>
							<Label>{COMMON_TRANSLATION.LINKEDIN[user?.language?.toUpperCase()]}</Label>
							<div className={styles.box}>{modal.linkedin_url}</div>
						</div>
					)}
					{showNoInfo && (
						<div className={`${styles.group} ${styles.noInfo}`}>
							{CADENCE_TRANSLATION?.NO_INFO_PRESENT[user?.language?.toUpperCase()]}
						</div>
					)} */}
				</div>
			</div>
		</Modal>
	);
};

export default LeadDetailsModal;
