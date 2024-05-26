import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { Checkbox, Input, Label, Select, ThemedButton } from "@cadence-frontend/widgets";
import { AddVideoModal } from "@cadence-frontend/widgets";
import { userInfo } from "@cadence-frontend/atoms";
import { useCallback, useContext, useState } from "react";
import { useRecoilValue } from "recoil";
import {
	TEMPLATE_LEVELS,
	TEMPLATE_TYPES,
	TEMPLATE_TYPES_OPTIONS,
} from "@cadence-frontend/constants";
import {
	Common as COMMON_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";
import styles from "./VideoTemplateModal.module.scss";
import { getCreateTemplateOptions } from "../../../../utils";
import { Tooltip } from "@cadence-frontend/components";
import { Close } from "@cadence-frontend/icons";
import { ROLES } from "@cadence-frontend/constants";
import { MessageContext } from "@cadence-frontend/contexts";
import WarningModal from "../../../WarningModal/WarningModal";
import { getTeamsOptions } from "../../../../../Cadence/components/CreateCadenceModal/utils";
import { useSubDepartments } from "@cadence-frontend/data-access";

const VideoTemplateModal = ({
	dataAccess,
	templateLevel,
	handleClose,
	type,
	setType,
}) => {
	const [input, setInput] = useState({ level: templateLevel });
	// const [type, setType] = useState({ type: templateType });
	const [videoModal, setVideoModal] = useState(false);
	const [uploadVideoLink, setUploadVideoLink] = useState(null);
	const [videoId, setVideoId] = useState(null);
	const { createTemplate, createLoading, updateLoading, queryClient, KEY, refetchCount } =
		dataAccess;
	const { addSuccess, addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);
	const { subDepartments } = useSubDepartments(true);

	const [warningModal, setWarningModal] = useState(false);

	const closeWarningModal = () => {
		setWarningModal(false);
		setVideoModal(false);
	};

	const handleVideoModalClose = () => {
		setWarningModal(true);
	};

	const showGroupsDropdown = useCallback(() => {
		return (
			(user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) &&
			input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT
		);
	}, [input, user]);

	const allowedLevels = getCreateTemplateOptions(user?.role, user);

	const handleCreateVideoTemplate = () => {
		if (uploadVideoLink === null && !input.name && !input.level) {
			addError({ text: "Template name, level and video link required." });
			return;
		} else if (uploadVideoLink === null || !input.name) {
			addError({ text: "Template name and video link required." });
			return;
		}

		const findGroupId = () => {
			if (input.level === TEMPLATE_LEVELS.SUB_DEPARTMENT) {
				if (user.role === ROLES.SALES_MANAGER) return user.sd_id;
				else if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN)
					return input.sd_id;
			} else return null;
		};

		const body = {
			name: input.name,
			type: TEMPLATE_TYPES.VIDEO,
			sd_id: findGroupId(),
			video_id: videoId,
			level: input.level,
			company_id: input.level === TEMPLATE_LEVELS.COMPANY ? user.company_id : null,
		};

		createTemplate(body, {
			onSuccess: () => {
				addSuccess("Template created successfully.");
				refetchCount();
				handleClose();
			},
			onError: (err, _, context) => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(
					[KEY, { level: input.level, type: TEMPLATE_TYPES.EMAIL }],
					context.previousTemplates
				);
			},
		});
	};

	return (
		<div className={styles.videoTemplateModal}>
			<div className={styles.header}>
				<h3>{TEMPLATES_TRANSLATION.NEW_TEMPLATE[user?.language?.toUpperCase()]}</h3>
				<div className={styles.title}>
					<ThemedButton
						className={styles.addButton}
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => setVideoModal(true)}
					>
						<div>{TEMPLATES_TRANSLATION.ADD_VIDEO[user?.language?.toUpperCase()]}</div>
					</ThemedButton>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.inputBox}>
					<Label>
						{TEMPLATES_TRANSLATION.TEMPLATE_TYPE[user?.language?.toUpperCase()]}
					</Label>
					<Select
						options={TEMPLATE_TYPES_OPTIONS.map(opt => ({
							label: opt.label[user?.language?.toUpperCase()],
							value: opt.value,
						}))}
						value={type}
						setValue={setType}
						name="type"
						numberOfOptionsVisible="4"
					/>
				</div>
				<div className={styles.inputBox}>
					<Label required>
						{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
					</Label>
					<Input
						value={input}
						setValue={setInput}
						name="name"
						placeholder="Add template name"
						theme={InputThemes.WHITE_BORDERED}
					/>
				</div>
				<div className={styles.inputBox}>
					<Label required>
						{TEMPLATES_TRANSLATION.TEMPLATE_LEVEL[user?.language?.toUpperCase()]}
					</Label>
					<Select
						options={allowedLevels}
						value={input}
						setValue={setInput}
						name="level"
						menuOnTop
					/>
				</div>
				{showGroupsDropdown() && (
					<div className={styles.inputBox}>
						<Label required>
							{COMMON_TRANSLATION.SELECT_GROUP[user?.language?.toUpperCase()]}
						</Label>
						<Select
							options={getTeamsOptions(subDepartments)}
							value={input}
							setValue={setInput}
							name="sd_id"
							isSearchable={true}
							menuOnTop
						/>
					</div>
				)}
				{uploadVideoLink && (
					<div className={styles.inputBox}>
						<Label required>
							{TEMPLATES_TRANSLATION.VIDEO_LINK[user?.language?.toUpperCase()]}
						</Label>
						<Input value={uploadVideoLink} theme={InputThemes.WHITE_BORDERED} disabled />
					</div>
				)}
				{/* <div className={styles.checkbox}>
					<Checkbox /> Set as default template
				</div> */}
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				className={styles.saveBtn}
				onClick={() => handleCreateVideoTemplate()}
				// loading={createLoading || updateLoading}
				width="100%"
				height="40px"
			>
				{COMMON_TRANSLATION.SAVE[user?.language?.toUpperCase()]}
			</ThemedButton>
			<AddVideoModal
				isModal={videoModal}
				onClose={handleVideoModalClose}
				showOpenTemplatesOption={false}
				// embedLink={embedLink}
				setUploadVideoLink={setUploadVideoLink}
				setVideoId={setVideoId}
				videoId={videoId}
				setVideoModal={setVideoModal}
			/>

			{warningModal && (
				<WarningModal
					modal={warningModal}
					setModal={setWarningModal}
					onConfirm={closeWarningModal}
				/>
			)}
		</div>
	);
};

export default VideoTemplateModal;
