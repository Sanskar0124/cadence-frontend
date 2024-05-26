import { Select } from "@cadence-frontend/widgets";
import { useCadenceSettings } from "@cadence-frontend/data-access";

const MoveCadence = ({ actionData, setActionData }) => {
	const { cadenceDropdown } = useCadenceSettings({ cadenceDropdown: true });

	return (
		<div>
			<Select
				width={"407px"}
				value={actionData.data.cadence_id ?? ""}
				setValue={val => setActionData(prev => ({ ...prev, data: { cadence_id: val } }))}
				options={cadenceDropdown?.map(cadence => ({
					label: cadence.name,
					value: cadence.cadence_id,
				}))}
				isSearchable
				menuOnTop
			/>
		</div>
	);
};

export default MoveCadence;
