import styles from "./RightArrow.module.scss";

const RightArrow = () => {
	return (
		<div className={styles.rightArrow}>
			<div className={styles.arrowLine}></div>
			<div className={styles.arrowHead}></div>
		</div>
	);
};

export default RightArrow;
