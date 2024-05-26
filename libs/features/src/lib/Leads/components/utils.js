export const getTaskEnum = task => {
	return task?.Node?.type ?? task?.name;
};

export const getMailData = ({
	body,
	subject,
	cc,
	from,
	lead,
	cadence_id,
	node_id,
	generatedLinks,
	linkText,
	redirectUrl,
}) => {
	return {
		subject: subject ?? "",
		body: body ?? "",
		cc: cc ?? "",
		lead_id: lead?.lead_id ?? "",
		to: lead
			? `${lead.first_name} ${lead.last_name} <${
					lead?.Lead_emails?.filter(em => em?.is_primary)[0]?.email_id ?? lead?.email
			  }>`
			: "",
		from: from,
		cadence_id: cadence_id ?? 0,
		node_id: node_id ?? 0,
		generatedLinks: generatedLinks ?? null,
		linkText: linkText ?? "",
		redirectUrl: redirectUrl ?? "",
	};
};
