import { useEffect, useState } from "react";
import styles from "./UserCardsList.module.scss";
import UserCard from "./components/UserCard/UserCard";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const UserCardsList = ({
	className,
	users,
	setUsers,
	toggle,
	leadProps,
	contactProps,
}) => {
	const { reassignedLeads, setReassignedLeads, leadsLeft, setLeadsLeft } = leadProps;
	const { reassignedContacts, setReassignedContacts, contactsLeft, setContactsLeft } =
		contactProps;
	const user = useRecoilValue(userInfo);

	const setLeadsCount = (userId, count) => {
		setReassignedLeads(prevState => {
			const prevValue = !isNaN(parseInt(prevState[userId]))
				? parseInt(prevState[userId])
				: 0;
			const currCount = !isNaN(parseInt(count)) ? parseInt(count) : 0;
			if (count - prevState[userId] > leadsLeft) return prevState;
			setLeadsLeft(leadsLeft + prevValue - currCount);
			return { ...prevState, [userId]: count };
		});
	};

	const setContactsCount = (userId, count) => {
		setReassignedContacts(prevState => {
			const prevValue = !isNaN(parseInt(prevState[userId]))
				? parseInt(prevState[userId])
				: 0;
			const currCount = !isNaN(parseInt(count)) ? parseInt(count) : 0;
			if (count - prevState[userId] > contactsLeft) return prevState;
			setContactsLeft(contactsLeft + prevValue - currCount);
			return { ...prevState, [userId]: count };
		});
	};

	const onRemove = userId => {
		setReassignedLeads(prevState => {
			setLeadsLeft(leadsLeft + prevState[userId]);
			const newState = { ...prevState };
			delete newState[userId];
			return newState;
		});
		setReassignedContacts(prevState => {
			setContactsLeft(contactsLeft + prevState[userId]);
			const newState = { ...prevState };
			delete newState[userId];
			return newState;
		});
		setUsers(prevState => prevState.filter(user => user.user_id !== userId));
	};

	return (
		<div className={`${styles.listContainer} ${className ?? ""}`}>
			{users.length > 0 ? (
				<>
					<div className={styles.header}>
						<span>Lead</span>
						<span>Contact</span>
					</div>

					<div className={styles.users}>
						{users.map(user => (
							<UserCard
								key={user.user_id}
								user={user}
								toggle={toggle}
								leadsCount={reassignedLeads[user.user_id]}
								setLeadsCount={count => setLeadsCount(user.user_id, count)}
								contactsCount={reassignedContacts[user.user_id]}
								setContactsCount={count => setContactsCount(user.user_id, count)}
								onRemove={() => onRemove(user.user_id)}
							/>
						))}
					</div>
				</>
			) : (
				<p className={styles.noUserOrGrp}>
					{COMMON_TRANSLATION.NO_USER_SELECTED[user?.language?.toUpperCase()]}
				</p>
			)}
		</div>
	);
};

export default UserCardsList;
