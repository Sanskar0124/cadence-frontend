import { useEffect, useRef, useState } from "react";
import TabNavSliderBtn from "./TabNavSliderBtn/TabNavSliderBtn";
import THEMES from "./themes";

import styles from "./TabNavSlider.module.scss";
import { TabNavThemes } from "@cadence-frontend/themes";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@cadence-frontend/utils";

const TabNavSlider = ({
	width = "100%",
	theme,
	btnTheme,
	btnBordered,
	className,
	btnClassName,
	activeBtnClassName,
	activePillClassName,
	buttons,
	value,
	setValue,
	alternateOnClickFunction,
	noAnimation = false,
	name,
	squareButton = false,
}) => {
	const query = useQuery();
	let activeTabParam = query.get(name);
	const navigate = useNavigate();
	const [activeButton, setActiveButton] = useState();
	const [btnWidth, setBtnWidth] = useState(0);

	const tabNavRef = useRef(null);

	useEffect(() => {
		let index;
		buttons.forEach((button, i) => {
			if (button.value === value) index = i;
		});
		setActiveButton(index);
		activeTabParam && setValue(activeTabParam);
	}, [value]);

	const setButtonWidth = () => {
		let tabNavWidth = tabNavRef.current?.clientWidth;
		setBtnWidth(tabNavWidth / buttons.length - (8 - buttons.length));
	};

	useEffect(() => {
		window.addEventListener("resize", setButtonWidth);
		setButtonWidth();
	}, [buttons?.length]);

	const onClick = button => {
		setValue(button.value);
		name && navigate(`?${name}=${button.value}`);
	};

	return (
		<div>
			<div
				ref={tabNavRef}
				className={`${styles.tabNavContainer} ${noAnimation ? styles.noAnimation : ""} ${
					styles[THEMES[theme]]
				} ${className}`}
				style={{ width: noAnimation ? "100%" : width }}
			>
				{buttons.map(button => (
					<TabNavSliderBtn
						className={`${btnClassName ?? ""}  ${
							value === button.value ? activeBtnClassName : ""
						}`}
						active={value === button.value}
						onClick={() =>
							typeof alternateOnClickFunction === "function"
								? alternateOnClickFunction({ cb: () => onClick(button) }) //this setValue is a callback function we can use it if needed after performing certain operation
								: onClick(button)
						}
						width={noAnimation ? "fit-content" : `${btnWidth}px`}
						theme={btnTheme}
						key={button.value}
						noAnimation={noAnimation}
						id={button.id}
					>
						{value === button.value
							? button.activeLabel
								? button.activeLabel
								: button.label
							: button.label}
					</TabNavSliderBtn>
				))}
				{!noAnimation && (
					<>
						<div
							className={`${styles.activePill} ${activePillClassName ?? ""}`}
							style={{
								left: `calc(0.35rem + ${activeButton * btnWidth}px)`,
								width: squareButton ? "" : `${btnWidth}px`,
							}}
						/>
						{theme === TabNavThemes.SLIDER ? (
							<div
								className={`${styles.activePill} ${styles.inactivePill} ${
									activePillClassName ?? ""
								}`}
								style={{
									width: `calc(${tabNavRef.current?.clientWidth}px - 1.35rem)`,
								}}
							/>
						) : null}
					</>
				)}
			</div>
		</div>
	);
};

export { TabNavSlider, TabNavSliderBtn };
