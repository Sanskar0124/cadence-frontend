import { Modal } from "@cadence-frontend/components";
import { Label, ThemedButton, Select, Toggle, Input } from "@cadence-frontend/widgets";
import { ROLES } from "@cadence-frontend/constants";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useContext, useEffect, useCallback, useState } from "react";
import { MessageContext } from "@cadence-frontend/contexts";
import { useSubDepartments, useUsers } from "@cadence-frontend/data-access";
import { TEMPLATE_LEVELS } from "../../constants";
import {
	Templates as TEMPLATES_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";

// import styles
import styles from "./ShareTemplateModal.module.scss";
import { getShareTemplateOptions, cleanRequestBody } from "../../utils";
import {
	getUsersOptions,
	getTeamsOptions,
} from "../../../Cadence/components/CreateCadenceModal/utils";

const ShareTemplateModal = ({ modal, setModal, dataAccess }) => {
	const user = useRecoilValue(userInfo);
	const { addError, addSuccess } = useContext(MessageContext);
	let { subDepartments } = useSubDepartments(Boolean(modal));
	const { companyUsers } = useUsers({ users: false, companyUsers: Boolean(modal) });
	const [sdOptions, setSdOptions] = useState([]);
	const [option, setOption] = useState(TEMPLATE_LEVELS.USER);
	const [input, setInput] = useState({
		user_id: null,
		sd_id: null,
	});

	useEffect(() => {
		setSdOptions(getTeamsOptions(subDepartments));
	}, [subDepartments]);

	useEffect(() => {
		if (
			user?.role === ROLES.SALES_MANAGER &&
			modal?.level === TEMPLATE_LEVELS.SUB_DEPARTMENT
		)
			setSdOptions(
				getTeamsOptions(subDepartments?.filter(sd => sd.sd_id !== user.sd_id))
			);
		else if (
			(user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) &&
			modal?.level === TEMPLATE_LEVELS.SUB_DEPARTMENT
		)
			setSdOptions(
				getTeamsOptions(subDepartments?.filter(sd => sd.sd_id !== modal?.sd_id))
			);
		else setSdOptions(getTeamsOptions(subDepartments));
	}, [user, subDepartments, modal?.level, option]);

	const { shareLoading, shareTemplate, refetchCount } = dataAccess;

	useEffect(() => {
		if (modal) setInput(prev => ({ ...modal, sd_id: null, user_id: null }));
	}, [modal]);

	useEffect(() => {
		switch (option) {
			case TEMPLATE_LEVELS.USER:
				{
					if (companyUsers) {
						setInput(prev => ({ ...prev, sd_id: null, user_id: null }));
					}
				}
				break;
			case TEMPLATE_LEVELS.SUB_DEPARTMENT: {
				if (subDepartments) {
					setInput(prev => ({ ...prev, sd_id: null, user_id: null }));
				}
			}
		}
	}, [option]);

	const handleClose = () => {
		setModal(null);
	};

	const handleTemplateRename = value => {
		setInput(prevInputObject => ({ ...prevInputObject, name: value }));
	};

	const handleSubmit = () => {
		if (input.name?.trim().length === 0) {
			return addError({ text: "Please enter template name." });
		}
		if (option === TEMPLATE_LEVELS.USER && !input.user_id) {
			return addError({ text: "Please select a group member." });
		}
		if (option === TEMPLATE_LEVELS.SUB_DEPARTMENT && !input.sd_id) {
			return addError({ text: "Please select a group." });
		}
		const body = {
			...input,
			level: option,
			user_id: option === TEMPLATE_LEVELS.USER ? input.user_id : user.user_id,
			sd_id: option === TEMPLATE_LEVELS.SUB_DEPARTMENT ? input.sd_id : null,
			company_id: option === TEMPLATE_LEVELS.COMPANY ? user.company_id : null,
		};

		delete body.Attachments;

		shareTemplate(cleanRequestBody(body), {
			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Template shared");
				handleClose();
				refetchCount();
			},
		});
	};

	const renderComponent = () => {
		switch (option) {
			case TEMPLATE_LEVELS.USER:
				return (
					!input.sd_id && (
						<div className={styles.inputGroup}>
							<Label>
								{TEMPLATES_TRANSLATION.GROUP_MEMBER_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={getUsersOptions(companyUsers)}
								value={input}
								setValue={setInput}
								name="user_id"
								isSearchable={true}
							/>
						</div>
					)
				);

			case TEMPLATE_LEVELS.SUB_DEPARTMENT:
				return (
					!input.user_id && (
						<div className={styles.inputGroup}>
							<Label>
								{COMMON_TRANSLATION.GROUP_NAME[user?.language?.toUpperCase()]}
							</Label>
							<Select
								options={sdOptions}
								value={input}
								setValue={setInput}
								name="sd_id"
								isSearchable={true}
							/>
						</div>
					)
				);

			default:
				return null;
		}
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h3>{TEMPLATES_TRANSLATION.SHARE_TEMPLATE[user?.language?.toUpperCase()]}</h3>
				</div>

				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>
							{TEMPLATES_TRANSLATION.TEMPLATE_LEVEL[user?.language?.toUpperCase()]}
						</Label>
						<Select
							value={option}
							setValue={setOption}
							options={getShareTemplateOptions(user?.role, modal?.level)?.map(opt => ({
								label: opt.label[user?.language?.toUpperCase()],
								value: opt.value,
							}))}
						/>
					</div>
					<div className={styles.inputGroup}>
						<Label>
							{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
						</Label>
						<Input
							value={input?.name}
							setValue={handleTemplateRename}
							name="name"
							theme={InputThemes.WHITE}
							className={styles.input}
						/>
					</div>
					{renderComponent()}
				</div>
				<div className={styles.footer}>
					<ThemedButton
						className={styles.btn}
						theme={ThemedButtonThemes.PRIMARY}
						loading={shareLoading}
						onClick={handleSubmit}
					>
						<div>
							{TEMPLATES_TRANSLATION.SHARE_TEMPLATE[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
};

export default ShareTemplateModal;
