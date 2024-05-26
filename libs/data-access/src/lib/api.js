import { ENV } from "@cadence-frontend/environments";
import axios from "axios";

export const AuthorizedApi = axios.create({
	baseURL: ENV.BACKEND,
	headers: {
		Authorization: `Bearer ${
			JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.ringover_tokens?.id_token
		}`,
		"Content-type": "application/json",
	},
});

AuthorizedApi.interceptors.request.use(config => {
	// Modify the request config
	config.headers.Authorization = `Bearer ${
		JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.ringover_tokens?.id_token
	}`;
	return config;
});

export const CalendarApi = axios.create({
	baseURL: `http://localhost:8009`,
	headers: {
		Authorization: `Bearer ${
			JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.ringover_tokens?.id_token
		}`,
		"Content-type": "application/json",
	},
});

export const MailApi = axios.create({
	baseURL: `http://localhost:8013/mail`,
	headers: {
		Authorization: `Bearer ${
			JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.ringover_tokens?.id_token
		}`,
		"Content-type": "application/json",
	},
});

export const CallApi = axios.create({
	baseURL: `http://localhost:8011/`,
	headers: {
		Authorization: `Bearer ${
			JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.ringover_tokens?.id_token
		}`,
		"Content-type": "application/json",
	},
});

export const PublicApi = axios.create({
	baseURL: ENV.BACKEND,
	headers: {
		"Content-type": "application/json",
	},
});
