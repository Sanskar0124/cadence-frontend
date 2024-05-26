export const themeStyles = ({
	width,
	height,
	menuOnTop,
	borderRadius,
	borderColor,
	numberOfOptionsVisible,
	iconIsRotatable,
	border = true,
	background = "white",
	disabled,
	isNotScrollable,
	color,
	...rest
}) => {
	const roundedStyles = {
		control: (provided, state) => ({
			...provided,
			border: border === true ? "1px solid #DADCE0" : "none",
			borderRadius: borderRadius ?? "15px",
			height: height ?? "40px",
			minHeight: state.isMulti ? "40px" : "32px",
			width: width ?? "100%",
			cursor: "pointer",
			background: disabled ? "#fafafa" : background,
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
		dropdownIndicator: (current, { selectProps: { menuIsOpen, isMulti } }) => ({
			...current,
			color: "#567191",
			transition: "0.5s",
			margin: isMulti ? "0 18.33px 0 4px" : "0px",
			padding: isMulti ? " 0px" : "0px 18.33px ",
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
			color: color ?? "#394759",
			alignSelf: "center",
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
			display: "flex",
			flexDirection: "column",
			gap: "5px",
			maxHeight:
				parseInt(numberOfOptionsVisible) > 0
					? `${parseInt(numberOfOptionsVisible) * 40 + 2 * 10}px`
					: "220px",
		}),
		multiValue: current => ({
			...current,
			display: "flex",
			padding: "5px",
			flexDirection: "row-reverse",
			background: "#F5F6F7",
			borderRadius: "10px",
			height: "auto",
			justifyContent: "center",
		}),
		multiValueRemove: base => ({
			...base,
			padding: "0 0 0 1px",
			"&:hover": {
				boxShadow: "none",
			},
		}),
		multiValueLabel: current => ({
			...current,
			color: "#394759",
			fontWeight: "400",
			fontSize: "0.712rem",
			padding: "0 0 0 5.4px",
			maxWidth: "60px",
			overflowX: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		}),
		valueContainer: current =>
			isNotScrollable
				? { ...current, height: "auto" }
				: {
						...current,
						height: "32px",
						overflowY: "scroll",
						// "&::-webkit-scrollbar": {
						// 	display: "none",
						// },
				  },
		option: (current, { isSelected, isFocused, isMulti }) => ({
			...current,
			...(isSelected && {
				background: isMulti
					? "#F0F8FE"
					: "linear-gradient(106.52deg, #A282E8 -11.57%, #7E8EE7 50.39%, #4499E9 116.35%)",
				color: isSelected ? (isMulti ? "#394759" : "white") : "#394759",
				// opacity: isMulti ? "0.1" : "1",
				wordWrap: "break-word",
			}),
			...(isFocused && {
				background: isSelected
					? isMulti
						? "#F0F8FE"
						: "linear-gradient(106.52deg, #A282E8 -11.57%, #7E8EE7 50.39%, #4499E9 116.35%)"
					: "#F0F8FE",

				color: isSelected ? (isMulti ? "#394759" : "white") : "#394759",
				fontWeight: isSelected ? "600" : "400",
				wordWrap: "break-word",
			}),
			"&:active": {
				background: isMulti && "#F0F8FE",
			},
			borderRadius: "15px",
			fontWeight: isSelected ? "600" : "400",
			minHeight: "auto",
			justifyContent: "space-between",
			padding: "10px 15px",
			fontSize: "1rem",
			cursor: "pointer",
			wordWrap: "break-word",
		}),
	};

	return { roundedStyles };
};
