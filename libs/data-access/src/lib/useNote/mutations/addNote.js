/* eslint-disable no-console */
import React from "react";
import { AuthorizedApi } from "../../api";

const createNote = async body =>
	AuthorizedApi.post("v2/sales/lead/note", body).then(res => res.data.data);
export default createNote;
