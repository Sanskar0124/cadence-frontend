export default function (itMap) {
	const lead_company_size = itMap?.lead_map?.size?.picklist_values;
	const account_company_size = itMap?.account_map?.size?.picklist_values;
	const org_company_size = itMap?.organization_map?.size?.picklist_values;

	let allPicklistValues = [];
	if (lead_company_size?.length > 0) allPicklistValues = lead_company_size;

	if (account_company_size?.length > 0) {
		account_company_size.forEach(obj1 => {
			if (
				allPicklistValues.filter(obj2 => JSON.stringify(obj1) === JSON.stringify(obj2))
					.length < 1
			)
				allPicklistValues.push(obj1);
		});
	}

	if (org_company_size?.length > 0) allPicklistValues = org_company_size;

	allPicklistValues.sort((a, b) => a.value < b.value);

	let newCompanySizeOptions = {};

	allPicklistValues.forEach(({ label, value }, _) => {
		newCompanySizeOptions[value] = label;
	});

	return newCompanySizeOptions;
}
