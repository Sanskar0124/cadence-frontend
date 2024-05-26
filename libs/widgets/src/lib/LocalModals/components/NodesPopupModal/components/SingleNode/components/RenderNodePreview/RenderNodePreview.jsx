import styles from "./RenderNodePreview.module.scss";
import ReactHtmlParser from "react-html-parser";
import EndCadenceView from "./EndCadenceView/EndCadenceView";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useEffect } from "react";

const RenderActivityPreview = ({ node, setIsActive, nodes }) => {
	const user = useRecoilValue(userInfo);

	const renderReplySubject = () => {
		let orignal = nodes?.find(st => st.node_id === node?.data.replied_node_id);
		if (!orignal) return;
		if (orignal?.data.aBTestEnabled) return;
		return `Re: ${orignal?.data.subject}`;
	};

	const renderComponent = (Node = node) => {
		switch (Node?.type) {
			case "mail":
				return (
					<>
						{Node?.data?.subject !== "" && (
							<div className={styles.show_data_subject}>
								<p>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</p>{" "}
								{node?.data?.subject}
							</div>
						)}
						{Node?.data?.body !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.body) || ""}
							</div>
						)}
					</>
				);

			case "reply_to":
				return (
					<>
						{renderReplySubject() && (
							<div className={styles.show_data_subject}>
								<p>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</p>{" "}
								{renderReplySubject()}
							</div>
						)}
						{Node?.data?.body !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.body) || ""}
							</div>
						)}
					</>
				);
			case "automated_reply_to":
				return (
					<>
						{renderReplySubject() && (
							<div className={styles.show_data_subject}>
								<p>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</p>{" "}
								{renderReplySubject()}
							</div>
						)}
						{Node?.data?.body !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.body) || ""}
							</div>
						)}
					</>
				);

			case "automated_mail":
				return (
					<>
						{Node?.data?.subject !== "" && (
							<div className={styles.show_data_subject}>
								<p>{COMMON_TRANSLATION.SUBJECT[user?.language?.toUpperCase()]}</p>{" "}
								{Node?.data?.subject}
							</div>
						)}
						{Node?.data?.body !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(Node?.data?.body) || ""}
							</div>
						)}
					</>
				);

			case "call":
			case "callback":
				return (
					<>
						{Node?.data?.script !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.script) || ""}
							</div>
						)}
					</>
				);
			case "message":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);

			case "automated_message":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);
			case "linkedin_connection":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);
			case "linkedin_message":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);
			case "linkedin_profile":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);
			case "linkedin_interact":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);
			case "whatsapp":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);
			case "cadence_custom":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);

			case "data_check":
				return (
					<>
						{Node?.data?.message !== "" && (
							<div className={styles.show_data_body}>
								{ReactHtmlParser(node?.data?.message) || ""}
							</div>
						)}
					</>
				);

			case "end":
				return (
					<>
						<EndCadenceView data={Node?.data} />
					</>
				);
			default:
				return null;
		}
	};

	useEffect(() => {
		if (!renderComponent(node)?.props?.children) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}

		if (Array.isArray(renderComponent(node)?.props?.children)) {
			if (
				!renderComponent(node)?.props?.children[0] &&
				!renderComponent(node)?.props?.children[1]
			) {
				setIsActive(true);
			}
		}
	}, [node]);

	return (
		<div className={styles.show_data}>
			{node.Tasks[0]?.metadata && node.Tasks[0]?.metadata?.task_reason?.length ? (
				<>
					<div className={styles.show_data_error}>
						<div>
							<p>Error message</p>
							{node.Tasks[0].metadata.task_reason}
						</div>
					</div>
					<div className={styles.show_data_division} />
				</>
			) : (
				""
			)}
			{renderComponent(node)}
		</div>
	);
};

export default RenderActivityPreview;
