import styles from "./UserCardsList.module.scss";
import UserCard from "./components/UserCard/UserCard";
const UserCardsList = ({ className, users, setUsers, toggle, contactProps }) => {
	const { reassignedContacts, setReassignedContacts, contactsLeft, setContactsLeft } =
		contactProps;

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
						<span>Contact</span>
					</div>

					<div className={styles.users}>
						{users.map(user => (
							<UserCard
								key={user.user_id}
								user={user}
								toggle={toggle}
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
