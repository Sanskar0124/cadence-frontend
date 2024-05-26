import React from "react";
import { useStatistics } from "@cadence-frontend/data-access";
import { Tick } from "@cadence-frontend/icons";
import { ProgressiveImg } from "@cadence-frontend/components";
import styles from "../AllUsers/AllUsers.module.scss";
import Placeholder from "../Placeholder/Placeholder";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const CadenceUsers = ({
	tab,
	searchValue,
	usersSelected,
	setUsersSelected,
	cadenceSelected,
	checkUserSelect,
}) => {
	const { employees, employeesLoading } = useStatistics(
		{ users: Object.values(cadenceSelected).flat().length > 0 ? true : false },
		{ cadenceSelected: Object.values(cadenceSelected).flat() }
	);
	const user = useRecoilValue(userInfo);

	// const checkUserSelect = user_id => {
	// 	return (
	// 		(usersSelected.length === 0 && user_id === "all_users") ||
	// 		usersSelected.includes(user_id)
	// 	);
	// };

	const handleUserSelect = user_id => {
		user_id === "all_users"
			? setUsersSelected([])
			: usersSelected.includes(user_id)
			? setUsersSelected(prevState => prevState?.filter(userId => userId !== user_id))
			: setUsersSelected(prevState => [...prevState, user_id]);
	};

	return employeesLoading ? (
		<Placeholder rows={6} />
	) : employees?.length > 0 ? (
		<div className={styles.list}>
			{employees
				?.filter(user =>
					`${user.first_name} ${user.last_name}`
						.toLowerCase()
						.includes(searchValue.toLowerCase())
				)
				?.sort((a, b) => a.first_name.localeCompare(b.first_name))
				?.map(user => (
					<div
						key={user.user_id}
						onClick={() => handleUserSelect(user.user_id)}
						className={`${styles.user} ${
							checkUserSelect(user.user_id) ? styles.selected : ""
						}`}
					>
						<div className={styles.info}>
							<ProgressiveImg src={user.profile_picture} className={styles.img} />
							<div>
								<span>
									{user.first_name} {user.last_name}
								</span>
							</div>
						</div>
						<div className={styles.tick}>
							<Tick />
						</div>
					</div>
				))}
		</div>
	) : (
		<span className={styles.noEmp}>
			{" "}
			{CADENCE_TRANSLATION.NO_EMPLOYEES_ASSOCIATED[user?.language?.toUpperCase()]}
		</span>
	);
};

export default CadenceUsers;
