/* eslint-disable no-console */
import { AuthorizedApi, CallApi } from "../../api";

const sendMessage = body => {
	const URL = `call/v2/ringover/message`;
	return AuthorizedApi({
		method: "POST",
		url: URL,
		data: body,
	}).then(res => res.data);
	// const URL = `/v2/ringover/message`;
	// return CallApi({
	// 	method: "POST",
	// 	url: URL,
	// 	data: body,
	// }).then(res => res.data);
};

export default sendMessage;
