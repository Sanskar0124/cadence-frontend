import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useEmployees } from "@cadence-frontend/data-access";

import styles from "./UsersOverlay.module.scss";
import { Div, ProgressiveImg, Tooltip } from "@cadence-frontend/components";
import { Close, Tick } from "@cadence-frontend/icons";
import { TooltipThemes } from "@cadence-frontend/themes";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";

const UsersOverlay = ({
	ownerIds,
	users,
	setUsers,
	searchFocus,
	searchValue,
	setSearchFocus,
	setReassignedLeads,
	setReassignedContacts,
	showUsersDropdown,
	setShowUsersDropdown,
}) => {
	const role = useRecoilValue(userInfo).role;
	const { employees, employeesLoading } = useEmployees(
		// Boolean(modal),
		true,
		role
	);

	const [selects, setSelects] = useState([]);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (!searchFocus && selects.length > 0) {
			setUsers(prevState => [
				...prevState,
				...employees.filter(employee => selects.includes(employee.user_id)),
			]);

			setReassignedLeads(prevState => {
				selects.forEach(selectedId => {
					prevState = {
						...prevState,
						[selectedId]: 0,
					};
				});
				return prevState;
			});
			setReassignedContacts(prevState => {
				selects.forEach(selectedId => {
					prevState = {
						...prevState,
						[selectedId]: 0,
					};
				});
				return prevState;
			});
			setSelects([]);
		}
	}, [searchFocus]);

	useEffect(() => {
		if (searchFocus) setShowUsersDropdown(true);
	}, [searchFocus]);

	const onAnimationEnd = () => {
		if (!searchFocus) setShowUsersDropdown(false);
	};

	return (
		<div className={styles.wrapper}>
			{showUsersDropdown && (
				<div
					className={`${styles.container} ${searchFocus ? styles.open : styles.close}`}
					onAnimationEnd={onAnimationEnd}
				>
					{
						<div className={styles.employeeList}>
							{employeesLoading ? (
								<Placeholder />
							) : (
								employees
									?.filter(employee => !ownerIds.includes(employee?.user_id))
									?.filter(
										employee =>
											users.find(user => user?.user_id === employee?.user_id) ===
											undefined
									)
									?.filter(
										employee =>
											searchValue === "" ||
											`${employee?.first_name} ${employee?.last_name}`
												.toLowerCase()
												.includes(searchValue.toLowerCase())
									)
									?.sort((a, b) => a.first_name.localeCompare(b.first_name))
									?.map(employee => (
										<div
											key={employee.user_id}
											className={`${
												selects.includes(employee?.user_id) ? styles.selected : ""
											}`}
											onClick={() =>
												setSelects(prevState =>
													prevState.includes(employee.user_id)
														? prevState.filter(empId => empId !== employee?.user_id)
														: [...prevState, employee?.user_id]
												)
											}
										>
											<div className={styles.info}>
												<ProgressiveImg
													src={employee?.profile_picture}
													className={styles.userImg}
												/>
												<div>
													<span>
														{employee?.first_name} {employee?.last_name}
													</span>
													<span>{employee?.Sub_Department?.name ?? ""}</span>
												</div>
											</div>
											<div className={styles.tick}>
												<Tick size={13} />
											</div>
										</div>
									))
							)}
						</div>
					}
				</div>
			)}
		</div>
	);
};

export default UsersOverlay;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(5).keys()].map(key => (
				<Div key={key} loading />
			))}
		</div>
	);
};
