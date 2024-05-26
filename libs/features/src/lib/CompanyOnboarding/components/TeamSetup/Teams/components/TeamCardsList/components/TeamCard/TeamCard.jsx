import styles from "./TeamCard.module.scss";
import { ShieldCrown } from "@cadence-frontend/icons";
import { ProgressiveImg } from "@cadence-frontend/components";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const TeamCard = ({ info, setTeamId, setSdName }) => {
	const { Users: members } = info;
	const user = useRecoilValue(userInfo);

	const cardClickHandler = () => {
		setTeamId(info?.sd_id);
		setSdName(info.name);
	};

	return (
		<div className={styles.card} onClick={() => cardClickHandler()}>
			{info?.name === "Admin" ? (
				<ShieldCrown className={styles.logo} />
			) : (
				<ProgressiveImg src={info?.profile_picture} className={styles.logo} />
			)}
			<div className={styles.info}>
				<h3 className={styles.title}>{info?.name}</h3>
				<span className={styles.members}>
					{members?.length}
					{members?.length === 1
						? COMMON_TRANSLATION.MEMBER[user?.language?.toUpperCase()]
						: COMMON_TRANSLATION.MEMBERS[user?.language?.toUpperCase()]}
				</span>
			</div>
		</div>
	);
};

export default TeamCard;
