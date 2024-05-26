import React, { useContext, useEffect, useState } from "react";
import styles from "./AiGenerationModal.module.scss";
import {
	OpenaiLockup,
	Union as StarPen,
	LightBulb,
	RingoverLogoWithColor,
	Refresh,
	Edit,
	Minimize,
	Maximize,
	Info2,
	Info,
	Union,
} from "@cadence-frontend/icons";
import { Div, Modal, Title } from "@cadence-frontend/components";
import { Editor, Input, Label, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useAiGeneration } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import Placeholder from "./components/Placeholder/Placeholder";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import GetGoodPrompt from "./components/GetGoodPrompt/GetGoodPrompt";
import { PROMPT_PLACEHOLDER } from "./constants";

const AiGenerationModal = ({ modal, setModal }) => {
	const user = useRecoilValue(userInfo);

	const [promptInput, setPromptInput] = useState({
		prompt: "",
		key_benefits: "",
		problem_statement: "",
	});
	const [result, setResult] = useState({ subject: "", body: "" });
	const { addError, addSuccess } = useContext(MessageContext);
	const [emailBody, setEmailBody] = useState(false);
	const [editor, setEditor] = useState(null);
	const [expandBody, setExpandBody] = useState({
		prompt: false,
		proposition: false,
		statement: false,
	});
	const [promtInfo, setPromptInfo] = useState(false);

	// API
	const {
		getEmailTemplate,
		emailTemplateLoading,
		isSuccess: isGenerateSuccess,
	} = useAiGeneration();

	const aiEmailTemplateHandler = () => {
		setEmailBody(true);

		getEmailTemplate(
			{
				prompt: promptInput?.prompt.trim(),
				key_benefits: promptInput?.key_benefits.trim(),
				problem_statement: promptInput?.problem_statement.trim(),
			},
			{
				onSuccess: data => {
					let generatedBody;
					generatedBody = data?.body.replace(/\n/g, "<br>");

					addSuccess("Successfully generated email");
					setResult(prev => ({ ...prev, subject: data?.subject, body: generatedBody }));
					setEditor(
						<Editor
							height="100%"
							className={styles.editor}
							value={generatedBody ?? ""}
							disabled
							setValue={val => null}
						></Editor>
					);
				},
				onError: err => {
					setEmailBody(false);
					if (err?.response?.data?.msg)
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						});
				},
			}
		);
	};

	const updatePrompt = () => {
		const { problem_statement, prompt, key_benefits } = promptInput;
		setPromptInput({ problem_statement, prompt, key_benefits });
		setEmailBody(false);
		setEditor(null);
	};

	const insertHandler = () => {
		const { setInput } = modal;

		setInput(prev => ({
			...prev,
			...(modal.nodeType !== "reply_to" && { subject: result.subject }),
			body: result.body,
		}));

		closeHandler();
	};

	const closeHandler = () => {
		setModal(null);
		setEmailBody(false);
		setPromptInput({
			prompt: "",
			key_benefits: "",
			problem_statement: "",
		});
		setEditor(null);
	};

	return (
		<Modal
			isModal={modal}
			onClose={closeHandler}
			showCloseButton
			className={styles.modal}
		>
			<div className={styles.header}>
				<div className={styles.left}>
					{emailBody ? (
						<h2>Email</h2>
					) : (
						<>
							<div>
								<StarPen className={styles.starPenIcon} color="#5b6be1" />
							</div>
							<h2 className={styles.title}>{COMMON_TRANSLATION.AI_GENERATOR.ENGLISH}</h2>
						</>
					)}
				</div>
				{isGenerateSuccess && emailBody && (
					<div className={styles.right}>
						<p>{COMMON_TRANSLATION.POWERED_BY.ENGLISH}</p>{" "}
						<div>
							<OpenaiLockup />
						</div>
					</div>
				)}
			</div>

			{emailBody ? (
				<>
					{emailTemplateLoading ? (
						<Loader loading={emailTemplateLoading} user={user} />
					) : (
						<div className={styles.emailBody}>
							{modal?.nodeType !== "reply_to" && (
								<div className={styles.inputGroup}>
									<h2 className={styles.inputTitle}>
										{COMMON_TRANSLATION.SUBJECT?.[user?.language?.toUpperCase()]}
									</h2>
									<p>{result?.subject}</p>
								</div>
							)}

							<div className={styles.inputGroup}>
								<h2 className={styles.inputTitle}>
									{COMMON_TRANSLATION.BODY?.[user?.language?.toUpperCase()]}
								</h2>
								{/* <p>{result?.body}</p> */}
								{editor && editor}
							</div>
						</div>
					)}

					{!emailTemplateLoading && (
						<div className={styles.subFooter}>
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={() => {
									aiEmailTemplateHandler();
									setEditor(null);
								}}
								disabled={emailTemplateLoading}
							>
								<Refresh />
								<div>{COMMON_TRANSLATION.RE_GENERATE_RESULT.ENGLISH}</div>
							</ThemedButton>
							<ThemedButton
								theme={ThemedButtonThemes.GREY}
								onClick={updatePrompt}
								disabled={emailTemplateLoading}
							>
								<Edit />
								<div>{COMMON_TRANSLATION.EDIT_PROMPT.ENGLISH}</div>
							</ThemedButton>
						</div>
					)}

					<ThemedButton
						disabled={emailTemplateLoading}
						theme={ThemedButtonThemes.PRIMARY}
						onClick={insertHandler}
					>
						<div>{COMMON_TRANSLATION.INSERT_RESULT.ENGLISH}</div>
					</ThemedButton>
				</>
			) : (
				<>
					<div className={styles.subHeader}>
						<h2 className={styles.title}>
							{COMMON_TRANSLATION.GENERATE_IMPACTFUL.ENGLISH}
						</h2>
						<p className={styles.description}>
							{COMMON_TRANSLATION.CREATE_A_PROMPT.ENGLISH}
						</p>
					</div>

					<div className={styles.promptBody}>
						<div className={styles.inputGroup}>
							<Label
								size="14px"
								className={`${styles.inputTitle} ${styles.label}`}
								required
							>
								{" "}
								{COMMON_TRANSLATION.YOUR_PROMPT.ENGLISH}
							</Label>
							<p className={`${styles.inputDesc} ${styles.info}`}>
								<span>{COMMON_TRANSLATION.EXPLAIN_OBJECTIVE.ENGLISH}</span>
								<Info2
									size={"14px"}
									style={{ cursor: "pointer" }}
									onMouseEnter={() => setPromptInfo(true)}
									onMouseLeave={() => setPromptInfo(false)}
								/>

								{promtInfo && <GetGoodPrompt />}
							</p>
							<div className={styles.promptInputWrapper}>
								<Input
									type={"textarea"}
									placeholder={PROMPT_PLACEHOLDER}
									height={expandBody.prompt ? "280px" : "150px"}
									className={styles.input}
									value={promptInput.prompt}
									setValue={val => setPromptInput(prev => ({ ...prev, prompt: val }))}
									name="prompt"
								/>
								{expandBody.prompt ? (
									<Minimize
										className={styles.miniMaxIcon}
										onClick={() => setExpandBody(prev => ({ ...prev, prompt: false }))}
									/>
								) : (
									<Maximize
										className={styles.miniMaxIcon}
										onClick={() => setExpandBody(prev => ({ ...prev, prompt: true }))}
									/>
								)}
							</div>
						</div>
						<div className={styles.inputGroup}>
							<h2 className={styles.inputTitle}>
								{COMMON_TRANSLATION.KEY_BENIFITES.ENGLISH}
							</h2>
							<p className={styles.inputDesc}>
								{COMMON_TRANSLATION.DESCRIBE_THE_VALUE.ENGLISH}
							</p>
							<div className={styles.promptInputWrapper}>
								<Input
									type={"textarea"}
									placeholder={`${COMMON_TRANSLATION.AUTOMATE_CALL_DISTRIBUTION.ENGLISH}`}
									className={styles.input}
									value={promptInput.key_benefits}
									setValue={val =>
										setPromptInput(prev => ({ ...prev, key_benefits: val }))
									}
									height={expandBody.proposition ? "180px" : "58px"}
									name="key_benefits"
								/>
								{expandBody.proposition ? (
									<Minimize
										className={styles.miniMaxIcon}
										onClick={() =>
											setExpandBody(prev => ({ ...prev, proposition: false }))
										}
									/>
								) : (
									<Maximize
										className={styles.miniMaxIcon}
										onClick={() =>
											setExpandBody(prev => ({ ...prev, proposition: true }))
										}
									/>
								)}
							</div>
						</div>

						<div className={styles.inputGroup}>
							<h2 className={styles.inputTitle}>
								{" "}
								{COMMON_TRANSLATION.CHALLENGES.ENGLISH}
							</h2>
							<p className={styles.inputDesc}>
								{COMMON_TRANSLATION.DESCRIBE_THE_PROBLEM.ENGLISH}
							</p>
							<div className={styles.promptInputWrapper}>
								<Input
									type={"textarea"}
									placeholder={`${COMMON_TRANSLATION.THE_ABILITY_TO_PROVIDE.ENGLISH}`}
									className={styles.input}
									value={promptInput.problem_statement}
									setValue={val =>
										setPromptInput(prev => ({ ...prev, problem_statement: val }))
									}
									height={expandBody.statement ? "180px" : "58px"}
									name="problem_statement"
								/>

								{expandBody.statement ? (
									<Minimize
										className={styles.miniMaxIcon}
										onClick={() => setExpandBody(prev => ({ ...prev, statement: false }))}
									/>
								) : (
									<Maximize
										className={styles.miniMaxIcon}
										onClick={() => setExpandBody(prev => ({ ...prev, statement: true }))}
									/>
								)}
							</div>
						</div>
					</div>

					<ThemedButton
						disabled={!promptInput.prompt?.trim()}
						theme={ThemedButtonThemes.GREY}
						onClick={aiEmailTemplateHandler}
						className={styles.btnGenerateResult}
					>
						<LightBulb />
						<div>{COMMON_TRANSLATION.GENERATE_EMAILS.ENGLISH}</div>
					</ThemedButton>
				</>
			)}
		</Modal>
	);
};

export default AiGenerationModal;

const Loader = ({ loading, user }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let id = setInterval(() => {
			setProgress(prev => (prev === 100 ? 0 : prev + 5));
		}, 1000);

		return () => {
			clearInterval(id);
		};
	}, [loading]);

	return (
		<div className={styles.loader}>
			{/* {!loading && (
				<div className={styles.loaderBody}>
					<div className={styles.loderInputGroup}>
						<h2 className={styles.inputTitle}>
							{COMMON_TRANSLATION.SUBJECT?.[user?.language?.toUpperCase()]}
						</h2>
						<Placeholder rows={1} style={{ height: "10px" }} />
					</div>

					<div className={styles.loderInputGroup}>
						<h2 className={styles.inputTitle}>
							{" "}
							{COMMON_TRANSLATION.BODY?.[user?.language?.toUpperCase()]}
						</h2>
						{[60, 100, 80, 100].map(item => (
							<Placeholder rows={1} style={{ height: "10px", width: `${item}%` }} />
						))}
					</div>
				</div>
			)} */}

			<div className={styles.progressLoader}>
				<div>
					<div>
						<RingoverLogoWithColor color="#5b6be1" size={"100px"} />
					</div>

					{/* <div className={styles.progressWrapper}>
						<div
							className={`${styles.progressBar} ${styles.activeProgressBar}`}
							style={{ width: `${progress}%` }}
						></div>
					</div> */}

					<div>
						<progress max="100" value={progress}></progress>
					</div>

					<p> {COMMON_TRANSLATION.GENERATING_EMAIL.ENGLISH}...</p>
				</div>
			</div>
		</div>
	);
};
