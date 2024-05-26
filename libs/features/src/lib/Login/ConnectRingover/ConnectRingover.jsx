/* eslint-disable no-console */

import { MessageContext } from "@cadence-frontend/contexts";
import { useRingoverOAuth } from "@cadence-frontend/data-access";
import { RingoverLogoWithColor } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext } from "react";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import styles from "./ConnectRingover.module.scss";
import { useQuery } from "@cadence-frontend/utils";

const ConnectRingover = ({ width }) => {
	const query = useQuery();
	const language = query.get("lang") ?? "ENGLISH";
	const { addError } = useContext(MessageContext);
	const { fetchRingoverURI, fetchRingoverURILoading } = useRingoverOAuth();

	const onLogin = () => {
		localStorage.clear();
		fetchRingoverURI(null, {
			onError: err =>
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				}),
		});
	};

	return (
		<div className={styles.container}>
			<ThemedButton
				onClick={onLogin}
				loading={fetchRingoverURILoading}
				loadingText="Logging in"
				theme={ThemedButtonThemes.GREEN}
				width={width}
				height="64px"
			>
				<RingoverLogoWithColor size="1.5rem" />
				<div>{COMMON_TRANSLATION.LOGIN_WITH_RINGOVER[language?.toUpperCase()]}</div>
			</ThemedButton>
		</div>
	);
};

export default ConnectRingover;
