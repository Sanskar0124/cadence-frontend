import { userInfo } from "@cadence-frontend/atoms";
import { useHomePage } from "@cadence-frontend/data-access";
import { NoCadence, PlusOutline } from "@cadence-frontend/icons";
import {
	Cadence as CADENCE_TRANSLATION,
	Home as HOME_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Select, ThemedButton } from "@cadence-frontend/widgets";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./ActiveCadences.module.scss";
import CadenceCard from "./components/CadenceCard/CadenceCard";
import Placeholder from "./components/Placeholder/Placeholder";
import { CADENCE_TYPES_OPTIONS } from "./constants";
import { useNavigate } from "react-router-dom";
import { ACTIVE_TAG_ENUM } from "../../constants";

const ActiveCadences = ({ activeTag }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const [cadenceType, setCadenceType] = useState("all_cadences");

	const { cadencesData: cadences, cadenceLoading } = useHomePage(
		{ cadencesData: true },
		{ cadenceType, taskTag: activeTag }
	);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>
					{`${HOME_TRANSLATION.MY_ACTIVE_CADENCES[user?.language.toUpperCase()]}
					 (${cadences?.length || 0})`}
				</h2>
				<div className={styles.typeSelect}>
					<Select
						options={CADENCE_TYPES_OPTIONS.map(op => ({
							label: op.label[user?.language?.toUpperCase()],
							value: op.value,
						}))}
						value={cadenceType}
						setValue={setCadenceType}
						width="200px"
						placeholder="Cadence Type"
						menuOnTop={window.innerHeight < 800}
					/>
				</div>
			</div>
			<div className={styles.cadences}>
				{cadenceLoading ? (
					<Placeholder rows={10} />
				) : cadences?.length > 0 ? (
					cadences?.map(cadence => (
						<CadenceCard cadence={cadence} activeTag={activeTag} />
					))
				) : (
					<div className={styles.fallback}>
						<NoCadence size="10rem" />{" "}
						{activeTag === ACTIVE_TAG_ENUM.all ? (
							<>
								<span>
									{HOME_TRANSLATION.NO_CADENCE_CREATED[user?.language.toUpperCase()]}
								</span>
								<ThemedButton
									theme={ThemedButtonThemes.GREY}
									width="fit-content"
									onClick={() => navigate("/cadence?create=true")}
								>
									<PlusOutline />
									<div>
										{
											CADENCE_TRANSLATION.CREATE_NEW_CADENCE[
												user?.language?.toUpperCase()
											]
										}
									</div>
								</ThemedButton>
							</>
						) : (
							<span>
								{activeTag === ACTIVE_TAG_ENUM.late
									? HOME_TRANSLATION.NO_LATE_TASKS[user?.language.toUpperCase()]
									: HOME_TRANSLATION.NO_URGENT_TASKS[user?.language.toUpperCase()]}
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default ActiveCadences;
