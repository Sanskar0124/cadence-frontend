import moment from "moment-timezone";
import { forwardRef, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Tooltip } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	Copy,
	Leads,
	More,
	Pause,
	Paused,
	Play,
	Rocket,
	Settings,
	Share,
	Star,
	Trash,
} from "@cadence-frontend/icons";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { DropDown, ThemedButton } from "@cadence-frontend/widgets";
import { getLabelFromEnum } from "./constants";

import { ACTIONS, CADENCE_STATUS, STATUS_LABELS_CL_NAMES } from "../../constants";
import { isActionPermitted, isMoreOptionsEnabled } from "../../utils";

import { userInfo } from "@cadence-frontend/atoms";
import { CADENCE_TYPES, ROLES } from "@cadence-frontend/constants";
import { Colors } from "@cadence-frontend/utils";
import { useRecoilValue } from "recoil";
import styles from "./CadenceCard.module.scss";

const ICON_SIZE = "18px";

const CadenceCard = (
	{
		cadence,
		cadenceNo,
		totalCadences,
		cadenceDataAccess,
		setDuplicateCadenceModal,
		setSettingsModal,
		setShareModal,
		setDeleteModal,
		loadingId,
		viewMode,
		type,
		setActionModal,
	},
	ref
) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	const { updateFavorite, actionLoading } = cadenceDataAccess;

	const [favorite, setFavorite] = useState(cadence?.favorite);

	//functions

	const handleDuplicateClick = (e, cadence) => {
		e.stopPropagation();
		setDuplicateCadenceModal(cadence);
	};

	const handleShareClick = (e, cadence) => {
		e.stopPropagation();
		setShareModal(cadence);
	};

	const handleDeleteClick = (e, cadence) => {
		e.stopPropagation();
		setDeleteModal(cadence);
	};
	const handleSettingsClick = (e, cadence) => {
		e.stopPropagation();
		setSettingsModal(cadence);
	};

	const positionProps = (() => {
		const props = { right: "10px" };
		if (totalCadences > 4 && cadenceNo > totalCadences - 2) props.bottom = "50px";
		else props.top = "50px";
		return props;
	})();

	useEffect(() => {
		setFavorite(cadence?.favorite);
	}, [cadence]);

	return (
		<div
			ref={ref}
			className={styles.cadenceCard}
			id={cadenceNo === 1 ? "first-cadence" : null}
			onClick={() => navigate(`/cadence/${cadence.cadence_id}`)}
		>
			<div className={styles.favorite}>
				<Star
					color={favorite ? "#FFB12A" : Colors.disabled}
					size="1.2rem"
					onClick={e => {
						e.stopPropagation();
						setFavorite(prev => !prev);
						updateFavorite(
							{ cadence_id: cadence?.cadence_id, favorite: !favorite ? 1 : 0 },
							{
								onSuccess: () => addSuccess("Cadence updated"),
								onError: err => {
									addError({
										text: err?.response?.data?.msg,
										desc: err?.response?.data?.error,
										cId: err?.response?.data?.correlationId,
									});
									setFavorite(prev => !prev);
								},
							}
						);
					}}
					disabled={
						!isActionPermitted(
							ACTIONS.UPDATE,
							type,
							user.role,
							user.user_id === cadence.user_id
						)
					}
				/>
			</div>
			<div className={styles.leads}>
				<span className={styles.capsule}>
					{" "}
					<Leads size="16px" />
					<span>{cadence.people}</span>
				</span>
			</div>
			<div className={styles.cadenceName} title={cadence.name}>
				{cadence.name}
			</div>
			{!viewMode && (
				<>
					<div className={styles.steps}>{cadence.steps}</div>
					<div className={styles.createdOn}>
						{moment(cadence.created_at).format("DD/MM/YY")}
					</div>
					<div className={styles.createdBy}>
						{cadence.owner ? cadence.owner : "Deleted User"}
					</div>
					{(user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) && (
						<div className={styles.createdBy}>
							{/* {cadence.type === CADENCE_TYPES.TEAM
								? cadence.Sub_Department?.name
								: cadence.User?.Sub_Department?.name} */}
							{cadence.sd_name}
						</div>
					)}
				</>
			)}
			<div className={styles.status}>
				<span
					className={`${
						styles[
							STATUS_LABELS_CL_NAMES[
								cadence.status === CADENCE_STATUS.NOT_STARTED &&
								cadence?.Cadence_Schedule?.launch_at
									? "scheduled"
									: cadence.status
							]
						]
					}`}
				>
					{cadence.status === CADENCE_STATUS.NOT_STARTED &&
					cadence?.Cadence_Schedule?.launch_at
						? "Scheduled"
						: getLabelFromEnum(cadence.status, user)}
					{cadence.status === CADENCE_STATUS.PAUSED &&
						cadence?.Cadence_Schedule?.launch_at && (
							<Tooltip
								text={`Until ${moment(
									parseInt(cadence?.Cadence_Schedule?.launch_at)
								).format("LLL")}`}
							>
								<span>
									<Paused />
								</span>
							</Tooltip>
						)}
					{cadence.status === CADENCE_STATUS.NOT_STARTED &&
						cadence?.Cadence_Schedule?.launch_at && (
							<Tooltip
								text={`Until ${moment(
									parseInt(cadence?.Cadence_Schedule?.launch_at)
								).format("LLL")}`}
							>
								<span>
									<Paused />
								</span>
							</Tooltip>
						)}
				</span>
			</div>
			<div className={styles.actions} onClick={e => e.stopPropagation()}>
				<div>
					{cadence.status === CADENCE_STATUS.IN_PROGRESS ||
					cadence.status === CADENCE_STATUS.PROCESSING ? (
						<Tooltip text={CADENCE_TRANSLATION.PAUSE[user?.language?.toUpperCase()]}>
							<ThemedButton
								height="40px"
								width="50px"
								className={styles.actionBtn}
								theme={ThemedButtonThemes.GREY}
								loading={loadingId === cadence.cadence_id && actionLoading}
								disabled={
									cadence.status === CADENCE_STATUS.PROCESSING ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										type,
										user.role,
										user.user_id === cadence.user_id
									)
								}
								onClick={e => {
									e.stopPropagation();
									setActionModal({
										cadence: cadence,
										buttonText: CADENCE_TRANSLATION.PAUSE[user?.language?.toUpperCase()],
										message:
											CADENCE_TRANSLATION.YOU_WANT_TO_PAUSE_THIS_CADENCE[
												user?.language?.toUpperCase()
											],
									});
								}}
							>
								<div>
									<Pause />
								</div>
							</ThemedButton>
						</Tooltip>
					) : cadence.status === CADENCE_STATUS.SCHEDULED ||
					  cadence.status === CADENCE_STATUS.PROCESSING ? (
						<Tooltip
							text={
								cadence.status === CADENCE_STATUS.NOT_STARTED
									? COMMON_TRANSLATION.LAUNCH[user?.language?.toUpperCase()]
									: COMMON_TRANSLATION.RESUME[user?.language?.toUpperCase()]
							}
						>
							<ThemedButton
								height="40px"
								width="50px"
								className={styles.actionBtn}
								loading={loadingId === cadence.cadence_id && actionLoading}
								disabled={
									cadence.status === CADENCE_STATUS.STOPPED ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										type,
										user.role,
										user.user_id === cadence.user_id
									)
								}
								theme={ThemedButtonThemes.GREY}
								// onClick={e => handleCadenceResume(e, cadence)}

								onClick={e => {
									e.stopPropagation();
									setActionModal({
										cadence: cadence,
										buttonText:
											cadence?.status === CADENCE_STATUS.NOT_STARTED
												? COMMON_TRANSLATION.LAUNCH[user?.language?.toUpperCase()]
												: COMMON_TRANSLATION.RESUME[user?.language?.toUpperCase()],
										message:
											cadence?.status === CADENCE_STATUS.NOT_STARTED
												? CADENCE_TRANSLATION.YOU_WANT_TO_LAUNCH_THIS_CADENCE[
														user?.language?.toUpperCase()
												  ]
												: CADENCE_TRANSLATION.YOU_WANT_TO_RESUME_THIS_CADENCE[
														user?.language?.toUpperCase()
												  ],
									});
								}}
							>
								<div>
									<Rocket />
								</div>
							</ThemedButton>
						</Tooltip>
					) : (
						<Tooltip
							text={
								cadence.status === CADENCE_STATUS.NOT_STARTED
									? COMMON_TRANSLATION.LAUNCH[user?.language?.toUpperCase()]
									: COMMON_TRANSLATION.RESUME[user?.language?.toUpperCase()]
							}
						>
							<ThemedButton
								height="40px"
								width="50px"
								className={styles.actionBtn}
								loading={loadingId === cadence.cadence_id && actionLoading}
								disabled={
									cadence.status === CADENCE_STATUS.STOPPED ||
									!isActionPermitted(
										ACTIONS.UPDATE,
										type,
										user.role,
										user.user_id === cadence.user_id
									)
								}
								theme={ThemedButtonThemes.GREY}
								// onClick={e => handleCadenceResume(e, cadence)}

								onClick={e => {
									e.stopPropagation();
									setActionModal({
										cadence: cadence,
										buttonText:
											cadence?.status === CADENCE_STATUS.NOT_STARTED
												? COMMON_TRANSLATION.LAUNCH[user?.language?.toUpperCase()]
												: COMMON_TRANSLATION.RESUME[user?.language?.toUpperCase()],
										message:
											cadence?.status === CADENCE_STATUS.NOT_STARTED
												? CADENCE_TRANSLATION.YOU_WANT_TO_LAUNCH_THIS_CADENCE[
														user?.language?.toUpperCase()
												  ]
												: CADENCE_TRANSLATION.YOU_WANT_TO_RESUME_THIS_CADENCE[
														user?.language?.toUpperCase()
												  ],
									});
								}}
							>
								<div>
									<Play />
								</div>
							</ThemedButton>
						</Tooltip>
					)}
					<DropDown
						btn={
							<ThemedButton
								height="40px"
								width="50px"
								className={styles.dotsBtn}
								theme={ThemedButtonThemes.GREY}
								disabled={
									!isMoreOptionsEnabled(type, user.role, user.user_id === cadence.user_id)
								}
							>
								<div>
									<More />
								</div>
							</ThemedButton>
						}
						tooltipText={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
						width={"max-content"}
						{...positionProps}
					>
						{isActionPermitted(
							ACTIONS.DUPLICATE,
							type,
							user.role,
							user.user_id === cadence.user_id
						) && (
							<button
								className={styles.dropdownBtn}
								onClick={e => handleDuplicateClick(e, cadence)}
							>
								<div>
									<Copy size={ICON_SIZE} />
								</div>
								<div>{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}</div>
							</button>
						)}
						{isActionPermitted(
							ACTIONS.SHARE,
							type,
							user.role,
							user.user_id === cadence.user_id
						) && (
							<button
								className={styles.dropdownBtn}
								onClick={e => handleShareClick(e, cadence)}
							>
								<div>
									<Share size={ICON_SIZE} />
								</div>
								<div>{COMMON_TRANSLATION.SHARE[user?.language?.toUpperCase()]}</div>
							</button>
						)}

						{[CADENCE_STATUS.NOT_STARTED, CADENCE_STATUS.PAUSED].includes(
							cadence.status
						) && cadence?.Cadence_Schedule?.launch_at
							? isActionPermitted(
									ACTIONS.DELETE,
									type,
									user.role,
									user.user_id === cadence.user_id
							  ) && (
									<button
										className={styles.dropdownBtn}
										onClick={e => {
											e.stopPropagation();
											setActionModal({
												cadence: cadence,
												buttonText:
													cadence?.status === CADENCE_STATUS.NOT_STARTED
														? COMMON_TRANSLATION.LAUNCH[user?.language?.toUpperCase()]
														: COMMON_TRANSLATION.RESUME[user?.language?.toUpperCase()],
												message:
													cadence?.status === CADENCE_STATUS.NOT_STARTED
														? CADENCE_TRANSLATION.YOU_WANT_TO_LAUNCH_THIS_CADENCE[
																user?.language?.toUpperCase()
														  ]
														: CADENCE_TRANSLATION.YOU_WANT_TO_RESUME_THIS_CADENCE[
																user?.language?.toUpperCase()
														  ],
											});
										}}
									>
										<div>
											<Play size={ICON_SIZE} />
										</div>
										<div>
											{COMMON_TRANSLATION.LAUNCH_NOW[user?.language?.toUpperCase()]}
										</div>
									</button>
							  )
							: ""}
						{isActionPermitted(
							ACTIONS.UPDATE,
							type,
							user.role,
							user.user_id === cadence.user_id
						) && (
							<button
								className={styles.dropdownBtn}
								onClick={e => handleSettingsClick(e, cadence)}
							>
								<div>
									<Settings size={ICON_SIZE} />
								</div>
								<div>
									{" "}
									{COMMON_TRANSLATION.EDIT_DETAILS[user?.language?.toUpperCase()]}
								</div>
							</button>
						)}
						{isActionPermitted(
							ACTIONS.DELETE,
							type,
							user.role,
							user.user_id === cadence.user_id
						) && (
							<button
								className={styles.dropdownBtn}
								onClick={e => handleDeleteClick(e, cadence)}
							>
								<div>
									<Trash size={ICON_SIZE} />
								</div>
								<div>{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}</div>
							</button>
						)}
					</DropDown>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(CadenceCard);
