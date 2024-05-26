import styles from "./UserCardsList.module.scss";
import UserCard from "./components/UserCard/UserCard";
import { TYPES } from "../../constants";
const UserCardsList = ({
	className,
	users,
	setUsers,
	toggle,
	leadProps,
	type,
	contactProps,
}) => {
	const { reassignedLeads, setReassignedLeads, leadsLeft, setLeadsLeft } = leadProps;
	const { reassignedContacts, setReassignedContacts, contactsLeft, setContactsLeft } =
		contactProps;

	const setLeadsCount = (userId, count) => {
		setReassignedLeads(prevState => {
			const prevValue = !isNaN(parseInt(prevState[userId]))
				? parseInt(prevState[userId])
				: 0;
			const currCount = !isNaN(parseInt(count)) ? parseInt(count) : 0;
			if (currCount - prevValue > leadsLeft) return prevState;
			setLeadsLeft(leadsLeft + prevValue - currCount);
			return { ...prevState, [userId]: currCount };
		});
	};

	const setContactsCount = (userId, count) => {
		setReassignedContacts(prevState => {
			const prevValue = !isNaN(parseInt(prevState[userId]))
				? parseInt(prevState[userId])
				: 0;
			const currCount = !isNaN(parseInt(count)) ? parseInt(count) : 0;
			if (currCount - prevValue > contactsLeft) return prevState;
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
						{type === TYPES.LEAD || type === TYPES.LEAD_LIST ? (
							<span>Lead</span>
						) : (
							<span>Contact</span>
						)}
					</div>

					<div className={styles.users}>
						{users.map(user => (
							<UserCard
								key={user.user_id}
								type={type}
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
				<p className={styles.noUserOrGrp}>No user selected</p>
			)}
		</div>
	);
};

export default UserCardsList;
