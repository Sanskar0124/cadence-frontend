import { Linkedin, Email, Phone, MessageOutline } from "../../constants";
import moment from "moment-timezone";
import styles from "./CustomTaskModal.module.scss";

export const ACTIONS = {
	CALL: "call",
	CALLBACK: "callback",
	MESSAGE: "message",
	MAIL: "mail",
	LINKEDIN_CONNECTION: "linkedin_connection",
	WHATSAPP: "whatsapp",
};

export const defaultPauseStateFields = {
	DD: moment().format("DD"),
	MM: moment().format("MM"),
	YYYY: moment().format("YYYY"),
};
export const defaultTime = `${moment(new Date()).add(1, "hour").format("HH")}:00`;
