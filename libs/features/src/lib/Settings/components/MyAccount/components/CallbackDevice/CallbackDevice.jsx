import { useContext } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { useUser } from "@cadence-frontend/data-access";
import { InputRadio } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { userInfo } from "@cadence-frontend/atoms";
import { CALLBACK_DEVICE_OPTIONS, CALLBACK_OPTIONS_CONSTANTS } from "./constants";

import styles from "./CallbackDevice.module.scss";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const CallbackDevice = props => {
	const { addError, addSuccess } = useContext(MessageContext);
	const { user, updateUser } = useUser({ user: true });
	const language = useRecoilValue(userInfo).language;
	const setRecoilUser = useSetRecoilState(userInfo);

	const handleChange = value => {
		const body = { callback_device: value };
		updateUser(body, {
			onError: err => {
				addError({
					text: err?.response?.data?.msg || "Error in updating callback device setting",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				setRecoilUser(prev => ({ ...prev, callback_device: value }));
				addSuccess("Device for callback tasks updated");
			},
		});
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.CALLBACK_DEVICES}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.CALLBACK_DEVICES[language?.toUpperCase()]}</h2>
				<p>{PROFILE_TRANSLATION.SET_CALLBACK_DEVICE[language?.toUpperCase()]}</p>
			</div>
			<div className={styles.settings}>
				<div className={styles.options}>
					{CALLBACK_DEVICE_OPTIONS.map(option => (
						<div
							className={`${styles.greyBox} ${
								user?.callback_device === option.value ? styles.active : ""
							}`}
						>
							<div>
								<InputRadio
									size={24}
									checked={user?.callback_device === option.value}
									value={option.value}
									onChange={() => handleChange(option.value)}
								/>
								<span className={styles.name}>
									{
										CALLBACK_OPTIONS_CONSTANTS[option.label][
											user?.language?.toUpperCase()
										]
									}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CallbackDevice;
