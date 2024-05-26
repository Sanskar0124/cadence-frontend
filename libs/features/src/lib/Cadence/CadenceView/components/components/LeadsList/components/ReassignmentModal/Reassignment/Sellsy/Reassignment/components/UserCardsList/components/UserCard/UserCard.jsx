import styles from "./UserCard.module.scss";
import { ProgressiveImg, Title } from "@cadence-frontend/components";
import { Close, MinusOutline } from "@cadence-frontend/icons";
import { Input } from "@cadence-frontend/widgets";

// import WholeNumberBox from "./components/WholeNumberBox/WholeNumberBox";

const UserCard = ({
	user,
	toggle,
	// leadsCount,
	// setLeadsCount,
	contactsCount,
	setContactsCount,
	onRemove,
}) => {
	return (
		<div className={styles.user}>
			<div className={styles.left}>
				<ProgressiveImg src={user?.profile_picture} className={styles.userImage} />

				<div className={styles.info}>
					<Title size={14}>
						{user?.first_name} {user?.last_name}
					</Title>
					<p className={styles.role}>{user?.Sub_Department?.name ?? ""}</p>
				</div>
			</div>

			<div className={styles.right}>
				{/* <Input
					type="number"
					name="leads"
					width="57px"
					value={leadsCount}
					setValue={setLeadsCount}
					disabled={toggle}
					showArrows
				/> */}
				<Input
					type="number"
					width="57px"
					name="contacts"
					value={contactsCount}
					setValue={setContactsCount}
					disabled={toggle}
					showArrows
				/>
				<MinusOutline className={styles.close} onClick={onRemove} />
			</div>
		</div>
	);
};

export default UserCard;
