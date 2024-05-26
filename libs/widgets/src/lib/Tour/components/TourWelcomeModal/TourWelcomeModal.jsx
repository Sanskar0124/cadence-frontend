// components
import { Modal } from "@cadence-frontend/components";

import styles from "./TourWelcomeModal.module.scss";
import ThemedButton from "../../../ThemedButton/ThemedButton";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { tourInfo, userInfo } from "@cadence-frontend/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useUser } from "@cadence-frontend/data-access";
import { Tour as TOUR_TRANSLATION } from "@cadence-frontend/languages";
import { useContext } from "react";
import { MessageContext } from "@cadence-frontend/contexts";

const TourWelcomeModal = ({ modal, onClose }) => {
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [tour, setTour] = useRecoilState(tourInfo);
	const { updateUser, updateLoading } = useUser();

	const onStartDemo = () => {
		let NEW_STEP = tour?.steps_order[tour?.steps_order.indexOf(tour?.currentStep) + 1];
		updateUser(
			{
				product_tour_step: {
					step: NEW_STEP,
					url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
				},
			},
			{
				onSuccess: () =>
					setTour(prev => ({
						...prev,
						currentStep: NEW_STEP,
						currentUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
					})),
				onError: err =>
					addError({
						text: err.response?.data?.msg || "Error while starting product tour",
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					}),
			}
		);
	};

	return (
		<Modal isModal={modal} onClose={onClose} disableOutsideClick>
			<div className={styles.modal}>
				<img
					src={
						"https://storage.googleapis.com/apt-cubist-307713.appspot.com/cadence/welcome_to_cadence.png"
					}
					alt="Cadence Overview"
				/>
				<h3>
					{TOUR_TRANSLATION.WELCOME_TO_CADENCE[user?.language?.toUpperCase()]}{" "}
					<img
						src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/party_popper.svg"
						alt="Party popper"
					/>
				</h3>
				<p>
					{TOUR_TRANSLATION.WELCOME_TO_CADENCE_DESC[user?.language?.toUpperCase()]}
					<br />
					<br />{" "}
					{TOUR_TRANSLATION.WELCOME_TO_CADENCE_DESC_2[user?.language?.toUpperCase()]}
				</p>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={onStartDemo}
					loading={updateLoading}
				>
					{TOUR_TRANSLATION.START_PRODUCT_DEMO[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</Modal>
	);
};

export default TourWelcomeModal;
