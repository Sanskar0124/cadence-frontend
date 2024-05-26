export const themeStyles = ({
	width,
	height,
	menuOnTop,
	borderRadius,
	borderColor,
	numberOfOptionsVisible,
	iconIsRotatable,
	border = true,
	background,
	...rest
}) => {
	const roundedStyles = {
		control: (provided, state) => ({
			...provided,
			border: border === true ? "1px solid #DADCE0" : "none",
			borderRadius: borderRadius ?? "15px",
			height: height ?? "40px",
			minHeight: rest.isMulti ? "40px" : "32px",
			width: width ?? "100%",
			cursor: "pointer",
			background: background ? background : "white",
			boxShadow: "none",
			"&:hover": {
				boxShadow: "none",
			},
			"&:before": {
				color: "#aaa",
				lineHeight: "34px",
				// paddingLeft: "20px",
				position: "absolute",
			},
		}),
		dropdownIndicator: (current, { selectProps: { menuIsOpen } }) => ({
			...current,
			color: "#567191",
			transition: "0.5s",
			padding: " 0px 18.33px ",
			...(menuIsOpen &&
				iconIsRotatable && {
					transform: "rotate(180deg)",
				}),
		}),
		indicatorSeparator: provided => ({
			...provided,
			display: "none",
		}),
		singleValue: provided => ({
			...provided,
			fontSize: "1rem",
			fontWeight: "400",
			color: "#394759",
		}),
		menu: current => ({
			...current,
			zIndex: "2",
			borderRadius: "10px",
			width: width ?? "100%",
			overflowX: "hidden",
			boxShadow: "5px 5px 24px rgba(41, 43, 88, 0.12)",
			...(menuOnTop && { bottom: "40px", top: "unset" }),
		}),
		menuList: current => ({
			...current,
			padding: "10px",
			maxHeight:
				parseInt(numberOfOptionsVisible) > 0
					? `${parseInt(numberOfOptionsVisible) * 40 + 2 * 10}px`
					: "220px",
		}),
		option: (current, { isSelected, isFocused }) => ({
			...current,
			...(isSelected && {
				background:
					"linear-gradient(106.52deg, #A282E8 -11.57%, #7E8EE7 50.39%, #4499E9 116.35%)",
				fontWeight: "600",
			}),
			...(isFocused && {
				background: isSelected
					? "linear-gradient(106.52deg, #A282E8 -11.57%, #7E8EE7 50.39%, #4499E9 116.35%)"
					: "#F0F8FE",
				color: isSelected ? "white" : "#394759",
				fontWeight: isSelected ? "600" : "400",
			}),
			borderRadius: "15px",
			minHeight: "40px",

			padding: "10px 15px",
			fontSize: "1rem",
			cursor: "pointer",
		}),
	};

	return { roundedStyles };
};
