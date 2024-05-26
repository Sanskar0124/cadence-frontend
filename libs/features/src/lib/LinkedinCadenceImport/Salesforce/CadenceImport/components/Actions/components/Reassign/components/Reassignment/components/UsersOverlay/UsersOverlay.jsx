import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

import styles from "./UsersOverlay.module.scss";
import { Div, ProgressiveImg, Tooltip } from "@cadence-frontend/components";
import { Close, Tick } from "@cadence-frontend/icons";
import { TooltipThemes } from "@cadence-frontend/themes";
const UsersOverlay = ({
	elementRef,
	users,
	employees,
	employeesLoading,
	setUsers,
	searchFocus,
	searchValue,
	setSearchFocus,
	setReassignedLeads,
	setReassignedContacts,
}) => {
	const [selects, setSelects] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);

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
		if (searchFocus) setShowOverlay(true);
	}, [searchFocus]);

	const onAnimationEnd = () => {
		if (!searchFocus) setShowOverlay(false);
	};

	return (
		<div ref={elementRef} className={styles.wrapper}>
			{showOverlay && (
				<div
					className={`${styles.container} ${searchFocus ? styles.open : styles.close}`}
					onAnimationEnd={onAnimationEnd}
				>
					<Tooltip
						className={styles.closeBtn}
						theme={TooltipThemes.BOTTOM}
						onClick={e => {
							window.onmousedown = null;
							setSearchFocus(false);
						}}
					>
						<Close color="#094360" />
					</Tooltip>
					{selects.length > 0 && (
						<p className={styles.clear} onClick={() => setSelects([])}>
							Clear all
						</p>
					)}

					{
						<div className={styles.employeeList}>
							{employeesLoading ? (
								<Placeholder />
							) : (
								employees
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
												<Tick />
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
