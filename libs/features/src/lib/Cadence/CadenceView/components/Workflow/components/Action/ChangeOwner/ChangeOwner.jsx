import { Select } from "@cadence-frontend/widgets";
import { useUsers } from "@cadence-frontend/data-access";

const ChangeOwner = ({ actionData, setActionData, isDisabled }) => {
	const { owners } = useUsers({ users: false, owners: true });

	return (
		<div>
			<Select
				width={"407px"}
				value={actionData.data.to ?? ""}
				setValue={val => setActionData(prev => ({ ...prev, data: { to: val } }))}
				options={owners?.map(owner => ({
					label: `${owner?.full_name ?? "Unknown"}`,
					value: owner.user_id,
				}))}
				isSearchable
				menuOnTop
				disabled={isDisabled}
			/>
		</div>
	);
};

export default ChangeOwner;
