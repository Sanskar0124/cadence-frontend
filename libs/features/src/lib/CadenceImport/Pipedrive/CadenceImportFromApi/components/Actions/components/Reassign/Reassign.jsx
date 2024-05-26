import { TabNavThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { TabNavSlider, ThemedButton } from "@cadence-frontend/widgets";
import styles from "./Reassign.module.scss";
import React, { useEffect, useState } from "react";
import { Cadences, ReAssign, Tick, TriangleDown } from "@cadence-frontend/icons";
import { useCadence } from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Div, Modal } from "@cadence-frontend/components";

const Reassign = ({ cadenceSelected, setCadenceSelected }) => {
	const [reassignModal, setReassignModal] = useState(false);

	return (
		<div className={styles.reassign}>
			<ThemedButton
				theme={ThemedButtonThemes.WHITE}
				className={styles.reassignBtn}
				onClick={() => setReassignModal(true)}
			>
				<span>
					<ReAssign /> Reassign {"(optional)"}
				</span>
			</ThemedButton>
			<Modal
				isModal={reassignModal}
				onClose={() => setReassignModal(false)}
				className={styles.reassignModal}
			>
				content
			</Modal>
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
