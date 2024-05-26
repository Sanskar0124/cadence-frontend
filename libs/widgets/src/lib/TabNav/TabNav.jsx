import React from "react";
import THEMES from "./themes";
import TabNavBtn from "./TabNavBtn/TabNavBtn";
import styles from "./TabNav.module.scss";

const TabNav = ({ children, theme, btnTheme, btnBordered, className, btnClassName }) => {
	const childrenWithProps = React.Children.map(children, child => {
		return React.cloneElement(child, {
			theme: btnTheme,
			bordered: btnBordered,
			className: btnClassName,
		});
	});

	return (
		<div className={`${styles.tabNavContainer} ${styles[THEMES[theme]]} ${className}`}>
			{childrenWithProps}
		</div>
	);
};

export { TabNav, TabNavBtn };
