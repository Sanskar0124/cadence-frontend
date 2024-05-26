import { useContext } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { useUser } from "@cadence-frontend/data-access";
import { InputRadio } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { IFRAME_POSITION_OPTIONS } from "./constants";

import styles from "./RingoverIframe.module.scss";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const RingoverIframe = () => {
	const { addError, addSuccess } = useContext(MessageContext);
	const language = useRecoilValue(userInfo).language;
	const { user, updateUser } = useUser({ user: true });
	const setRecoilUser = useSetRecoilState(userInfo);

	const handleChange = value => {
		const body = { is_call_iframe_fixed: value };
		updateUser(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg || "Error in updating iFrame setting",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				setRecoilUser(prev => ({ ...prev, is_call_iframe_fixed: value }));
				addSuccess("Ringover i-frame updated");
			},
		});
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.RINGOVER_I_FRAME}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.RINGOVER_I_FRAME[language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.I_FRAME[language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				{Object.values(IFRAME_POSITION_OPTIONS).map(option => (
					<div
						className={`${styles.greyBox} ${
							user?.is_call_iframe_fixed === option.value ? styles.active : ""
						}`}
					>
						<div>
							<InputRadio
								size={24}
								checked={user?.is_call_iframe_fixed === option.value}
								value={option.value}
								onChange={() => handleChange(option.value)}
							/>
							<span className={styles.name}>{option.label[language?.toUpperCase()]}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RingoverIframe;
