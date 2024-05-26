import { useState, useContext } from "react";
import { useRecoilValue } from "recoil";

import { userInfo } from "@cadence-frontend/atoms";
import { useSubDepartment } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";

import { Button, ProgressiveImg } from "@cadence-frontend/components";
import { More, ShieldCrown } from "@cadence-frontend/icons";

import { ACTIONS } from "../../../../constants";

import { isActionPermitted } from "../../../../utils";

import styles from "./TeamCard.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const TeamCard = ({ info, openTeamSettings, setSdId, setSdName }) => {
	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);

	const { deleteSubDepartment: deleteTeam } = useSubDepartment(info?.sd_id, false);

	const { Users: members } = info;
	const [teamDropdown, setTeamDropdown] = useState(false);

	let moreBtnPressed = false;

	const cardClickHandler = () => {
		if (!moreBtnPressed) {
			setSdId(info.sd_id);
			setSdName(info.name);
		}
	};

	const moreBtnHandler = event => {
		moreBtnPressed = true;
		setTeamDropdown(prev => !prev);
		event.target.selected = true;

		window.onmousedown = e => {
			moreBtnPressed = false;
			if (e.target !== event.target) {
				setTeamDropdown(false);
			}
			window.onmousedown = null;
		};
	};

	const deleteTeamHandler = () => {
		deleteTeam(
			{},
			{
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Some error occured while deleting Group!",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
				},
				onSuccess: () => {
					addSuccess("Group deleted successfully");
				},
			}
		);
	};

	return (
		<div className={styles.card} onClick={cardClickHandler}>
			<div className={styles.top}>
				{info?.name === "Admin" ? (
					<ShieldCrown className={styles.logo} />
				) : (
					<ProgressiveImg
						src={
							info?.is_profile_picture_present
								? info?.profile_picture
								: "https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/sub-department-images/earth.svg"
						}
						className={styles.logo}
					/>
				)}
				<div className={styles.info}>
					<h3 className={styles.title}>{info?.name}</h3>
					<span className={styles.members}>
						{members?.length}{" "}
						{members?.length === 1
							? COMMON_TRANSLATION.MEMBER[user?.language?.toUpperCase()]
							: COMMON_TRANSLATION.MEMBERS[user?.language?.toUpperCase()]}
					</span>
				</div>
				{info.sd_id !== "admin" && (
					<div className={styles.more}>
						{info.name !== "Admin" && (
							<div className={styles.moreBtn} onClick={moreBtnHandler}>
								<More className={styles.moreBtn} />
							</div>
						)}
						{teamDropdown && (
							<div className={styles.dropdown}>
								<Button
									onClick={e => {
										e.stopPropagation();
										openTeamSettings();
									}}
									disabled={
										!isActionPermitted({
											role: user?.role,
											action: ACTIONS.UPDATE,
											sdId: info.sd_id,
											userSdId: user.sd_id,
										})
									}
								>
									{COMMON_TRANSLATION.GROUP_SETTINGS[user?.language?.toUpperCase()]}
								</Button>
								<Button
									onClick={e => {
										e.stopPropagation();
										deleteTeamHandler();
									}}
									disabled={
										info?.users_count !== 0 ||
										!isActionPermitted({
											role: user?.role,
											action: ACTIONS.UPDATE,
											sdId: info.sd_id,
											userSdId: user.sd_id,
										})
									}
								>
									{COMMON_TRANSLATION.DELETE_GROUP[user?.language?.toUpperCase()]}
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
			<div className={styles.bottom}>
				<div className={styles.imageBox}>
					{members
						?.filter((item, index) => index < 10)
						.map(memb => (
							<ProgressiveImg
								key={memb.user_id}
								className={styles.image}
								src={memb.profile_picture}
							/>
						))}
					{members?.length > 10 && (
						<div className={styles.numberCircle}>+{members?.length - 10}</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TeamCard;
