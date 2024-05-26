import { useState } from "react";
import { AuthorizedApi } from "./api";
import { useQuery } from "react-query";
import { AttachmentToFile, parseFetchedEmail } from "@cadence-frontend/utils";
import * as DOMPurify from "dompurify";

const useEmail = ({ message_id = 0 }, addError, addSuccess) => {
	const [mailInput, setMailInput] = useState({
		subject: "",
		body: "",
		cc: "",
		bcc: "",
		to: "",
		from: "",
		cadence_id: 0,
		node_id: 0,
		lead_id: "",
	});
	const [isTokenExpired, setIsTokenExpired] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const [isProhibited, setIsProhibited] = useState(false);
	const [sendLoading, setSendLoading] = useState(false);
	const [sendError, setSendError] = useState("");
	const [sendSuccess, setSendSuccess] = useState("");
	const [generateLinkError, setGenerateLinkError] = useState("");
	const [toReplyMailState, setToReplyMailState] = useState(false);
	const [toReplyLoading, setToReplyLoading] = useState(false);
	const [toReplyError, setToReplyError] = useState(false);

	const getEmail = async ({ queryKey }) => {
		const message_id = queryKey[1];
		return await AuthorizedApi.get(`/mail/v2/get/${message_id}`).then(
			res => res.data.data
		);
	};

	const {
		data: fetchedMailData,
		isLoading: loadingMail,
		isError: fetchError,
		refetch: refetchMail,
	} = useQuery(["fetchMail", message_id], getEmail, {
		enabled: false,
		select: data => {
			return parseFetchedEmail(data);
		},
		onError: err => {
			if (err.response) {
				if (err.response.status === 404) setIsDeleted(true);
				else if (err.response.status === 403) setIsProhibited(true);
				else if (err.response.status === 440 || err.response.status === 400)
					setIsTokenExpired(true);
			}
		},
	});

	const getReplyMail = async ({ lead_id, node_id }) => {
		setToReplyLoading(true);
		setToReplyError("");
		try {
			const res = await AuthorizedApi.get(`/mail/v2/getreplymail/${lead_id}/${node_id}`);
			setToReplyMailState(parseFetchedEmail(res.data.data));
		} catch (err) {
			const GOOGLE_INVALID_TOKEN_MSG = "Sign In with Google to access this feature";
			const OUTLOOK_INVALID_TOKEN_MSG = "Sign In with Outlook to access this feature";
			if (
				err?.response?.status === 400 ||
				err?.response?.status === 440 ||
				err?.response?.status === 401
			) {
				const msg = err?.response?.data?.msg;
				if (
					msg?.toLowerCase()?.includes("limit exceed") ||
					msg?.toLowerCase()?.includes("timezone") ||
					msg?.toLowerCase()?.includes("empty body received")
				)
					setToReplyError(err?.response?.data?.msg);
				else if (msg === GOOGLE_INVALID_TOKEN_MSG || msg === OUTLOOK_INVALID_TOKEN_MSG)
					setIsTokenExpired(true);
				else setToReplyError("An unknown error occured, please try later");
			}
		} finally {
			setToReplyLoading(false);
		}
	};

	const sendEmail = async (files, validateTask, templateId, cb) => {
		setSendLoading(true);
		setSendError("");
		setIsTokenExpired(false);

		try {
			delete mailInput?.attachments;

			let form = {
				isTask: validateTask ? true : false,
				semi_automated_mail: mailInput.cadence_id ? true : false,
				attachments: files,
				ab_template_id: templateId,
				...mailInput,
			};

			// form.body = DOMPurify.sanitize(form.body);
			if (!templateId) delete form.ab_template_id;
			if (!form.timeStamp) delete form.timeStamp;
			if (!form.from_full_name) delete form.from_full_name;

			await AuthorizedApi.post("/mail/v2/send", {
				...form,
				body: DOMPurify.sanitize(form.body),
			});

			setMailInput(prev => ({
				...prev,
				body: "",
				subject: "",
				cc: "",
			}));
			setSendSuccess("Sent Successfully");

			if (cb && typeof cb === "function") await cb();
		} catch (err) {
			const GOOGLE_INVALID_TOKEN_MSG = "Sign In with Google to access this feature";
			const OUTLOOK_INVALID_TOKEN_MSG = "Sign In with Outlook to access this feature";
			if (
				err?.response?.status === 400 ||
				err?.response?.status === 440 ||
				err?.response?.status === 401
			) {
				const msg = err?.response?.data?.msg;
				if (
					msg?.toLowerCase()?.includes("limit exceed") ||
					msg?.toLowerCase()?.includes("timezone") ||
					msg?.toLowerCase()?.includes("empty body recieved")
				)
					setSendError(err?.response?.data);
				else if (msg === GOOGLE_INVALID_TOKEN_MSG || msg === OUTLOOK_INVALID_TOKEN_MSG)
					setIsTokenExpired(true);
				else setSendError(err?.response?.data);
			}
		} finally {
			setSendLoading(false);
		}
	};

	const sendReply = async ({ files, cb, toReplyMailState, validateTask, templateId }) => {
		setSendLoading(true);
		setSendError("");
		setIsTokenExpired(false);
		try {
			delete mailInput?.attachments;

			let form = {
				isTask: validateTask ? true : false,
				semi_automated_mail: mailInput.cadence_id ? true : false,
				attachments: files,
				message: JSON.stringify(toReplyMailState),
				ab_template_id: templateId,
				...mailInput,
			};
			if (!templateId) delete form.ab_template_id;
			if (!form.timeStamp) delete form.timeStamp;
			if (!form.from_full_name) delete form.from_full_name;

			delete toReplyMailState?.cc;
			delete toReplyMailState?.bcc;

			await AuthorizedApi.post("/mail/v2/reply", {
				...form,
				body: DOMPurify.sanitize(form.body),
			});

			setMailInput(prev => ({
				...prev,
				body: "",
				subject: "",
				cc: "",
				generatedLinks: "",
			}));
			setSendSuccess("Sent Successfully");
			if (cb && typeof cb === "function") cb();
		} catch (err) {
			if (err?.response?.status === 400 || err?.response?.status === 440) {
				const msg = err?.response?.data?.msg;
				if (
					msg?.toLowerCase()?.includes("limit exceed") ||
					msg?.toLowerCase()?.includes("timezone")
				)
					setSendError(err?.response?.data);
				else setIsTokenExpired(true);
			}
		} finally {
			setSendLoading(false);
		}
	};

	const generateCustomLink = async (body, cb) => {
		setSendLoading(true);
		setGenerateLinkError("");
		try {
			const URL = `/v1/link_store/getShortenedLink`;
			const response = await AuthorizedApi(URL, body);
			const data = response.data;
			if (response.status - 200 >= 0 && response.status - 200 <= 99) {
				throw new Error(data.msg || "Error in generating link");
			}
			if (cb && typeof cb === "function") cb(data.data);
		} catch (err) {
			setGenerateLinkError(err.message);
		} finally {
			setSendLoading(false);
		}
	};

	return {
		fetchedMailData,
		refetchMail,
		loadingMail,
		fetchError,
		mailInput,
		setMailInput,
		isTokenExpired,
		setIsTokenExpired,
		sendLoading,
		sendError,
		sendSuccess,
		sendEmail,
		sendReply,
		generateCustomLink,
		generateLinkError,
		isDeleted,
		setIsDeleted,
		isProhibited,
		setIsProhibited,
		getReplyMail,
		setToReplyMailState,
		toReplyMailState,
		toReplyLoading,
		setSendSuccess,
	};
};

export default useEmail;
