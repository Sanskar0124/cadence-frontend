import { ENV } from "@cadence-frontend/environments";
import { useState } from "react";
import { useMutation } from "react-query";
import { AuthorizedApi } from "../../lib/api";

const useLogin = () => {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const login = async (body, cb) => {
		setError("");
		setLoading(true);
		try {
			const url = `${ENV.BACKEND}/v1/user/auth/login`;
			const res = await fetch(url, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.msg || "Some error occured, please try again");
			if (cb && typeof cb === "function") cb(data.data);
		} catch (err) {
			setError(
				err.message === "Failed to fetch"
					? "We are having some trouble, please check back in sometime"
					: err.message
			);
		} finally {
			setLoading(false);
		}
	};

	const sendResetPasswordLinkApi = email =>
		AuthorizedApi.post(`/v2/user/forgot-password`, { email }).then(res => res.data);

	const { mutate: sendResetPasswordLink, isLoading: sendResetPasswordLinkLoading } =
		useMutation(sendResetPasswordLinkApi, {});

	return { error, loading, login, sendResetPasswordLink, sendResetPasswordLinkLoading };
};

export default useLogin;
