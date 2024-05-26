import { useEffect, useRef } from "react";

//component
import { Close, PartyPopper, RoundedTick } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";

import styles from "./Success.module.scss";

const Success = ({ success, remove }) => {
	const timeoutId = useRef();

	useEffect(() => {
		timeoutId.current = setTimeout(() => {
			remove();
		}, 10000);
	});

	const handleClose = e => {
		e.preventDefault();
		clearTimeout(timeoutId.current);
		setTimeout(() => remove(), 100);
	};

	return (
		<div className={`${styles.errorBox} ${styles.isActive}`}>
			<span
				className={styles.closeIcon}
				onClick={e => {
					handleClose(e);
				}}
			>
				<Close />
			</span>
			<div className={styles.errorText}>
				{success.isDeleted ? (
					<RoundedTick color={Colors.white} />
				) : (
					<PartyPopper color={Colors.white} />
				)}
				{success.text}
			</div>
		</div>
	);
};

export default Success;
