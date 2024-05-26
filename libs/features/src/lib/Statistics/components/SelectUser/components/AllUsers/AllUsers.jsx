import {
	useEmployees,
	useStatistics,
	useSubDepartments,
} from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Leads, Tick, TriangleDown } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { ProgressiveImg } from "@cadence-frontend/components";
import { TABS } from "../../constants";
import styles from "./AllUsers.module.scss";
import Placeholder from "../Placeholder/Placeholder";
import {
	Common as COMMON_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
} from "@cadence-frontend/languages";
import { ROLES } from "@cadence-frontend/constants";

const AllUsers = ({
	tab,
	setTab,
	searchValue,
	usersSelected,
	setUsersSelected,
	accordian,
	setAccordian,
	checkUserSelect,
}) => {
	const role = useRecoilValue(userInfo).role;
	// const [accordian, setAccordian] = useState(false);
	let { users, usersLoading } = useStatistics(
		{ allUsers: Boolean(tab) },
		{ cadenceSelected: [] }
	);
	const userData = useRecoilValue(userInfo);

	const { subDepartments, subDepartmentsLoading } = useSubDepartments(
		tab === TABS.GROUPS
	);
	const { employees, employeesLoading } = useEmployees(
		Boolean(accordian),
		role,
		accordian
	);

	if (users) {
		users = [
			{
				user_id: "all_users",
				first_name: "All users",
				last_name: "",
			},
			...users,
		];
	}

	const handleUserSelect = user_id => {
		user_id === "all_users"
			? setUsersSelected([])
			: usersSelected?.includes(user_id)
			? setUsersSelected(prevState => prevState?.filter(userId => userId !== user_id))
			: setUsersSelected(prevState => [...prevState, user_id]);
	};

	useEffect(() => {
		if (accordian) {
			let user_ids = employees?.map(emp => emp.user_id);
			setUsersSelected(user_ids);
		}
	}, [employees]);

	console.log(users, "check users");

	return tab === TABS.USERS ? (
		usersLoading ? (
			<Placeholder rows={6} />
		) : (
			<div className={styles.list}>
				{users
					?.filter(user =>
						`${user.first_name} ${user.last_name}`
							.toLowerCase()
							.includes(searchValue.toLowerCase())
					)
					?.sort((a, b) =>
						b?.user_id === "all_users" ? 1 : a.first_name.localeCompare(b.first_name)
					)
					?.map(user => (
						<div
							key={user.user_id}
							onClick={() => handleUserSelect(user.user_id)}
							className={`${styles.user} ${
								checkUserSelect(user.user_id) ? styles.selected : ""
							}`}
						>
							<div className={styles.info}>
								{user.user_id === "all_users" ? (
									<div style={{ padding: "8px" }}>
										<Leads size={25} color={Colors.mainPurple} />
									</div>
								) : (
									<ProgressiveImg src={user.profile_picture} className={styles.img} />
								)}
								<div>
									<span className={user.last_name === "" ? styles.capitalize : ""}>
										{user?.user_id === "all_users"
											? `${
													STATISTICS_TRANSLATION.ALL_USERS[
														userData?.language.toUpperCase()
													]
											  }`
											: `${user.first_name} ${user.last_name}`}
									</span>
								</div>
							</div>
							<div className={styles.tick}>
								<Tick />
							</div>
						</div>
					))}
			</div>
		)
	) : subDepartmentsLoading ? (
		<Placeholder rows={6} />
	) : (
		<div className={styles.sdList}>
			{subDepartments
				?.filter(subd => subd.name.toLowerCase().includes(searchValue.toLowerCase()))
				?.sort((a, b) => a.name.localeCompare(b.name))
				?.map(subd => (
					<>
						<div
							key={subd.sd_id}
							onClick={
								// () => setAccordian(subd.sd_id)
								() => setAccordian(prev => (prev === subd.sd_id ? null : subd.sd_id))
							}
							className={accordian === subd.sd_id ? styles.selected : ""}
						>
							<div className={styles.info}>
								<ProgressiveImg
									src={
										subd.is_profile_picture_present
											? subd.profile_picture
											: "https://cdn.ringover.com/img/users/default.jpg"
									}
									className={styles.img}
								/>
								<div>
									<span>{subd.name}</span>
								</div>
							</div>
							<div className={styles.arrow}>
								<TriangleDown />
							</div>
						</div>
						{accordian === subd.sd_id && (
							<div className={styles.employeeDropdown}>
								{employeesLoading ? (
									<Placeholder rows={2} />
								) : employees.length > 0 ? (
									employees
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
													<ProgressiveImg
														src={user.profile_picture}
														className={styles.img}
													/>
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
										))
								) : (
									<span className={styles.noEmp}>
										{
											COMMON_TRANSLATION.NO_EMPLOYEES_PRESENT[
												userData?.language?.toUpperCase()
											]
										}
									</span>
								)}
							</div>
						)}
					</>
				))}
		</div>
	);
};

export default AllUsers;
