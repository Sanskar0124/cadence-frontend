export const getEntity = ({ lead, addr, firstName, lastName }) => {
	if (!lead) {
		lead = {};
		lead.first_name = firstName;
		lead.last_name = lastName;
	}
	return addr
		? `${lead.first_name} ${lead.last_name} <${addr}>`
		: lead
		? `${lead.first_name} ${lead.last_name} <${
				lead.Lead_emails?.filter(em => em?.is_primary)[0]?.email_id ?? lead.email
		  }>`
		: "";
};

export const getEmailFromEntity = fromHeader => {
	const rfc2822EmailRegex =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	const result = fromHeader.match(rfc2822EmailRegex);
	if (result) return result[0];
	return null;
};
