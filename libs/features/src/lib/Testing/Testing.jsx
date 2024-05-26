import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Container } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import styles from "./Testing.module.scss";
import { Cadences } from "@cadence-frontend/icons";

const Testing = () => {
	return (
		<Container className={styles.container}>
			<div className={styles.testing}>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={() => console.log("clicked")}
					loadingText="Button"
					disabled
				>
					Button
				</ThemedButton>
				<ThemedButton
					theme={ThemedButtonThemes.RED}
					onClick={() => console.log("clicked")}
					loading={false}
					loadingText="Button"
					disabled
				>
					Button
				</ThemedButton>
				<ThemedButton
					theme={ThemedButtonThemes.GREEN}
					onClick={() => console.log("clicked")}
					loading={false}
					loadingText="Button"
					disabled
				>
					Button
				</ThemedButton>
				<div></div>

				<ThemedButton
					theme={ThemedButtonThemes.WHITE}
					onClick={() => console.log("clicked")}
					loading={false}
					loadingText="Filter"
					disabled
				>
					<>
						<Cadences /> filter
					</>
				</ThemedButton>
				<ThemedButton
					theme={ThemedButtonThemes.ACTIVE}
					onClick={() => console.log("clicked")}
					loading={false}
					loadingText="Filter"
					disabled
				>
					<>
						<Cadences /> filter
					</>
				</ThemedButton>
				<div></div>
				<div></div>
				<ThemedButton
					theme={ThemedButtonThemes.TRANSPARENT}
					onClick={() => console.log("clicked")}
					loading={false}
					loadingText="Button"
					disabled
				>
					Button
				</ThemedButton>

				<div></div>
				<div></div>
				<div></div>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					onClick={() => console.log("clicked")}
					disabled
				>
					...
				</ThemedButton>
				<div></div>
				<div></div>
				<div></div>
				<ThemedButton
					theme={ThemedButtonThemes.ICON}
					onClick={() => console.log("clicked")}
					loading={false}
					disabled
				>
					...
				</ThemedButton>
			</div>
		</Container>
	);
};

export default Testing;
