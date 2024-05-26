import { Tick } from "@cadence-frontend/icons";
import styles from "./Checkbox.module.scss";
import THEMES from "./themes";

/**
 * This component is used to make a Checkbox.
 *
 * @component
 * @example
 * const [checked, setChecked] = useState(false);
 *
 * return(
 * 	<Checkbox
 * 		checked={checked}
 * 		onChange={setChecked}
 * 	/>
 * )
 */

const Checkbox = ({
	theme,
	name,
	checked,
	size = 20,
	style,
	onChange,
	className,
	...rest
}) => {
	return (
		<label
			className={`${styles.checkbox} ${className ?? ""}`}
			style={{
				width: `${size}px`,
				height: `${size}px`,

				...style,
			}}
		>
			<input
				type="checkbox"
				name={name}
				checked={checked}
				onClick={() => {
					onChange(!checked);
				}}
				onChange={() => null}
				{...rest}
				style={{
					width: `${size}px`,
					height: `${size}px`,

					...style,
				}}
			/>
			<span className={`${styles.checkmark} ${styles[THEMES[theme]]}`}>
				<Tick size="1rem" />
			</span>
		</label>
	);
};

export default Checkbox;
