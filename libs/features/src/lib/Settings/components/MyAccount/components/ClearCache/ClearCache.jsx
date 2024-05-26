import { userInfo } from "@cadence-frontend/atoms";
import { Trash } from "@cadence-frontend/icons";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import styles from "./ClearCache.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const ClearCache = () => {
	const user = useRecoilValue(userInfo);

	const clearCache = () => window.location.reload(true);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.CLEAR_CACHE}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.CLEAR_CACHE[user?.language?.toUpperCase()]}</h2>
				<p>Empty cache and reload page</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.clearCache}>
					<ThemedButton
						theme={ThemedButtonThemes.GREY}
						width="fit-content"
						onClick={clearCache}
					>
						<Trash color={Colors.red} />{" "}
						{PROFILE_TRANSLATION.CLEAR_CACHE[user?.language?.toUpperCase()]}
					</ThemedButton>
				</div>
			</div>
		</div>
	);
};

export default ClearCache;
