import { useRef } from "react";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import styles from "./RightSidebar.module.scss";

const RightSidebar = ({
	isOpen,
	onClose,
	children,
	className,
	backgroundBlur = false,
}) => {
	const sidebarRef = useRef(null);
	useOutsideClickHandler(sidebarRef, onClose);

	return (
		<div
			className={`${styles.rightSidebarOverlay} ${backgroundBlur ? styles.blur : ""} ${
				isOpen ? styles.open : ""
			} ${className ?? ""}`}
		>
			<div
				className={`${styles.rightSidebar} ${isOpen ? styles.open : styles.close}`}
				ref={sidebarRef}
			>
				{children}
			</div>
		</div>
	);
};

export default RightSidebar;
