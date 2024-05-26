import styles from "./ExtendedRightArrow.module.scss";

const ExtendedRightArrow = () => {
	return (
		<div className={styles.extendedRightArrow}>
			<div className={styles.armBox}>
				<div className={styles.arm}></div>
			</div>
			<div className={styles.arrowHead}></div>
		</div>
	);
};
export default ExtendedRightArrow;
