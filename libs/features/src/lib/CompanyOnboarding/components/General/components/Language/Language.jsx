import styles from "./Language.module.scss";
import { TabNav, TabNavBtn } from "@cadence-frontend/widgets";
import { TabNavBtnThemes, TabNavThemes } from "@cadence-frontend/themes";
import { FranceFlag, UkFlag, SpainFlag } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import { useUser } from "@cadence-frontend/data-access";
import { QueryClient } from "react-query";
import { SESSION_STORAGE_KEYS } from "@cadence-frontend/constants";

const Language = ({ isHome }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const language = useRecoilValue(userInfo).language;

	const { updateUser } = useUser({ user: true });
	const queryClient = new QueryClient();
	const setRecoilUser = useSetRecoilState(userInfo);
	const onUpdate = language => {
		!isHome && sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_LANGUAGE_UPDATED, true);
		updateUser(
			{ language },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating language",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					setRecoilUser(prev => ({
						...prev,
						language,
					}));
					addSuccess(COMMON_TRANSLATION.LANGUAGE_UPDATE_MESSAGE[language.toUpperCase()]);
				},
			}
		);
	};

	return (
		<div className={styles.language}>
			<TabNav
				theme={!isHome && TabNavThemes.WHITE}
				btnTheme={
					isHome
						? TabNavBtnThemes.PRIMARY_AND_TRANSPARENT
						: TabNavBtnThemes.PRIMARY_AND_GREY
				}
			>
				<TabNavBtn
					active={language === "english" ? true : false}
					onClick={e => onUpdate("english")}
				>
					<UkFlag className={language === "english" ? styles.active : ""} />
					{COMMON_TRANSLATION.ENGLISH[user?.language?.toUpperCase()]}
				</TabNavBtn>
				<TabNavBtn
					onClick={e => onUpdate("french")}
					active={language === "french" ? true : false}
				>
					<FranceFlag className={language === "french" ? styles.active : ""} />
					{COMMON_TRANSLATION.FRENCH[user?.language?.toUpperCase()]}
				</TabNavBtn>
				<TabNavBtn
					onClick={e => onUpdate("spanish")}
					active={language === "spanish" ? true : false}
				>
					<SpainFlag className={language === "spanish" ? styles.active : ""} />
					{COMMON_TRANSLATION.SPANISH[user?.language?.toUpperCase()]}
				</TabNavBtn>
			</TabNav>
		</div>
	);
};

export default Language;
