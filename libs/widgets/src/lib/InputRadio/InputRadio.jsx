import React from "react";
import styles from "./InputRadio.module.scss";
import { Tick } from "@cadence-frontend/icons";

/**
 * This component is used to make Radio boxes.
 *
 * @component
 * @example
 * const [selected, setSelected] = useState(null);
 *
 * return(
 *   options.map(option =>
 *	    <InputRadio
 *	       size={30}
 *	       value={option}
 *		   checked={option === selected}
 *		   onChange={() => setSelected(option)}
 *	    />
 *   )
 * )
 */

const InputRadio = ({ className, size = 20, style, ...rest }) => {
	return (
		<label
			className={`${styles.radio} ${className}`}
			style={{
				width: `${size}px`,
				height: `${size}px`,
				borderRadius: "50%",
				...style,
			}}
		>
			<input type="radio" {...rest} />
			<span
				className={styles.checkmark}
				style={{
					width: `${size}px`,
					height: `${size}px`,
					borderRadius: "50%",
				}}
			/>
		</label>
	);
};

export default InputRadio;
