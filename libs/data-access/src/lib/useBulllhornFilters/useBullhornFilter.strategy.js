import { ALL_DATATYPE } from "./constant";

export const describeFieldStrategy = response => {
	// .filter(l =>
	// 	l.dataType === "Timestamp"
	// 		? Object.keys(l).includes("dataSpecialization") &&
	// 		  l.dataSpecialization !== "SYSTEM"
	// 		: true
	// )

	return response
		?.filter(
			item =>
				Object.keys(item).includes("dataType") &&
				item.dataType !== "Address" &&
				item.dataType !== "SecondaryAddress" &&
				item.dataType !== "OnboardingReceivedSent" &&
				item.dataType !== "BillingAddress"
		)
		.map(item => {
			const obj = {
				name: item.name,
				label: item.label,
				type: "string",
				dataType:
					item.dataType === ALL_DATATYPE.TIMESTAMP
						? item.dataSpecialization
						: Object.keys(item).includes("inputType") &&
						  Object.keys(item).includes("options")
						? item.inputType
						: item.dataType,
			};

			if (
				Object.keys(item).includes("inputType") &&
				Object.keys(item).includes("options")
			) {
				obj.picklistValues = item.options;
				obj.multiValue = item.multiValue;
			}

			return obj;
		});
};
