import { CloseBold } from "@cadence-frontend/icons";
import { ThemedButtonThemes, TooltipThemes } from "@cadence-frontend/themes";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import React, { useEffect, useRef, useState } from "react";
import { ThemedButton } from "@cadence-frontend/widgets";
import Tooltip from "../Tooltip/Tooltip";
import styles from "./Modal.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

/**
 * This component is used to make a Modal.
 *
 * @component
 * @example
 * const [modal, setModal] = useState(false)
 *
 * const closeModal = () => {
 * 	setModal(false);
 * 	//some other stuff
 * }
 *
 * return(
 * 	<Modal isModal={modal} onClose={closeModal}>
 * 		content
 * 	</Modal>
 * )
 */

const Modal = ({
	children,
	onClose,
	isModal,
	className,
	overlayClassName,
	showCloseButton = false,
	disableOutsideClick,
	leftCloseIcon = false,
	disableCloseHover,
	closeColor,
	outsideClickDeps,
}) => {
	// for closing on outside click
	const modalRef = useRef(null);
	const closeRef = useRef();
	const user = useRecoilValue(userInfo);
	useOutsideClickHandler(modalRef, onClose, disableOutsideClick, outsideClickDeps);

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (isModal) setShowModal(true);
	}, [isModal]);

	useEffect(() => {
		if (closeRef && showModal) closeRef.current.focus();
	}, [closeRef, showModal]);

	const handleKeyDown = e => {
		if (e.key === "Escape") onClose();
	};
	const onAnimationEnd = () => {
		if (!isModal) setShowModal(false);
	};

	return (
		showModal && (
			<div
				className={`${styles.modalOverlay} ${overlayClassName} ${isModal && styles.open}`}
				ref={closeRef}
				onKeyDown={handleKeyDown}
				tabIndex={-1}
			>
				<div
					className={`${styles.modalBox} ${
						isModal ? styles.open : styles.close
					} ${className}`}
					onAnimationEnd={onAnimationEnd}
					ref={modalRef}
				>
					{showCloseButton && (
						<ThemedButton
							className={`${styles.closeIcon} ${leftCloseIcon ? styles.leftClose : ""} ${
								disableCloseHover ? styles.closeHoverless : ""
							}`}
							onClick={onClose}
							theme={ThemedButtonThemes.ICON}
						>
							<Tooltip text="Close" theme={TooltipThemes.BOTTOM} span>
								<CloseBold color={closeColor ?? "#567191"} />
							</Tooltip>
						</ThemedButton>
					)}
					<ErrorBoundary> {children} </ErrorBoundary>
				</div>
			</div>
		)
	);
};

export default Modal;
