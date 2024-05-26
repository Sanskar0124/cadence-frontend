import { Button } from "@cadence-frontend/components";
import THEMES from "./themes";
import styles from "./ThemedButton.module.scss";
import { forwardRef } from "react";

const ThemedButton = forwardRef(
	(
		{
			children,
			theme,
			className = "",
			disabled = false,
			loading = false,
			loadingText,
			onClick,
			height = "50px",
			width = "100%",
			...rest
		},
		ref
	) => {
		return (
			<Button
				ref={ref}
				className={`${styles.button} ${loading ? styles.loading : ""} ${
					styles[THEMES[theme]]
				} ${className}`}
				disabled={disabled}
				loading={loading}
				loadingText={loadingText}
				onClick={loading || disabled ? null : onClick}
				btnheight={height}
				btnwidth={width}
				{...rest}
			>
				{children}
			</Button>
		);
	}
);

export default ThemedButton;
