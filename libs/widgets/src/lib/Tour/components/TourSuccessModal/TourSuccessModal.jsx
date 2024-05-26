// components
import { Modal } from "@cadence-frontend/components";
import { Tour as TOUR_TRANSLATION } from "@cadence-frontend/languages";

import styles from "./TourSuccessModal.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const TourSuccessModal = ({ modal, onClose }) => {
	const user = useRecoilValue(userInfo);
	return (
		<Modal isModal={modal} onClose={onClose} showCloseButton>
			<div className={styles.modal}>
				<span>
					<img
						src={
							"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/party_popper.svg"
						}
						alt=""
					/>
				</span>
				<h3>{modal?.title[user?.language?.toUpperCase()]}</h3>
				<p>{modal?.desc[user?.language?.toUpperCase()]}</p>
				{modal?.title.ENGLISH === "Congrats, you finished the demo!" && (
					<>
						<br />
						<span className={styles.exitText}>
							{TOUR_TRANSLATION.ENJOY_CADENCE[user?.language?.toUpperCase()]}
						</span>
					</>
				)}
			</div>
		</Modal>
	);
};

export default TourSuccessModal;
