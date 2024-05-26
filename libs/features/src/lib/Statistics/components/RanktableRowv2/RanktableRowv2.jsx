import styles from "./Ranktablerowv2.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useSkippedChartModalData } from "@cadence-frontend/data-access";
import { useEffect, useState, useRef } from "react";
import SkippedchartModal from "../Modals/SkippedcardModal/SkippedchartModal";
import { filter } from "domutils";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Link } from "react-router-dom";
import { captureProfileImage } from "../../utils";
import { ProfilePicture } from "@cadence-frontend/components";

const RanktableRowv2 = ({
	data,
	headerData,
	resData,
	modalData,
	setModalData,
	filter,
	rowindex,
	isPdf,
	activeBtn,
	singleUser,
	selectedCadences,
}) => {
	const currentUser = useRecoilValue(userInfo);
	const role = currentUser.role;
	const [error, setError] = useState("");
	const [cadenceId, setCadenceId] = useState(data?.cadence_id);
	const [isCadenceShow, setIsCadenceShow] = useState(false);
	const modalRef = useRef(null);

	const cadenceRef = useRef(null);

	const downloadImage = async imageUrl => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = imageUrl;
		await new Promise(resolve => {
			img.onload = resolve;
		});
		return img;
	};

	const convertIntodays = n => {
		if (n < 60) {
			if (n === 0) return n;
			else if (n == 1) return `${n} minute`;
			else return `${n} minutes`;
		} else {
			let value = Math.floor(n / 60);

			if (value > 24) {
				let days = Math.floor(value / 24);
				if (days === 0) return days;
				else if (days === 1) return `${days} day`;
				else return `${days} days`;
			} else {
				if (value === 0) return value;
				else if (value === 1) return `${value} hour`;
				return `${value} hours`;
			}
		}
	};
	useOutsideClickHandler(modalRef, () =>
		setModalData(prev => ({
			...prev,
			isShow: false,
			data: [],
			indexofRow: "",
			cadenceId: "",
			userId: "",
		}))
	);

	useEffect(() => {
		cadenceRef.current.addEventListener("click", e => {
			setModalData(prev => ({
				...prev,
				localCoords: { x: e.clientX, y: e.clientY },
			}));
		});
	}, []);

	const handleClick = (e, cadence_id, rowindex, user_id) => {
		if (modalData.indexofRow) {
			setModalData(prev => ({
				...prev,
				isShow: false,
				data: [],
				indexofRow: "",
				cadenceId: "",
				userId: "",
			}));
		} else {
			if (cadence_id && user_id) {
				setModalData(prev => ({
					...prev,
					isShow: true,
					cadenceId: cadence_id,
					userId: user_id,
					indexofRow: rowindex,
				}));
			} else {
				setModalData(prev => ({
					...prev,
					isShow: true,
					userId: user_id,
					cadenceId: cadence_id,
					indexofRow: rowindex,
				}));
			}
		}
	};

	return (
		<div
			className={`${styles.row}`}
			ref={cadenceRef}
			style={{ position: modalData.indexofRow === rowindex ? "relative" : "" }}
			key={activeBtn === "cadence" ? data.name : data?.first_name}
		>
			{activeBtn === "cadence" ? (
				<>
					<div
						className={`${styles?.row_cadence}`}
						key={data?.name}
						// onClick={
						// 	data?.tasks["skippedTasks"] !== 0
						// 		? e => handleClick(e, data.cadence_id, rowindex)
						// 		: null
						// }
					>
						<div
							className={`${styles.row_cadence_name}  ${
								data.name && styles.background_dark
							}`}
							title={data.name}
						>
							<Link
								to={`/cadence/${data.cadence_id}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className={styles.cadence_name}>{data.name}</div>
							</Link>
							<div className={styles.cadence_users}>
								<span>
									{data.no_of_users}
									{data.no_of_users > 1 ? " users" : " user"}
								</span>
								&nbsp;
								<span>
									{" "}
									&bull;&nbsp;{data.no_of_steps}{" "}
									{data.no_of_steps > 1 ? " steps" : "step"}
								</span>
							</div>
						</div>

						{headerData?.map((task, index) => (
							<div
								className={`${styles.work_item} ${
									task.label === "disqualified" && styles.row_disqualified_data
								} ${task.label === "converted" && styles.row_converted_data} ${
									styles[`work_${index}`]
								}`}
								key={task.label}
							>
								<div className={styles.work_data}>
									<div
										style={{
											cursor:
												task.label === "skippedTasks" && data?.tasks["skippedTasks"] !== 0
													? "pointer"
													: "",
										}}
										className={styles.work_data_value}
										onClick={
											data?.tasks["skippedTasks"] &&
											task.label === "skippedTasks" &&
											data?.tasks["skippedTasks"] !== 0
												? e => handleClick(e, data.cadence_id, rowindex)
												: null
										}
									>
										{Object.keys(data?.tasks).map((key, ind) =>
											key == "averageTime" && task.label === "averageTime"
												? convertIntodays(data?.tasks[key])
												: key === task.label
												? data?.tasks[key]
												: null
										)}
									</div>
								</div>
							</div>
						))}
					</div>
					<div
						className={styles.row_users}
						// ref={userRowRef}
					>
						{data?.users?.length > 0 ? (
							data?.users
								.filter(user => !!user.user_id)
								?.map((user, index) => {
									return (
										<div
											className={styles.row_user}
											key={user?.first_name}
											// onClick={e => setModalData(prev => ({ ...prev, indexofRow: rowindex }))}
										>
											<div className={styles.row_user_spacer}></div>
											<div className={styles.row_user_info}>
												<div className={styles.info_image_and_text}>
													<div className={styles.info_image} id="profile-image">
														{isPdf ? (
															<img
																src="https://cdn.ringover.com/img/users/default.jpg"
																alt="profile_picture"
																id="user-profile"
															/>
														) : (
															<ProfilePicture
																profile_image={user?.profile_picture}
																showDefault={!user?.profile_picture && true}
															/>
														)}
													</div>
													<div className={styles.info_text}>
														<p className={styles.info_text_name}>
															{user?.first_name} {user?.last_name}
														</p>
														<p className={styles.info_text_position}>
															{user?.sub_department}
														</p>
													</div>
												</div>
											</div>

											{headerData?.map((task, index) => (
												<div
													className={`${styles.work_item} ${
														task.label === "disqualified" && styles.row_disqualified_data
													} ${task.label === "converted" && styles.row_converted_data} ${
														styles[`work_${index}`]
													}`}
													key={task?.label}
													// onClick={
													// 	user?.tasks["skippedTasks"].value !== 0
													// 		? e => handleClick(e, data.cadence_id, rowindex, user.user_id)
													// 		: null
													// }
												>
													<div className={styles.work_data}>
														<div
															style={{
																cursor:
																	task.label === "skippedTasks" &&
																	user?.tasks["skippedTasks"].value !== 0
																		? "pointer"
																		: "",
															}}
															className={styles.work_data_value}
															onClick={
																user?.tasks["skippedTasks"] &&
																task.label === "skippedTasks" &&
																user?.tasks["skippedTasks"].value !== 0
																	? e =>
																			handleClick(
																				e,
																				data.cadence_id,
																				rowindex,
																				user.user_id
																			)
																	: null
															}
														>
															{Object.keys(user?.tasks).map((key, ind) =>
																// key===task.label ? user?.tasks[key]?.value : null
																key == "averageTime" && task.label === "averageTime"
																	? convertIntodays(user?.tasks[key]?.value)
																	: key === task.label
																	? user?.tasks[key]?.value
																	: null
															)}
														</div>

														{task.label !== "averageTime" &&
															Object.keys(user?.tasks).map((key, ind) =>
																key === task.label
																	? !isNaN(user?.tasks[key]?.percentage) &&
																	  user?.tasks[key]?.percentage !== 0 && (
																			<div
																				className={`${styles.row_cadence_background} 
															${task.label === "disqualified" && styles.row_cadence_orange_bg}
															${task.label === "converted" && styles.row_cadence_green_bg}`}
																			>
																				{Object.keys(user?.tasks).map((key, ind) =>
																					key === task.label
																						? !isNaN(user?.tasks[key]?.percentage) &&
																						  user?.tasks[key]?.percentage !== 0 &&
																						  user?.tasks[key]?.percentage !== Infinity &&
																						  `${user?.tasks[key]?.percentage}`
																						: null
																				)}
																				%
																			</div>
																	  )
																	: null
															)}
													</div>
												</div>
											))}
										</div>
									);
								})
						) : (
							<>
								<div className={styles.row_user}>
									<div className={styles.row_user_info}>
										<p className={styles.row_user_info_empty}>
											No agents with stats present
										</p>
									</div>

									{headerData?.map((task, index) => (
										<div
											className={`${styles.work_item} ${
												task.label === "disqualified" && styles.row_disqualified_data
											} ${task.label === "converted" && styles.row_converted_data} ${
												styles[`work_${index}`]
											}`}
											key={task?.label}
										>
											<div className={styles.work_data}>
												<div className={styles.work_data_empty_value}>--</div>
												{/* <div
												className={`${styles.row_cadence_background} 
															${task.label === "disqualified" && styles.row_cadence_orange_bg}
															${task.label === "converted" && styles.row_cadence_green_bg}`}
											>
												--
											</div> */}
											</div>
										</div>
									))}
								</div>
							</>
						)}
					</div>
				</>
			) : (
				<div
					className={styles.row_users}
					// ref={userRowRef}
				>
					{Object.keys(data)?.length > 0 && (
						<div
							className={styles.row_user}
							key={data?.first_name}
							// onClick={e => setModalData(prev => ({ ...prev, indexofRow: rowindex }))}
						>
							<div className={styles.row_user_spacer}></div>
							<div className={styles.row_user_info}>
								<div className={styles.info_image_and_text}>
									<div className={styles.info_image} id="profile-image">
										{isPdf ? (
											<img
												src="https://cdn.ringover.com/img/users/default.jpg"
												alt="profile_picture"
												id="user-profile"
											/>
										) : (
											<ProfilePicture
												profile_image={data?.profile_picture}
												showDefault={!data?.profile_picture && true}
											/>
										)}
									</div>
									<div className={styles.info_text}>
										<p className={styles.info_text_name}>
											{data?.first_name} {data?.last_name}
										</p>
										<p className={styles.info_text_position}>{data?.sub_department}</p>
									</div>
								</div>
							</div>

							{headerData?.map((task, index) => (
								<div
									className={`${styles.work_item} ${
										task.label === "disqualified" && styles.row_disqualified_data
									} ${task.label === "converted" && styles.row_converted_data} ${
										styles[`work_${index}`]
									}`}
									key={task?.label}
								>
									<div className={styles.work_data}>
										<div
											style={{
												cursor:
													task.label === "skippedTasks" &&
													data?.tasks["skippedTasks"].value !== 0
														? "pointer"
														: "",
											}}
											className={styles.work_data_value}
											onClick={
												data?.tasks["skippedTasks"] &&
												task.label === "skippedTasks" &&
												data?.tasks["skippedTasks"].value !== 0
													? e =>
															handleClick(
																e,
																selectedCadences?.length > 0 ? selectedCadences : "",
																rowindex,
																data.user_id
															)
													: null
											}
										>
											{Object.keys(data?.tasks).map((key, ind) =>
												// key===task.label ? user?.tasks[key]?.value : null
												key == "averageTime" && task.label === "averageTime"
													? convertIntodays(data?.tasks[key]?.value)
													: key === task.label
													? data?.tasks[key]?.value
													: null
											)}
										</div>

										{task.label !== "averageTime" &&
											Object.keys(data?.tasks).map((key, ind) =>
												key === task.label
													? !isNaN(data?.tasks[key]?.percentage) &&
													  data?.tasks[key]?.percentage !== 0 && (
															<div
																className={`${styles.row_cadence_background} 
										${task.label === "disqualified" && styles.row_cadence_orange_bg}
										${task.label === "converted" && styles.row_cadence_green_bg}`}
															>
																{Object.keys(data?.tasks).map((key, ind) =>
																	key === task.label
																		? !isNaN(data?.tasks[key]?.percentage) &&
																		  data?.tasks[key]?.percentage !== 0 &&
																		  data?.tasks[key]?.percentage !== Infinity &&
																		  `${data?.tasks[key]?.percentage}`
																		: null
																)}
																%
															</div>
													  )
													: null
											)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
			{headerData.find(item => item.label === "skippedTasks") &&
				modalData.indexofRow === rowindex &&
				modalData.isShow && (
					<SkippedchartModal
						setModalData={setModalData}
						modalData={modalData}
						localCoords={modalData.localCoords}
						filter={filter}
						modalRef={modalRef}
						singleUser={singleUser}
					/>
				)}
		</div>
	);
};
export default RanktableRowv2;
