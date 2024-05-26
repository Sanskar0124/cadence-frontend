import { Select } from "@cadence-frontend/widgets";
import { useUsers } from "@cadence-frontend/data-access";

const ChangeOwner = ({ actionData, setActionData }) => {
	const { users } = useUsers();
	return (
		<div>
			<Select
				width={"407px"}
				value={actionData.data.to ?? ""}
				setValue={val => setActionData(prev => ({ ...prev, data: { to: val } }))}
				options={users?.map(user => ({
					label: `${user.first_name} ${user.last_name}`,
					value: user.user_id,
				}))}
				isSearchable
				menuOnTop
			/>
		</div>
	);
};

export default ChangeOwner;
