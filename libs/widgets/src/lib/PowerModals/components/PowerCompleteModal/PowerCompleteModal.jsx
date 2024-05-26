// components
import { Modal } from "@cadence-frontend/components";

import styles from "./PowerCompleteModal.module.scss";

const convertFromSeconds = d => {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor((d % 3600) / 60);
	var s = Math.floor((d % 3600) % 60);

	var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
	return hDisplay + mDisplay + sDisplay;
};

const PowerCompleteModal = ({ modal, setModal }) => {
	const handleClose = () => setModal(null);

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<img
						src={
							"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/party_popper.svg"
						}
						alt=""
					/>
				</span>
				<h3>Focus complete</h3>
				<p>
					You have completed a total of <span>{modal?.tasks} tasks</span> in the focus
					queue in <span>{convertFromSeconds(modal?.time)}</span>
				</p>
			</div>
		</Modal>
	);
};

export default PowerCompleteModal;
