import styles from "./BoxInvite.module.scss";
import { Close } from "@cadence-frontend/icons";

const BoxInvite = ({ invitees, setInvitees }) => {
	return (
		<div className={styles.boxInvite}>
			<div className={styles.invites}>
				{invitees &&
					invitees.map(invitee => (
						<span key={invitee?.user_id} className={styles.invite}>
							<p>{`${invitee?.first_name} ${invitee?.last_name}`}</p>
							<Close
								className={styles.close}
								onClick={() => {
									setInvitees(prevState =>
										prevState.filter(m => m?.user_id !== invitee?.user_id)
									);
								}}
							/>
						</span>
					))}
			</div>
		</div>
	);
};

export default BoxInvite;
