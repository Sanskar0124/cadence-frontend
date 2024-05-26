import { useState, useEffect } from "react";
import { useSubDepartment } from "@cadence-frontend/data-access";

import styles from "./UsersOverlay.module.scss";
import { Div, Image, Tooltip } from "@cadence-frontend/components";
import { Close, Tick } from "@cadence-frontend/icons";
import { TooltipThemes } from "@cadence-frontend/themes";
import { ALL_ROLES } from "../../../constants";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

const UsersOverlay = ({
	elementRef,
	teamId,
	users,
	setUsers,
	searchFocus,
	searchValue,
	setSearchFocus,
	setReassignedLeads,
	setReassignedContacts,
	memberId,
}) => {
	const { users: members, usersLoading: membersLoading } = useSubDepartment(teamId);

	const [selects, setSelects] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);
	const user = useRecoilValue(userInfo);

	useEffect(() => {
		if (!searchFocus && selects.length > 0) {
			setUsers(prevState => [
				...prevState,
				...members.filter(employee => selects.includes(employee.user_id)),
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
							{COMMON_TRANSLATION.CLEAR_ALL[user?.language?.toUpperCase()]}
						</p>
					)}

					{
						<div className={styles.employeeList}>
							{membersLoading ? (
								<Placeholder />
							) : (
								members
									?.filter(
										member =>
											member?.user_id !== memberId &&
											users.find(user => user?.user_id === member?.user_id) === undefined
									)
									?.filter(
										member =>
											searchValue === "" ||
											`${member?.first_name} ${member?.last_name}`
												.toLowerCase()
												.includes(searchValue.toLowerCase())
									)
									?.sort((a, b) => a.first_name.localeCompare(b.first_name))
									?.map(member => (
										<div
											key={member.user_id}
											className={`${
												selects.includes(member?.user_id) ? styles.selected : ""
											}`}
											onClick={() =>
												setSelects(prevState =>
													prevState.includes(member.user_id)
														? prevState.filter(empId => empId !== member?.user_id)
														: [...prevState, member?.user_id]
												)
											}
										>
											<div className={styles.info}>
												<Image src={member?.profile_picture} />
												<div>
													<span>
														{member?.first_name} {member?.last_name}
													</span>
													<span>{ALL_ROLES[member?.role] ?? member?.role}</span>
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
			{[...Array(6).keys()].map(key => (
				<Div key={key} loading />
			))}
		</div>
	);
};
