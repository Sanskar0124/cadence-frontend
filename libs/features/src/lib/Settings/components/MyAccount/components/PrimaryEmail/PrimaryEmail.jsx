import { useUser } from "@cadence-frontend/data-access";
import { InputRadio } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import React, { useContext } from "react";
import styles from "./PrimaryEmail.module.scss";
import { useQueryClient } from "react-query";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Placeholder from "../Placeholder/Placeholder";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { MAIL_INTEGRATION_TYPES } from "@cadence-frontend/constants";
import { capitalize } from "@cadence-frontend/utils";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import { Link2 } from "@cadence-frontend/icons";
import { useNavigate } from "react-router-dom";
import { TABS } from "../../../../constants";

const PrimaryEmail = () => {
	const navigate = useNavigate();
	const { addError, addSuccess } = useContext(MessageContext);
	const setRecoilUser = useSetRecoilState(userInfo);
	const language = useRecoilValue(userInfo).language;
	const queryClient = useQueryClient();

	const { emails, emailsLoading, user, updateUser } = useUser({
		user: true,
		emails: true,
	});

	const onUpdatePrimary = email => {
		updateUser(
			{ primary_email: email },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating primary email",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					setRecoilUser(prev => ({ ...prev, primary_email: email }));
					addSuccess("Primary email updated");
				},
			}
		);
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.EMAILS}>
			<div className={styles.title}>
				<h2>{COMMON_TRANSLATION.EMAILS[language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.PRIMARY_MAIL[language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				{emailsLoading ? (
					<Placeholder rows={3} />
				) : !emails?.length ? (
					<div className={`${styles.greyBox} ${styles.fallback}`}>
						<div>
							<span />
							{user?.[`is_${user?.mail_integration_type}_token_expired`]
								? `You are not connected with ${capitalize(user?.mail_integration_type)}`
								: PROFILE_TRANSLATION.NO_EMAILS_PRESENT[language?.toUpperCase()]}
						</div>
					</div>
				) : (
					emails?.map(email => (
						<div
							key={email.address}
							className={`${styles.greyBox} ${
								email.address === user?.primary_email ? styles.active : ""
							}`}
						>
							<div>
								<InputRadio
									size={24}
									checked={email.address === user?.primary_email}
									value={email.address}
									onChange={() => onUpdatePrimary(email.address)}
								/>
								<span className={styles.name} title={email.address}>
									{email.address}
								</span>
							</div>
						</div>
					))
				)}
				{user?.[`is_${user?.mail_integration_type}_token_expired`] && (
					<div
						className={styles.link}
						onClick={() =>
							navigate(
								`?view=${TABS.MY_CONNECTIONS}&search=${SEARCH_OPTIONS.CONNECT_ANOTHER_SOURCE}`
							)
						}
					>
						<span>Connect your email system</span>
						<Link2 />
					</div>
				)}
			</div>
		</div>
	);
};

export default PrimaryEmail;
