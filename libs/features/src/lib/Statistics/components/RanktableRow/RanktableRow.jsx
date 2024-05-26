import { Leads } from "@cadence-frontend/icons";

import styles from "./RanktableRow.module.scss";
import { TASKS } from "../../constants";

import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { ROLES_MAP } from "../../../Settings/components/MyAccount/components/MyDetails/constants";

const RanktableRow = ({ data }) => {
	const currentUser = useRecoilValue(userInfo);

	return (
		<div className={`${styles.row}`}>
			<div className={styles?.row_cadence}>
				<div className={styles.row_cadence_name} title={data.name}>
					{data.name}
					{/* <div className={styles.row_cadence_noofusers}>{data.no_of_users} user(s)</div> */}
				</div>

				{TASKS.map((task, index) => (
					<div className={`${styles.work_item} ${styles[`work_${index}`]}`}>
						<div className={styles.work_item_text}>
							{Object.keys(data?.tasks).map((key, ind) =>
								ind === index ? data?.tasks[key] : null
							)}
						</div>
					</div>
				))}
			</div>
			<div className={styles.row_users}>
				{data?.users
					.filter(user => !!user.user_id)
					?.map((user, index) => {
						return (
							<div className={styles.row_user}>
								<div className={styles.row_user_spacer}></div>
								<div className={styles.row_user_info}>
									<div className={styles.info_image_and_text}>
										<div className={styles.info_image}>
											<img src={user?.profile_picture} alt="profile_picture" />
										</div>
										<div className={styles.info_text}>
											<p className={styles.info_text_name}>
												{user?.first_name} {user?.last_name}
											</p>
											<p className={styles.info_text_position}>
												{ROLES_MAP[user?.role][currentUser?.language?.toUpperCase()]}{" "}
												{user?.Sub_Department?.name && `, ${user?.Sub_Department?.name}`}
											</p>
										</div>
									</div>
								</div>
								{TASKS.map((task, index) => (
									<div className={`${styles.work_item} ${styles[`work_${index}`]}`}>
										<div className={styles.work_item_text}>
											{Object.keys(user?.tasks).map((key, ind) =>
												ind === index ? user?.tasks[key] : null
											)}
										</div>
									</div>
								))}
							</div>
						);
					})}
			</div>
		</div>
	);
};
export default RanktableRow;
