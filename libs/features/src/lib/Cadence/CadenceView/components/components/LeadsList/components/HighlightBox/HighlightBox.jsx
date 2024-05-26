import { ErrorBoundary } from "@cadence-frontend/components";
import styles from "./HighlightBox.module.scss";

const HighlightBox = ({ label, value }) => {
	return (
		<ErrorBoundary>
			<div className={styles.highlightBox}>
				<span>{label}:</span>
				<span>{value}</span>
			</div>
		</ErrorBoundary>
	);
};

export default HighlightBox;
