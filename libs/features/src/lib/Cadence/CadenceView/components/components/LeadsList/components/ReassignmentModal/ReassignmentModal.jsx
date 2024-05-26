import { useEffect, useState } from "react";

import styles from "./ReassignmentModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import Reassignment from "./Reassignment/Reassignment";
import PeopleList from "./PeopleList/PeopleList";
import { IS_LEAD, IS_CONTACT } from "./constants";

const ReassignmentModal = ({ modal, setModal, selectedLeads, dataAccess }) => {
	const [leads, setLeads] = useState([]);
	const [viewPeopleList, setViewPeopleList] = useState(false);
	const [cb, setCb] = useState(null);

	useEffect(() => {
		if (modal) {
			setViewPeopleList(false);
			setLeads(selectedLeads.filter(item => IS_LEAD(item) || IS_CONTACT(item)));
		}
	}, [modal]);

	const handleClose = () => {
		if (cb && typeof cb === "function") {
			cb();
		}
		setModal(false);
	};

	return (
		<Modal
			isModal={modal}
			className={styles.reassignmentModal}
			onClose={handleClose}
			showCloseButton
		>
			<Reassignment
				viewPeopleList={viewPeopleList}
				dataAccess={dataAccess}
				leads={leads}
				setViewPeopleList={setViewPeopleList}
				handleClose={handleClose}
				setCb={setCb}
			/>
			<PeopleList
				active={viewPeopleList}
				leads={leads}
				setLeads={setLeads}
				setViewPeopleList={setViewPeopleList}
			/>
		</Modal>
	);
};

export default ReassignmentModal;
