const removeUnprocessedVariables = body => {
	if (typeof body !== "string") return body;

	// Algorithm to find unprocessed variables and store them in Set
	let st = [];
	let variable = "";
	let variables = new Set();
	for (const ch of body) {
		if (ch === "{") {
			if (st.length < 2) st.push(ch);
		} else if (ch === "}" && st.length) {
			st.pop();
			if (st.length === 0 && variable.length) {
				variables.add(variable);
				variable = "";
			}
		} else if (st.length === 2) {
			variable += ch;
		} else {
			st = [];
			variable = "";
		}
	}

	// Removing the unprocessed variables from body
	const excludedVars = ["ringover_meet", "user_signature", "calendly_link"];
	variables.forEach(variable => {
		if (
			!excludedVars.includes(variable) &&
			!variable.includes("custom_link(") &&
			!variable.includes("unsubscribe(")
		)
			body = body.replaceAll(`{{${variable}}}`, "");
	});

	return body;
};

export default removeUnprocessedVariables;
