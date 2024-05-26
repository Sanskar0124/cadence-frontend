import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Modal } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuccessModal.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import {
	Tasks as TASKS_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

// Import Swiper styles
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
// import "swiper/modules/effect-coverflow/effect-coverflow.min.css";

// import required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";

//components

//constants
SwiperCore.use([Pagination, Autoplay, Navigation]);

const SuccessModal = ({ modal, setModal }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);

	const onClose = () => {
		setModal(false);
	};
	return (
		<Modal
			className={styles.successModalContainer}
			disableOutsideClick={true}
			showCloseButton={true}
			isModal={modal ? true : false}
			onClose={onClose}
		>
			<div className={styles.swiperContainer}>
				<Swiper
					spaceBetween={30}
					pagination={{
						// el: ".swiper-pagination",
						clickable: true,
					}}
					autoplay={{ delay: 3000 }}
					// navigation={true}
					className="mySwiper"
				>
					<SwiperSlide className={`${styles.slide} ${styles.slide1}`}>
						<div className={styles.imageContainer}>
							<img
								src={
									"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/onboarding_1.svg"
								}
								alt=""
							/>
						</div>
						<div className={styles.title}>
							{COMMON_TRANSLATION.CONGRATULATIONS[user?.language?.toUpperCase()]}
						</div>
						<div className={styles.subtitle}>
							You have successfully completed the Cadence set-up for your company
						</div>
					</SwiperSlide>
					<SwiperSlide className={styles.slide + " " + styles.slide2}>
						<div className={styles.imageContainer}>
							<img
								src={
									"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/onboarding_2.svg"
								}
								alt=""
							/>
						</div>
						<div className={styles.subtitle}>
							You can make changes to your configurations from the Settings and Profile
							settings page at any time once you enter the tool.
						</div>
					</SwiperSlide>
					<SwiperSlide className={styles.slide}>
						<div className={styles.imageContainer}>
							<img
								src={
									"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/onboarding_3.svg"
								}
								alt=""
							/>
						</div>
						<div className={styles.subtitle}>
							To re-launch the set-up process or make changes to your matches CRM fields
							head over to the Market Place.
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
			<ThemedButton
				className={styles.redirectButton}
				theme={ThemedButtonThemes.PRIMARY}
				onClick={() => {
					navigate("/tasks");
				}}
			>
				<div>{TASKS_TRANSLATION.HEAD_TO_TASKS_PAGE[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
		</Modal>
	);
};

export default SuccessModal;
