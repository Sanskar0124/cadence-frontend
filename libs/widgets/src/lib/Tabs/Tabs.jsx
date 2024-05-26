import { TabNav, TabNavBtn } from "@cadence-frontend/widgets";
import { TabNavSlider } from "../TabNavSlider/TabNavSlider";

const defaultTabs = {
	value: "label",
};

const Tabs = ({
	theme,
	btnTheme,
	tabs = defaultTabs,
	value,
	setValue,
	name,
	radio = false,
	className,
	btnClassName,
	btnBordered = false,
	width = "270px",
	...rest
}) => {
	if (radio) {
		return (
			<TabNavSlider
				width={width}
				theme={theme}
				btnBordered={btnBordered}
				{...rest}
				btnTheme={btnTheme}
				buttons={
					Array.isArray(tabs)
						? tabs
						: Object.keys(tabs).map(t => ({
								label: tabs[t],
								value: t === "true" || t === "false" ? JSON.parse(t) : t,
						  }))
				}
				className={className}
				btnClassName={btnClassName}
				value={typeof value === "object" ? value?.[name] : value}
				setValue={val =>
					typeof value === "object"
						? setValue(prev => ({ ...prev, [name]: val }))
						: setValue(val)
				}
			/>
		);
	} else {
		return (
			<TabNav
				btnBordered={btnBordered}
				theme={theme}
				btnTheme={btnTheme}
				{...rest}
				btnClassName={btnClassName}
			>
				{Array.isArray(tabs)
					? tabs.map(tab => (
							<TabNavBtn
								active={value[name]?.includes(tab?.value)}
								onClick={() =>
									typeof value === "object"
										? setValue(prev => ({
												...prev,
												[name]: prev[name].includes(tab?.value)
													? prev[name].filter(p => p !== tab?.value)
													: [...prev[name], tab?.value],
										  }))
										: setValue(prev =>
												prev.includes(tab) ? prev.filter(p => p !== tab) : [...prev, tab]
										  )
								}
								key={tab.value}
							>
								{tab.label}
							</TabNavBtn>
					  ))
					: Object.keys(tabs).map((tab, index) => (
							<TabNavBtn
								active={value[name]?.includes(tab)}
								onClick={() =>
									typeof value === "object"
										? setValue(prev => ({
												...prev,
												[name]: prev[name].includes(tab)
													? prev[name].filter(p => p !== tab)
													: [...prev[name], tab],
										  }))
										: setValue(prev =>
												prev.includes(tab) ? prev.filter(p => p !== tab) : [...prev, tab]
										  )
								}
								key={index}
							>
								{tabs[tab]}
							</TabNavBtn>
					  ))}
			</TabNav>
		);
	}
};

export default Tabs;

//value can be object or also an array in case of checkbox
//if radio === true then that name key of object will have single value
//if radio === false then that name key of object will have array of values
