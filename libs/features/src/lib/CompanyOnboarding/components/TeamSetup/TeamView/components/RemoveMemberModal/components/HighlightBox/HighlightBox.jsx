import styles from "./HighlightBox.module.scss";

const HighlightBox = ({
	height,
	children,
	theme,
	fontWeight,
	borderRadius,
	className,
}) => {
	return (
		<div
			className={`${styles.highlightBox} ${styles[theme]} ${className ?? ""}`}
			style={{
				height: `${height}px`,
				fontWeight: `${fontWeight}`,
				borderRadius: `${borderRadius}px`,
			}}
		>
			<span>{children}</span>
		</div>
	);
};

export default HighlightBox;
