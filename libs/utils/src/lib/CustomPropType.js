class CustomPropType {
	static componentOfType(component) {
		return (props, propName, componentName) => {
			const p = props[propName];
			if (
				Array.isArray(p) &&
				!p.reduce((acc, e) => acc && e.type.name !== component.name, true)
			) {
				return new Error(
					`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected type of \`${component.name} Validation failed.`
				);
			} else if (p !== undefined && p.type.name !== component.name) {
				return new Error(
					`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected type of \`${
						component.name
					}\` and received \`${p.type.name ? p.type.name : p.type}\`. Validation failed.`
				);
			}
		};
	}
}

export default CustomPropType;
