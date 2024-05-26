import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./Reassign.module.scss";
import React, { useEffect, useState } from "react";
import { Cadences, ReAssign, Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Div, Modal } from "@cadence-frontend/components";
import Reassignment from "./components/Reassignment/Reassignment";
const Reassign = props => {
	const [reassignModal, setReassignModal] = useState(false);

	const handleClose = () => {
		// setSearchFocus(false);
		window.onmousedown = null;
		setReassignModal(false);
	};
	return (
		<div className={styles.reassign}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.reassignBtn}
				onClick={() => setReassignModal(true)}
			>
				<span>
					<ReAssign size="25px" />
				</span>
				<p>
					Reassign <span className={styles.optional}>(optional)</span>
				</p>
			</ThemedButton>
		</div>
	);
};

export default Reassign;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(4).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
