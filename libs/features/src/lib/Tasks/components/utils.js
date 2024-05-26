export const getTaskEnum = task => {
	return task?.Node?.type ?? task?.name;
};

export const getMailData = ({
	body,
	subject,
	cc,
	bcc,
	from,
	to,
	lead,
	cadence_id,
	node_id,
	generatedLinks,
	linkText,
	redirectUrl,
	et_id,
}) => {
	return {
		subject: subject ?? "",
		body: body ?? "",
		cc: cc ?? "",
		bcc: bcc ?? "",
		lead_id: lead?.lead_id ?? "",
		to: to ?? lead?.Lead_emails?.filter(em => em?.is_primary)[0]?.email_id ?? lead?.email,
		from: from,
		cadence_id: cadence_id ?? 0,
		node_id: node_id ?? 0,
		generatedLinks: generatedLinks ?? null,
		linkText: linkText ?? "",
		redirectUrl: redirectUrl ?? "",
		email_template_id: et_id ?? "",
	};
};
