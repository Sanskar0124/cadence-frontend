import { Input, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./InputWithButton.module.scss";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";

const InputWithButton = ({ btnText, inputProps, btnProps, width }) => {
	return (
		<div className={styles.inputBox} style={{ width }}>
			<Input theme={InputThemes.WHITE} className={styles.input} {...inputProps} />
			<div className={styles.btn}>
				<ThemedButton
					theme={ThemedButtonThemes.TRANSPARENT}
					width="fit-content"
					{...btnProps}
				>
					<div>{btnText}</div>
				</ThemedButton>
			</div>
		</div>
	);
};
export default InputWithButton;
