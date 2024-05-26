import { useContext, useState } from "react";
import { useRecoilValue } from "recoil";

import { Modal } from "@cadence-frontend/components";
import { userInfo } from "@cadence-frontend/atoms";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useLead } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import SelectCadence from "./components/SelectCadence/SelectCadence";

import styles from "./AddCadenceModal.module.scss";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import {
	LEAD_INTEGRATION_TYPE_MAP,
	NOT_INCLUDE_WEBSOCKET_AND_STOP_PREV_CADENCE,
	leadType,
} from "./constants";

const AddCadenceModal = ({ modal, setModal, lead, refetchLead }) => {
	//Data from recoil
	const user = useRecoilValue(userInfo);

	//States
	const [selectedCadence, setSelectedCadence] = useState(null);

	//API
	const { addLeadsToCadence, addLeadsToCadenceLoading } = useLead();
	//Context
	const { addError, addSuccess } = useContext(MessageContext);

	//Functions
	const handleClose = () => {
		setModal(false);
	};
	const handleAddCadence = () => {
		if (!selectedCadence) {
			return addError({ text: "Select a cadence" });
		}
		const integration_type = user?.integration_type;
		const type = leadType(lead?.integration_type);
		let newLead;

		if (user?.integration_type === INTEGRATION_TYPE.SHEETS) {
			newLead = {
				first_name: lead.first_name,
				last_name: lead.last_name,
				job_position: lead.job_position,
				emails: lead.Lead_emails.map(email => ({
					email_id: email.email_id,
					type: email.type,
				})),
				phone_numbers: lead.Lead_phone_numbers.map(phone => ({
					phone_number: phone.phone_number,
					type: phone.type,
				})),
				linkedin_url: lead.linkedin_url,
				primary_email: lead?.Lead_emails?.find(email => email.type === "Primary Email")
					?.email_id,
				primary_phone: lead?.Lead_phone_numbers?.find(
					phone => phone.type === "Primary Phone"
				)?.phone_number,
				size: lead?.Account?.size,
				zip_code: lead?.Account?.zipcode,
				country: lead?.Account?.country,
				company: lead?.Account?.name,
				url: lead?.Account?.url,
				company_phone_number: lead?.Account?.phone_number,
				Owner: {
					OwnerId: lead?.User?.integration_id,
				},
				status: "lead_present_in_tool",
				sr_no: 1,
				owner_integration_id: lead?.integration_id,
				lead_id: lead?.lead_id,
			};
		} else {
			newLead = {
				first_name: lead.first_name,
				last_name: lead.last_name,
				linkedin_url: lead.linkedin_url,
				job_position: lead.job_position,
				...(user?.integration_type === INTEGRATION_TYPE.SELLSY ||
				user?.integration_type === INTEGRATION_TYPE.HUBSPOT
					? {
							id: lead.integration_id,
					  }
					: {
							Id: lead.integration_id,
					  }),
				phone_numbers: lead.Lead_phone_numbers.map(phone => ({
					phone_number: phone.phone_number,
					type: phone.type,
				})),
				emails: lead.Lead_emails.map(email => ({
					email_id: email.email_id,
					type: email.type,
				})),
				...(user?.integration_type === INTEGRATION_TYPE.SELLSY
					? {
							owner: {
								owner_id: lead?.User?.integration_id,
							},
							sr_no: 1,
					  }
					: user?.integration_type === INTEGRATION_TYPE.DYNAMICS
					? {
							Owner: {
								Id: lead?.User?.integration_id,
							},
					  }
					: user?.integration_type === INTEGRATION_TYPE.SALESFORCE
					? {
							Owner: {
								OwnerId: lead?.User?.salesforce_owner_id,
							},
					  }
					: {
							Owner: {
								OwnerId: lead?.User?.integration_id,
							},
					  }),
				...(user?.integration_type === INTEGRATION_TYPE.SELLSY
					? {
							account: lead?.Account
								? {
										size: lead?.Account?.size,
										name: lead?.Account?.name,
										url: lead?.Account?.url,
										phone_number: lead?.Account?.phone_number,
										zipcode: lead?.Account?.zipcode,
										country: lead?.Account?.country,
								  }
								: null,
					  }
					: {
							Account: lead?.Account
								? {
										size: lead?.Account?.size,
										...(user?.integration_type === INTEGRATION_TYPE.BULLHORN
											? { zip_code: lead?.Account?.zipcode }
											: { zipcode: lead?.Account?.zipcode }),
										country: lead?.Account?.country,
										name: lead?.Account?.name,
										url: lead?.Account?.url,
										phone_number: lead?.Account?.phone_number,
								  }
								: null,
					  }),
				status: "lead_present_in_tool",
				lead_id: lead?.lead_id,
			};
		}
		const body = {
			[LEAD_INTEGRATION_TYPE_MAP[lead?.integration_type]]: [newLead],
			cadence_id: selectedCadence?.cadence_id,
			...(!NOT_INCLUDE_WEBSOCKET_AND_STOP_PREV_CADENCE.includes(
				lead?.integration_type
			) && {
				stopPreviousCadences: false,
				websocket: false,
			}),
		};

		addLeadsToCadence(
			{ body, integration_type, type },
			{
				onSuccess: data => {
					if (data?.element_error?.length > 0) {
						addError({ text: data?.element_error?.[0]?.msg?.replace(/<[^>]*>/g, "'") });
					} else {
						addSuccess("Lead added to cadence Successfully");
						refetchLead();
						handleClose();
					}
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			}
		);
	};

	return (
		<Modal
			isModal={modal}
			className={styles.addCadenceModal}
			onClose={handleClose}
			showCloseButton
		>
			<div className={styles.heading}>
				<h3>{CADENCE_TRANSLATION.SELECT_CADENCE[user?.language?.toUpperCase()]}</h3>
			</div>
			<SelectCadence
				selectedCadence={selectedCadence}
				setSelectedCadence={setSelectedCadence}
				lead={lead}
			/>

			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				disabled={!selectedCadence}
				onClick={handleAddCadence}
				className={styles.btn}
				loading={addLeadsToCadenceLoading}
			>
				<div>Add to cadence </div>
			</ThemedButton>
		</Modal>
	);
};

export default AddCadenceModal;
