import { TabNavBtnThemes, TabNavThemes } from "@cadence-frontend/themes";
import { TabNav, TabNavBtn } from "@cadence-frontend/widgets";
import React, { useContext, useEffect, useState } from "react";
import { FranceFlag, UkFlag, SpainFlag } from "@cadence-frontend/icons";
import styles from "./Language.module.scss";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Notifications as NOTIFICATION_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { QueryClient, useQueryClient } from "react-query";
import { MessageContext } from "@cadence-frontend/contexts";
import { useUser } from "@cadence-frontend/data-access";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const queryClient = new QueryClient();
const Language = () => {
	const { addError, addSuccess } = useContext(MessageContext);
	const setRecoilUser = useSetRecoilState(userInfo);
	const language = useRecoilValue(userInfo).language;
	const { user, updateUser } = useUser({ user: true });

	const onUpdate = language => {
		updateUser(
			{ language },
			{
				onError: (err, _, context) => {
					addError({
						text:
							err.response?.data?.msg ||
							NOTIFICATION_TRANSLATION.ERROR_UPDATING[user?.language.toUpperCase()],
						desc: err?.response?.data?.error,
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
		<div className={styles.container} id={SEARCH_OPTIONS.LANGUAGE}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.LANGUAGE[language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.SELECT_LANGUAGE[language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				<TabNav theme={TabNavThemes.WHITE} btnTheme={TabNavBtnThemes.PRIMARY_AND_GREY}>
					<TabNavBtn
						active={user?.language === "english" ? true : false}
						onClick={e => onUpdate("english")}
					>
						<UkFlag className={user?.language === "english" ? styles.active : ""} />
						{COMMON_TRANSLATION.ENGLISH[language?.toUpperCase()]}
					</TabNavBtn>
					<TabNavBtn
						onClick={e => onUpdate("french")}
						active={user?.language === "french" ? true : false}
					>
						<FranceFlag className={user?.language === "french" ? styles.active : ""} />
						{COMMON_TRANSLATION.FRENCH[language?.toUpperCase()]}
					</TabNavBtn>
					<TabNavBtn
						onClick={e => onUpdate("spanish")}
						active={user?.language === "spanish" ? true : false}
					>
						<SpainFlag className={user?.language === "spanish" ? styles.active : ""} />
						{COMMON_TRANSLATION.SPANISH[language?.toUpperCase()]}
					</TabNavBtn>
				</TabNav>
			</div>
		</div>
	);
};

export default Language;
