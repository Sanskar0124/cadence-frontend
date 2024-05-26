/* eslint-disable no-console */
import React from "react";
import { AuthorizedApi } from "../../api";

const getNote = async note_id => {
	try {
		const url = `v1/sales/lead/note/${note_id}`;
		const res = await AuthorizedApi({
			method: "GET",
			url: url,
		});

		return res.data;
	} catch (err) {
		console.group("Error occured in getting Note");
		console.log(err);
		console.groupEnd();
	}
};

export default getNote;
