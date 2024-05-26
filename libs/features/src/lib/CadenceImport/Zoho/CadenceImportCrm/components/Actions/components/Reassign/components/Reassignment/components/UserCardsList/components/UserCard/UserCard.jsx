import styles from "./UserCard.module.scss";
import { ProgressiveImg, Title } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import { Input } from "@cadence-frontend/widgets";
import { TYPES } from "../../../../constants";
// import WholeNumberBox from "./components/WholeNumberBox/WholeNumberBox";

const UserCard = ({
	user,
	toggle,
	leadsCount,
	setLeadsCount,
	contactsCount,
	setContactsCount,
	onRemove,
	type,
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
				{(type === TYPES.LEAD || type === TYPES.LEAD_LIST) && (
					<Input
						type="number"
						name="leads"
						width="80px"
						value={leadsCount}
						setValue={setLeadsCount}
						disabled={toggle}
						showArrows
					/>
				)}
				{(type === TYPES.CONTACT || type === TYPES.CONTACT_LIST) && (
					<Input
						type="number"
						width="80px"
						name="contacts"
						value={contactsCount}
						setValue={setContactsCount}
						disabled={toggle}
						showArrows
					/>
				)}
				<Close className={styles.close} onClick={onRemove} />
			</div>
		</div>
	);
};

export default UserCard;
