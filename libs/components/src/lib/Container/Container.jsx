import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import styles from "./Container.module.scss";

const Container = ({ children, className, ...rest }) => {
	return (
		<div className={styles.container + " " + className ?? ""} {...rest}>
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	);
};

export default Container;
