import React from "react";
import { propTypes } from "./Icon.props";
import iconMap from "../assets/icons/icon-map";

const EmptyIcon = () => <div />;

const Icon = ({ name, size, color, disabled, onClick = () => null, style, ...rest }) => {
	const Icon = iconMap[name] || EmptyIcon;
	return (
		<Icon
			color={color}
			style={{
				width: size,
				height: size,
				opacity: disabled ? 0.3 : 1,
				...(style && { ...style }),
				...(disabled && { cursor: "not-allowed" }),
			}}
			onClick={e => !disabled && onClick(e)}
			{...rest}
		/>
	);
};

Icon.propTypes = propTypes;

export default Icon;
