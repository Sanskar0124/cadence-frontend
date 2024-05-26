import { userInfo } from "@cadence-frontend/atoms";
import { ChevronLeft, ChevronRight } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useRecoilValue } from "recoil";
import { ACTIVE_TAG_ENUM } from "../../constants";
import styles from "./TaskCompletion.module.scss";
import { TASK_ENUMS, TASK_TAG_ENUMS } from "./constants";
import { useHomePage } from "@cadence-frontend/data-access";
import { useEffect, useRef, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "@cadence-frontend/constants";
import { useNavigate } from "react-router-dom";
import { DEFAULT_FILTER_OPTIONS } from "@cadence-frontend/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/components/pagination/pagination.min.css";
import {
	Tasks as TASKS_TRANSLATION,
	Home as HOME_TRANSLATION,
} from "@cadence-frontend/languages";
import "./TaskCompletion.scss";

SwiperCore.use([Pagination, Navigation]);

const TaskCompletion = ({ activeTag }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const firstTaskRef = useRef();
	const lastTaskRef = useRef();
	const prevRef = useRef(null);
	const nextRef = useRef(null);

	const { progress } = useHomePage({ progress: true }, { taskTag: activeTag });

	const getNumber = value => value || 0;

	const getProgress = () => {
		let completed = 0;
		let total = 0;
		let percentage = 0;
		Object.values(progress ?? {})?.forEach(task => {
			total += task.completed + task.pending;
			completed += task.completed;
		});
		percentage = Math.floor((completed / total) * 100) || 0;
		return { completed, total, percentage };
	};

	const getProgressByTask = task => {
		let completed = 0;
		let total = 0;
		let percentage = 0;
		completed = getNumber(progress?.[task.type]?.completed);
		total =
			getNumber(progress?.[task.type]?.completed) +
			getNumber(progress?.[task.type]?.pending);
		percentage = Math.floor((completed / total) * 100) || 0;
		return { completed, total, percentage };
	};

	const redirectWithTaskFilter = task_action => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.TASK_FILTERS,
			JSON.stringify({
				filters: {
					...DEFAULT_FILTER_OPTIONS,
					task_action,
					...(activeTag !== ACTIVE_TAG_ENUM.all && {
						task_tag: [TASK_TAG_ENUMS[activeTag]],
					}),
				},
			})
		);
		navigate("/tasks");
	};

	return (
		<>
			<div className={`${styles.container} ${styles[ACTIVE_TAG_ENUM[activeTag]]}`}>
				<div className={styles.header}>
					<h2>{HOME_TRANSLATION.TASK_COMPLETION[user?.language.toUpperCase()]}</h2>
					<div className={styles.info}>
						<span>{getProgress().completed}</span>
						<span> / {getProgress().total}</span>
					</div>
				</div>
				<div className={styles.progressParent}>
					<div
						className={`${styles.progress} ${
							getProgress().percentage < 10 ? styles.isLeft : ""
						}`}
						data-percentage={getProgress().percentage}
					>
						<div
							className={styles.completed}
							style={{ width: `${getProgress().percentage || 1}%` }}
						/>
					</div>
				</div>
			</div>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2>{TASKS_TRANSLATION.TASK_TYPE[user?.language.toUpperCase()]}</h2>
					<div className={styles.pagination}>
						<ThemedButton
							width="fit-content"
							height="35px"
							theme={ThemedButtonThemes.GREY}
							ref={prevRef}
						>
							<ChevronLeft />
						</ThemedButton>
						<ThemedButton
							width="fit-content"
							height="35px"
							theme={ThemedButtonThemes.GREY}
							ref={nextRef}
						>
							<ChevronRight />
						</ThemedButton>
					</div>
				</div>
				<div className={styles.tasks}>
					<Swiper
						className="task-type-swiper"
						slidesPerView={1}
						spaceBetween={40}
						pagination={{ clickable: true }}
						navigation={{
							prevEl: prevRef.current ? prevRef.current : undefined,
							nextEl: nextRef.current ? nextRef.current : undefined,
						}}
						onInit={swiper => {
							swiper.params.navigation.prevEl = prevRef.current;
							swiper.params.navigation.nextEl = nextRef.current;
							swiper.navigation.update();
						}}
						breakpoints={
							// window.innerHeight <= 800
							// ? {
							// 		640: {
							// 			slidesPerView: 1,
							// 		},
							// 		960: {
							// 			slidesPerView: 2,
							// 		},
							// 		1370: {
							// 			slidesPerView: 3,
							// 		},
							//   }
							// :
							{
								640: {
									slidesPerView: 2,
									slidesPerGroup: 2,
								},
								980: {
									slidesPerView: 3,
									slidesPerGroup: 2,
								},
								1200: {
									slidesPerView: 4,
									slidesPerGroup: 2,
								},
								1430: {
									slidesPerView: 5,
									slidesPerGroup: 2,
								},
							}
						}
					>
						{TASK_ENUMS(user).map((task, index) => (
							<SwiperSlide key={task.type} virtualIndex={index}>
								<div
									className={`${styles.task} ${styles[task.type]}`}
									ref={index === 0 ? firstTaskRef : index === 6 ? lastTaskRef : null}
									onClick={() => redirectWithTaskFilter(task.filter_type)}
								>
									<div className={styles.progress}>
										<div
											className={styles.progressFill}
											style={{
												height: `${
													(getNumber(progress?.[task.type]?.completed) /
														(getNumber(progress?.[task.type]?.completed) +
															getNumber(progress?.[task.type]?.pending))) *
														100 || 5
												}%`,
											}}
										></div>
										<div className={styles.icon}>{task.icon}</div>
									</div>
									<div className={styles.info}>
										<span className={styles.name}>{task.name}</span>
										<div className={styles.completed}>
											<span>{getProgressByTask(task).completed}</span> /{" "}
											{getProgressByTask(task).total}
										</div>
										<div className={styles.percent}>
											{getProgressByTask(task).percentage}%
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</>
	);
};
export default TaskCompletion;
