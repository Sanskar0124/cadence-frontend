import styles from "./CadenceGropuUserModal.module.scss";
import { Modal } from "@cadence-frontend/components";
import NoMembers from "./components/NoMembers/NoMembers";
import Users from "./components/Users/Users";
import { CADENCE_TYPES } from "@cadence-frontend/constants";
import { capitalize } from "@cadence-frontend/utils";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const CadenceGropuUserModal = ({ modal, groupInfo, setModal }) => {
	const user = useRecoilValue(userInfo);
	const renderGroupInfo = groupInfo => {
		switch (groupInfo.cadenceType) {
			case CADENCE_TYPES.PERSONAL:
				return (
					<div className={styles.users}>
						<p className={styles.roleTitle}>
							{CADENCE_TRANSLATION.CREATED_BY[user?.language?.toUpperCase()]}
						</p>
						{[groupInfo?.owner].map(user => (
							<Users userInfos={user} />
						))}
					</div>
				);

			case CADENCE_TYPES.COMPANY:
				return (
					<div className={styles.users}>
						<p className={styles.roleTitle}>
							{CADENCE_TRANSLATION.CREATED_BY[user?.language?.toUpperCase()]}
						</p>
						{[groupInfo?.owner].map(user => (
							<Users userInfos={user} />
						))}
					</div>
				);

			case CADENCE_TYPES.TEAM:
				return (
					<div className={styles.users}>
						{groupInfo.members.length || groupInfo.managers.length ? (
							<>
								{groupInfo.managers?.length > 0 && (
									<p className={styles.roleTitle}>Managers</p>
								)}
								{groupInfo.managers?.map(user => (
									<Users userInfos={user} />
								))}
								{groupInfo.members?.length > 0 && (
									<p
										className={`${styles.roleTitle} ${
											groupInfo.managers?.length > 0 && styles.temp
										}`}
									>
										Members
									</p>
								)}

								{groupInfo.members?.map(user => (
									<Users userInfos={user} />
								))}
							</>
						) : (
							<NoMembers />
						)}
					</div>
				);
		}
	};

	return (
		<Modal
			className={`${styles.cadenceGropuUserModal} ${
				groupInfo.cadenceType === CADENCE_TYPES.PERSONAL ||
				groupInfo.cadenceType === CADENCE_TYPES.COMPANY
					? styles.tempHeight
					: ""
			}`}
			isModal={modal}
			onClose={() => setModal(false)}
			showCloseButton
		>
			<div className={styles.header}>
				<h3>
					{capitalize(
						CADENCE_TRANSLATION[
							groupInfo.cadenceType === CADENCE_TYPES.TEAM
								? "GROUP"
								: groupInfo.cadenceType?.toUpperCase()
						]?.[user?.language?.toUpperCase()]
					)}{" "}
					Cadence
				</h3>
				<p>
					{groupInfo.cadenceType === CADENCE_TYPES.TEAM
						? CADENCE_TRANSLATION.CADENCE_GROUP_DESC[user?.language?.toUpperCase()]
						: groupInfo.cadenceType === CADENCE_TYPES.PERSONAL
						? CADENCE_TRANSLATION.CADENCE_PERSONAL_DESC[user?.language?.toUpperCase()]
						: CADENCE_TRANSLATION.CADENCE_COMPANY_DESC[user?.language?.toUpperCase()]}
				</p>
			</div>
			{renderGroupInfo(groupInfo)}
		</Modal>
	);
};

export default CadenceGropuUserModal;
