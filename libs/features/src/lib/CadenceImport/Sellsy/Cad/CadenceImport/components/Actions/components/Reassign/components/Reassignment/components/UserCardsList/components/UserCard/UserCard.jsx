import styles from "./UserCard.module.scss";
import { ProgressiveImg, Title } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import { Input } from "@cadence-frontend/widgets";

const UserCard = ({ user, toggle, contactsCount, setContactsCount, onRemove }) => {
	return (
		<div className={styles.user}>
			<div className={styles.left}>
				<ProgressiveImg
					src={
						user?.is_profile_picture_present
							? user?.profile_picture
							: "https://cdn.ringover.com/img/users/default.jpg"
					}
					className={styles.userImage}
				/>

				<div className={styles.info}>
					<Title size={14}>
						{user?.first_name} {user?.last_name}
					</Title>
					<p className={styles.role}>{user?.Sub_Department?.name ?? ""}</p>
				</div>
			</div>

			<div className={styles.right}>
				<Input
					type="number"
					width="80px"
					name="contacts"
					value={contactsCount}
					setValue={setContactsCount}
					disabled={toggle}
					showArrows
				/>
				<Close className={styles.close} onClick={onRemove} />
			</div>
		</div>
	);
};

export default UserCard;
