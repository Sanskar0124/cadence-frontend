/* eslint-disable no-useless-escape */
import { useState, useEffect, useContext } from "react";

import { Modal } from "@cadence-frontend/components";
import { Label, ThemedButton, Input, Editor, Select } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButtonThemes, InputThemes } from "@cadence-frontend/themes";
import { AttachmentToFile, Colors, insertAttachments } from "@cadence-frontend/utils";
import { useAttachments, useTestEmail } from "@cadence-frontend/data-access";
import styles from "./SendTestMailModal.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { ROLES } from "@cadence-frontend/constants";
import { Caution2 } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";

const SendTestMailModal = ({ modal, setModal, cadence_id }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const [employees, setEmployees] = useState([]);
	const user = useRecoilValue(userInfo);
	const { fetchSubDeptUsers, usersLoading, sendTestEmail, testEmailLoading } =
		useTestEmail();
	const { getAttachment } = useAttachments();
	const [input, setInput] = useState(modal ?? {});
	const [isCc, setIsCc] = useState(false);
	const [isBcc, setIsBcc] = useState(false);
	const [files, setFiles] = useState([]);
	const [usersOptions, setUsersOptions] = useState(null);

	const toggleCc = () => {
		if (isCc)
			setInput(prev => ({
				...prev,
				cc: "",
			}));
		setIsCc(prev => !prev);
	};

	const toggleBcc = () => {
		if (isBcc)
			setInput(prev => ({
				...prev,
				bcc: "",
			}));
		setIsBcc(prev => !prev);
	};

	useEffect(() => {
		if (modal && user.role !== ROLES.SALESPERSON) {
			fetchSubDeptUsers(cadence_id, {
				onSuccess: users => {
					setEmployees(users);
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		}
	}, [modal]);

	useEffect(() => {
		if (modal) {
			if (user.role === ROLES.SALESPERSON) setInput({ ...modal, from: user?.user_id });
			else setInput(modal);
			// setFiles(
			// 	modal.Attachments?.map(att =>
			// 		att.original_name ? AttachmentToFile(att) : att
			// 	) ?? []
			// );
			setIsCc(false);
			setIsBcc(false);
			if (typeof modal?.Attachments?.[0] !== "object") {
				getAttachment(modal?.Attachments, {
					onSuccess: data => {
						setFiles(data?.data);
						data?.data.forEach(data => insertAttachments(data));
					},
				});
			} else {
				setFiles(modal?.Attachments);
				insertAttachments(modal?.Attachments);
			}
		} else {
			setInput({ body: "" });
		}
	}, [modal]);

	useEffect(() => {
		let validU = [];
		let expiredU = [];

		employees
			?.sort((a, b) => a.first_name.localeCompare(b.first_name))
			?.forEach(e => {
				if (!e.is_token_expired) validU.push(e);
				else expiredU.push(e);
			});

		setUsersOptions(
			[...validU, ...expiredU]?.map(op => ({
				...op,
				label: `${op.first_name} ${op.last_name}`,
				value: op.user_id,
				isDisabled: op?.is_token_expired ?? true,
			}))
		);
	}, [employees]);

	const getOptionLabel = opt => GenerateLabel(opt);

	const getCustomFilter = (opt, searchText) =>
		opt.data.label.toLowerCase().includes(searchText?.toLowerCase());

	const setBodyValue = value => setInput(prev => ({ ...prev, body: value }));

	const handleClose = () => setModal(null);

	const handleSubmit = () => {
		if (!input.from) {
			addError({ text: "Please select a Sales person" });
			return;
		}
		if (
			!input.to ||
			!input.to.match(
				/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
			)
		) {
			addError({ text: "Please enter a valid recipient email address" });
			return;
		}
		if (!input.body) {
			addError({ text: "Email has no body" });
			return;
		}

		let data = {
			integration_type: user?.mail_integration_type,
			from: input.from,
			to: input.to,
			subject: input.subject,
			cc: input.cc,
			bcc: input.bcc,
			attachments: files,
			body: input.body ?? "",
		};

		sendTestEmail(data, {
			onError: (err, formData, context) => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
				let template = data;
				setModal(template);
			},
			onSuccess: () => {
				addSuccess("Successfully sent test email");
				handleClose();
			},
		});
	};

	return (
		<Modal isModal={modal} onClose={handleClose} showCloseButton disableOutsideClick>
			<div className={styles.sendTestMailModal}>
				<div className={styles.heading}>
					<h3>{TEMPLATES_TRANSLATION.TEST_EMAIL[user?.language?.toUpperCase()]}</h3>
				</div>
				<div className={styles.main}>
					<div className={styles.inputGroup}>
						<Label>{COMMON_TRANSLATION.FROM[user?.language?.toUpperCase()]}</Label>
						{user.role !== ROLES.SALESPERSON ? (
							<Select
								value={input}
								setValue={setInput}
								className={styles.select}
								width={"100%"}
								placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
								name="from"
								options={usersOptions}
								getOptionLabel={getOptionLabel}
								getOptionValue={opt => opt.value}
								filterOption={getCustomFilter}
								border={false}
								isSearchable
							/>
						) : (
							<Input value={user.email} theme={InputThemes.TRANSPARENT} disabled />
						)}
					</div>

					<div className={styles.inputGroup}>
						<Label>{COMMON_TRANSLATION.TO[user?.language?.toUpperCase()]}</Label>
						<Input
							value={input}
							setValue={setInput}
							name="to"
							theme={InputThemes.TRANSPARENT}
						/>
						<div
							className={`${styles.cc} ${isCc && styles.ccActive}`}
							onClick={() => setIsCc(prev => !prev)}
						>
							Cc
						</div>

						<div
							className={`${styles.bcc} ${isBcc && styles.bccActive}`}
							onClick={() => setIsBcc(prev => !prev)}
						>
							Bcc
						</div>
					</div>
					{/* cc */}
					{isCc && (
						<div className={styles.inputGroup}>
							<Label>Cc</Label>
							<Input
								value={input}
								setValue={setInput}
								name="cc"
								theme={InputThemes.TRANSPARENT}
							/>
						</div>
					)}
					{/* bcc */}
					{isBcc && (
						<div className={styles.inputGroup}>
							<Label>Bcc</Label>
							<Input
								value={input}
								setValue={setInput}
								name="bcc"
								theme={InputThemes.TRANSPARENT}
							/>
						</div>
					)}
					<div className={styles.inputGroup}>
						<Label>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</Label>
						<Input
							value={input}
							setValue={setInput}
							name="subject"
							theme={InputThemes.TRANSPARENT}
						/>
					</div>

					<div className={styles.inputGroup}>
						<Editor
							value={input.body}
							setValue={setBodyValue}
							files={files}
							setFiles={setFiles}
							className={styles.editor}
							height="300px"
							theme="email"
						/>
					</div>
				</div>

				<div className={styles.footer}>
					<ThemedButton
						loading={testEmailLoading}
						theme={ThemedButtonThemes.PINK}
						onClick={handleSubmit}
					>
						<div>
							{TEMPLATES_TRANSLATION.SEND_TEST_MAIL[user?.language?.toUpperCase()]}
						</div>
					</ThemedButton>
				</div>
			</div>
		</Modal>
	);
};

function GenerateLabel(emp) {
	return (
		<div className={styles.empLabel}>
			<span>{emp.label}</span>
			{emp.is_token_expired && (
				<span className={styles.tokenExpired}>
					<Caution2 color={Colors.red} /> Token Expired
				</span>
			)}
		</div>
	);
}

export default SendTestMailModal;
