import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./InstanceUrl.module.scss";
import InputWithButton from "../../../InputWithButton/InputWithButton";
import InstanceUrlModal from "../InstanceUrlModal/InstanceUrlModal";

const InstanceUrl = ({ userDataAccess }) => {
	const { addError } = useContext(MessageContext);
	const { user } = userDataAccess;
	const [recoilUser, setRecoilUser] = useRecoilState(userInfo);
	const [instanceUrlModal, setInstanceUrlModal] = useState(false);

	const [input, setInput] = useState("");

	useEffect(() => {
		if (user) setInput(user?.Integration_Token?.instance_url);
	}, [user]);
	const handleUpdate = () => {
		if (!input) {
			return addError({ text: "Enter the instance URL." });
		}
		if (!input.startsWith("https://") || !input.endsWith("dynamics.com")) {
			return addError({ text: "Enter the correct instance URL." });
		}
		setInstanceUrlModal(input);
	};
	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<h2>
					{PROFILE_TRANSLATION.YOUR_INSTANCE_URL[recoilUser?.language?.toUpperCase()]}
				</h2>
				<p>
					{
						PROFILE_TRANSLATION.ENTER_YOUR_INSTANCE_URL[
							recoilUser?.language?.toUpperCase()
						]
					}
				</p>
			</div>
			<div className={styles.settings}>
				<InputWithButton
					btnText={COMMON_TRANSLATION.UPDATE[recoilUser?.language?.toUpperCase()]}
					inputProps={{
						value: input,
						setValue: setInput,
						placeholder:
							PROFILE_TRANSLATION.SAMPLE_INSTANCE_URL[
								recoilUser?.language?.toUpperCase()
							],
					}}
					btnProps={{
						onClick: handleUpdate,
					}}
					width="60%"
				/>
			</div>
			<InstanceUrlModal
				modal={instanceUrlModal}
				setModal={setInstanceUrlModal}
				userDataAccess={userDataAccess}
				setRecoilUser={setRecoilUser}
			/>
		</div>
	);
};

export default InstanceUrl;
