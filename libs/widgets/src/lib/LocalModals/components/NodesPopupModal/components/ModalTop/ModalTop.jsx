import { useNavigate } from "react-router-dom";
import styles from "./ModalTop.module.scss";

const ModalTop = ({ cadence, steps, completion }) => {
	const navigate = useNavigate();

	return (
		<div className={styles.modalTop}>
			<div
				onClick={() => navigate(`/cadence/${cadence?.cadence_id}`)}
				className={styles.modalTop__title}
			>
				{cadence?.name}
			</div>
			<div className={styles.modalTop__info}>
				<div className={styles.modalTop__info__completion}>{completion}</div>
				<div className={styles.modalTop__dot} />
				<div className={styles.modalTop__info__step}>{steps}</div>
			</div>
		</div>
	);
};

export default ModalTop;
