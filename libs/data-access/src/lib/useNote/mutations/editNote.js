/* eslint-disable no-console */
import React from "react";
import { AuthorizedApi } from "../../api";

const editNote = async ({ note_id, value }) => {
	try {
		const url = `v1/sales/lead/note/${note_id}`;
		const res = await AuthorizedApi({
			method: "PUT",
			url: url,
			data: value,
		});

		return res.data;
	} catch (err) {
		console.group("Error occured in edit note");
		console.log(err);
		console.groupEnd();
	}
};

export default editNote;
