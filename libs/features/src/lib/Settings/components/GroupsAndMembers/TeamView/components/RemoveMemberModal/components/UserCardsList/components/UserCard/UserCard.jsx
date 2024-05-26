import styles from "./UserCard.module.scss";
import { Image, Title } from "@cadence-frontend/components";
import { Close, TriangleArrow } from "@cadence-frontend/icons";
// import WholeNumberBox from "./components/WholeNumberBox/WholeNumberBox";

import { ALL_ROLES } from "../../../../../constants";
import { Input } from "@cadence-frontend/widgets";

const UserCard = ({
	user,
	toggle,
	leadsCount,
	setLeadsCount,
	contactsCount,
	setContactsCount,
	onRemove,
}) => {
	return (
		<div className={styles.user}>
			<div className={styles.left}>
				<Image src={user?.profile_picture} className={styles.userImage} />

				<div className={styles.info}>
					<Title size={14}>
						{user?.first_name} {user?.last_name}
					</Title>
					<p className={styles.role}>{ALL_ROLES[user?.role] ?? user?.role}</p>
				</div>
			</div>

			<div className={styles.right}>
				<div>
					<Input
						type="number"
						name="leads"
						width="57px"
						className={styles.input}
						value={leadsCount}
						setValue={setLeadsCount}
						showArrows={!toggle}
					/>
				</div>
				<div>
					<Input
						type="number"
						name="contacts"
						width="57px"
						className={styles.input}
						value={contactsCount}
						setValue={setContactsCount}
						showArrows={!toggle}
					/>
				</div>
				<Close className={styles.close} onClick={onRemove} />
			</div>
		</div>
	);
};

export default UserCard;
