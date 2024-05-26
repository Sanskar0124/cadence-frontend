import { userInfo } from "@cadence-frontend/atoms";
import { useLead } from "@cadence-frontend/data-access";
import {
	RingoverBox,
	SalesforceBox,
	SalesforceBoxDisabled,
} from "@cadence-frontend/icons";
import { Modal, Title } from "@cadence-frontend/components";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { getSalesforceUrl } from "@cadence-frontend/utils";
import styles from "./DuplicatesModal.module.scss";
import Placeholder from "./Placeholder/Placeholder";
import { MessageContext } from "@cadence-frontend/contexts";

const DuplicatesModal = ({ modal, setModal, lead }) => {
	const { addError } = useContext(MessageContext);
	const handleClose = () => {
		setModal(false);
	};
	const { getDuplicateLeads, duplicateLeadsLoading } = useLead(null, false);
	const instance_url = useRecoilValue(userInfo).instance_url;
	const [duplicateLeads, setDuplicateLeads] = useState([]);

	useEffect(() => {
		if (modal) {
			getDuplicateLeads(lead?.lead_id, {
				onSuccess: data => {
					setDuplicateLeads(data);
				},
				onError: err =>
					addError({
						text: err?.response?.data?.msg || "Something went wrong",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					}),
			});
		}
	}, [modal]);

	return (
		<Modal
			isModal={modal}
			setModal={setModal}
			onClose={handleClose}
			showCloseButton
			disableOutsideClick
			className={styles.duplicatesModal}
		>
			<div className={styles.leadsWrapper}>
				<Title size="1.5rem">Duplicates</Title>
				{duplicateLeadsLoading ? (
					<Placeholder />
				) : duplicateLeads?.length === 0 ? (
					<div className={styles.noDuplicates}>No Duplicates Found</div>
				) : (
					<div className={styles.leads}>
						{duplicateLeads?.map(dup => (
							<div className={styles.lead}>
								<div className={styles.name}>{dup.Name}</div>

								<div className={styles.iconsWrapper}>
									<span style={{ marginRight: "5px" }}>
										{dup.Id && instance_url ? (
											<SalesforceBox
												onClick={e => {
													e.stopPropagation();
													e.preventDefault();
													window.open(
														getSalesforceUrl(
															{
																integration_id: dup.Id,
																integration_type: lead.integration_type,
															},
															instance_url
														),
														"_new"
													);
												}}
												size="2em"
												className={styles.salesforcebox}
												color="#00A1E0"
											/>
										) : (
											<SalesforceBoxDisabled />
										)}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Modal>
	);
};

export default DuplicatesModal;
