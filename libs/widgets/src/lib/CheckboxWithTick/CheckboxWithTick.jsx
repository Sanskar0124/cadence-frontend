import styles from "./CheckboxWithTick.module.scss";
// import { Tick } from "../../icons";
import { Tick } from "@cadence-frontend/icons";
const CheckboxWithTick = ({ label, name, checked, onChange, className, ...rest }) => {
	return (
		<div className={styles.parent}>
			<label className={`${styles.checkbox} ${className ?? ""}`}>
				{label}
				<input
					type="checkbox"
					name={name}
					checked={checked}
					onClick={() => {
						onChange(!checked);
					}}
					onChange={() => null}
					{...rest}
				/>
				<span className={styles.checkmark}>
					{checked && <Tick size={10} color={"#FFFFFF"} />}
				</span>
			</label>
		</div>
	);
};

export default CheckboxWithTick;
