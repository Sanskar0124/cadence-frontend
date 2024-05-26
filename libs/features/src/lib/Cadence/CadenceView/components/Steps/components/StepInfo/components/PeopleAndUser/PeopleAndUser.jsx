import { useNodeStats } from "@cadence-frontend/data-access";

import styles from "./PeopleAndUser.module.scss";
import { LeadsGradient, Leads } from "@cadence-frontend/icons";
import { Image, Skeleton } from "@cadence-frontend/components";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";

const PeopleAndUser = ({ stats, loading }) => {
	const user = useRecoilValue(userInfo);
	return (
		<div className={styles.peopleAndUsers}>
			{loading ? (
				[...Array(7).keys()].map(key => (
					<Skeleton key={key} className={styles.placeholder} />
				))
			) : stats?.length ? (
				stats?.map(stat => (
					<div key={stat?.user_id} className={styles.peopleAndUser}>
						<div className={styles.info}>
							<Image src={stat?.User?.profile_picture} className={styles.image} />
							<div
								className={styles.name}
								title={`${stat?.User?.first_name} ${stat?.User?.last_name}`}
							>{`${stat?.User?.first_name} ${stat?.User?.last_name}`}</div>
						</div>
						<div className={styles.connects}></div>
						<div className={styles.statistics}>
							<LeadsGradient size={18} />
							<span>{stat?.count}</span>
						</div>
					</div>
				))
			) : (
				<Empty user={user} />
			)}
		</div>
	);
};

export default PeopleAndUser;

const Empty = user => {
	return (
		<div className={styles.emptySpaceWrapper}>
			<div className={styles.emptySpace}>
				<div className={styles.title}>
					{
						CADENCE_TRANSLATION.NO_PEOPLE_ARE_CURRENTLY_ON_THIS_STEP[
							user?.user?.language?.toUpperCase()
						]
					}
				</div>
				<div className={styles.subTitle}>
					<span>
						<Leads size="20px" />
					</span>
					<span>0 {COMMON_TRANSLATION.PEOPLE[user?.user?.language?.toUpperCase()]}</span>
				</div>
			</div>
		</div>
	);
};
