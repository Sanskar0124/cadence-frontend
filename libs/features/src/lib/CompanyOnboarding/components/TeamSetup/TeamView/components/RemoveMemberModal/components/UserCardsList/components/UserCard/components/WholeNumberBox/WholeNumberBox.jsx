import styles from "./WholeNumberBox.module.scss";
import { TriangleArrow } from "@cadence-frontend/icons";

const WholeNumberBox = ({ name, value, setValue, disabled }) => {
	const isWholeNumStr = value => {
		return /^(?=.*?[0-9])/.test(value);
	};

	return (
		<div className={styles.numberBox}>
			<div className={`${styles.changeCount} ${!disabled ? styles.show : ""}`}>
				<TriangleArrow onClick={() => setValue(value + 1)} />
				<TriangleArrow
					style={{ transform: "rotate(180deg)" }}
					onClick={() => setValue(value > 0 ? value - 1 : 0)}
				/>
			</div>
			<input
				name={name}
				value={value}
				onChange={e => {
					const value = e.target.value;
					if (value === "") {
						setValue(value);
					} else if (isWholeNumStr(value)) {
						setValue(parseInt(value));
					}
				}}
				onBlur={e => {
					if (value === "") {
						setValue(0);
					}
				}}
				disabled={disabled}
				className={styles.input}
			/>
		</div>
	);
};

export default WholeNumberBox;
