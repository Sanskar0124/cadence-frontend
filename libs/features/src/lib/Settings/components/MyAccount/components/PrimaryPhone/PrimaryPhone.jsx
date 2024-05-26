import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import { usePhoneNumber, useUser } from "@cadence-frontend/data-access";
import { ErrorGradient, ErrorGradient2, Link2 } from "@cadence-frontend/icons";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { InputRadio } from "@cadence-frontend/widgets";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Placeholder from "../Placeholder/Placeholder";
import styles from "./PrimaryPhone.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";
import { useNavigate } from "react-router-dom";
import { TABS } from "../../../../constants";

const PrimaryPhone = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const language = useRecoilValue(userInfo).language;
	const { addError, addSuccess } = useContext(MessageContext);
	const { user, updateUser } = useUser({ user: true });
	const setRecoilUser = useSetRecoilState(userInfo);
	const { phoneNumbers, phoneNumbersLoading, phoneNumbersError } = usePhoneNumber(true);

	const onPrimaryChange = number => {
		updateUser(
			{ primary_phone_number: number },
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg || "Error updating primary phone number",
						desc: err?.response?.data?.error || "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					queryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => {
					setRecoilUser(prev => ({ ...prev, primary_phone_number: number }));
					addSuccess("Primary phone number updated");
				},
			}
		);
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.PRIMARY_PHONE}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.PRIMARY_PHONE[language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.PRIMARY_PHONE_NUMBER[language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				{phoneNumbersLoading ? (
					<Placeholder rows={2} />
				) : !phoneNumbers?.length ? (
					<div className={`${styles.greyBox} ${styles.fallback}`}>
						<div>
							<span />
							{user?.Ringover_Token
								? PROFILE_TRANSLATION.NO_PHONE_NUMBERS_PRESENT[language?.toUpperCase()]
								: "You are not connected with Ringover"}
						</div>
					</div>
				) : (
					phoneNumbers?.map(number => (
						<div
							className={`${styles.greyBox} ${
								user?.primary_phone_number === number.value ? styles.active : ""
							}`}
						>
							<div className={styles.input}>
								<InputRadio
									size={24}
									checked={user?.primary_phone_number === number.value}
									value={number.value}
									onChange={() => onPrimaryChange(number.value)}
								/>
								<span className={styles.name}>{number.label}</span>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default PrimaryPhone;
