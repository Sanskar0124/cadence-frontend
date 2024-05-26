import { InputThemes } from "@cadence-frontend/themes";
import { Input, Select } from "@cadence-frontend/widgets";
import { PAUSECADENCE_OPTIONS } from "./constants";

import styles from "./PauseCadence.module.scss";

const PauseCadence = ({ actionData, setActionData, isDisabled }) => {
	return (
		<div className={styles.options}>
			<Input
				value={actionData.data.unix_time ?? ""}
				setValue={val =>
					setActionData(prev => ({ ...prev, data: { ...prev.data, unix_time: val } }))
				}
				type="number"
				theme={InputThemes.WHITE}
				width="60px"
				height="50px"
				placeholder="00"
				disabled={isDisabled}
				style={isDisabled ? { backgroundColor: "#fafafa" } : {}}
			/>
			<Select
				width={"320px"}
				value={actionData.data.unix_mode ?? ""}
				setValue={val =>
					setActionData(prev => ({ ...prev, data: { ...prev.data, unix_mode: val } }))
				}
				options={PAUSECADENCE_OPTIONS()}
				isSearchable
				menuOnTop
				placeholder={"Select min/days"}
				disabled={isDisabled}
			/>
		</div>
	);
};

export default PauseCadence;
