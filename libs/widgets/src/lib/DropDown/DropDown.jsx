import { useState, useRef, useEffect, Children } from "react";

import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Tooltip } from "@cadence-frontend/components";
import styles from "./DropDown.module.scss";

//The button you are passing in dropdown should have 100% width.

const DropDown = ({
	children,
	btn,
	tooltipText = "More",
	width = "180px",
	top = "unset",
	right = "unset",
	left = "unset",
	bottom = "unset",
	disableOutsideClick,
	customStyles,
	disabled,
}) => {
	const [dropdownActive, setDropdownActive] = useState(false);
	const dropdownRef = useRef();
	const menuRef = useRef();

	const onClose = () => setDropdownActive(false);

	useOutsideClickHandler(dropdownRef, onClose, disableOutsideClick);

	useEffect(() => {
		menuRef.current?.querySelectorAll("button").forEach(button => {
			button.addEventListener("click", onClose);
		});
	}, [menuRef.current]);

	return (
		<div className={`${styles.dropdown}`} ref={dropdownRef}>
			<div
				onClick={e => {
					if (disabled) return;
					e.stopPropagation();
					setDropdownActive(prev => !prev);
				}}
			>
				<Tooltip text={!dropdownActive && tooltipText.length > 0 && tooltipText}>
					{btn}
				</Tooltip>
			</div>
			{!!Children.toArray(children).length && (
				<div
					ref={menuRef}
					className={`${styles.dropDownMenu}  ${customStyles} ${
						dropdownActive ? styles.isActive : ""
					}`}
					style={{ width, top, right, left, bottom }}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default DropDown;
