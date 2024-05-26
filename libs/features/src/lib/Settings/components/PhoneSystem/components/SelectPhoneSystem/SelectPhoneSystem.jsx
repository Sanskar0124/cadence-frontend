import { userInfo } from "@cadence-frontend/atoms";
import { PHONE_INTEGRATIONS } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import { usePhoneSystem } from "@cadence-frontend/data-access";
import { Settings as SETTINGS_TRANSLATION } from "@cadence-frontend/languages";
import { InputRadio } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import { PHONE_OPTIONS } from "./constants";
import styles from "./SelectPhoneSystem.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const SelectPhoneSystem = () => {
	const [user, setUser] = useRecoilState(userInfo);
	const { addSuccess, addError } = useContext(MessageContext);

	//data access
	const { phone_system, updatePhoneSystem } = usePhoneSystem();

	//states
	const [phoneSystem, setPhoneSystem] = useState(PHONE_INTEGRATIONS.RINGOVER);
	const [confirmModal, setConfirmModal] = useState(false);

	//funtions

	const updatePhoneSystemCb = value => {
		setPhoneSystem(value);

		const body = {
			phone_system: value,
		};

		updatePhoneSystem(body, {
			onSuccess: () => {
				addSuccess("Phone system updated");
				setUser(prev => ({ ...prev, phone_system: value }));
			},
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
	};

	const handlePhoneSystemSelect = value => {
		setConfirmModal(value);
	};

	//side effects

	useEffect(() => {
		if (phone_system) setPhoneSystem(phone_system);
	}, [phone_system]);

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.SELECT_PHONE_SYSTEM}>
			<div className={styles.title}>
				<h2>
					{SETTINGS_TRANSLATION.SELECT_YOUR_PHONE_SYSTEM[user?.language?.toUpperCase()]}
				</h2>
				<p>
					{
						SETTINGS_TRANSLATION.SELECT_PHONE_SYSTEM_USED_TO_PLACE_CALLS[
							user?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				{PHONE_OPTIONS.map(opt => (
					<div
						className={`${styles.greyBox} ${
							phoneSystem === opt.value ? styles.active : ""
						}`}
					>
						<div>
							<InputRadio
								checked={phoneSystem === opt.value}
								onChange={() => handlePhoneSystemSelect(opt.value)}
							/>{" "}
							{opt.label[user?.language?.toUpperCase()]}
						</div>
					</div>
				))}
			</div>
			<ConfirmationModal
				modal={confirmModal}
				setModal={setConfirmModal}
				onConfirm={updatePhoneSystemCb}
			/>
		</div>
	);
};

export default SelectPhoneSystem;
