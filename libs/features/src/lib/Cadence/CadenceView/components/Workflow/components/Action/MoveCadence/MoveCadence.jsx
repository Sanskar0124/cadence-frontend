import { Select } from "@cadence-frontend/widgets";
import { useCadenceSettings } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import { Colors } from "@cadence-frontend/utils";

const MoveCadence = ({ actionData, setActionData, isDisabled }) => {
	const user = useRecoilValue(userInfo);
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
				disabled={isDisabled}
			/>
			{user?.integration_type === INTEGRATION_TYPE.SHEETS && (
				<p style={{ color: Colors.red, fontSize: "0.9rem", marginTop: "5px" }}>
					* Move to cadence is only allowed for leads imported from CSV/Excel. Leads
					imported from Google Sheets are not supported.
				</p>
			)}
		</div>
	);
};

export default MoveCadence;
