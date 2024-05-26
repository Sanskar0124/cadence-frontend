import { isMissedCall } from "libs/utils/src/lib/renderActivityIcon";

const FEEDSUBTEXT = {
	MAIL_SUBTEXT: {
		ENGLISH: "Subject: ",
		FRENCH: "Sujette: ",
		SPANISH: "Sujeta: ",
	},
};

// ACTIVITY_TYPE.MAIL
// ACTIVITY_TYPE.REPLY_TO
// ACTIVITY_TYPE.MESSAGE
// ACTIVITY_TYPE.CLICKED_MAIL
// ACTIVITY_TYPE.VIEWED_MAIL
// ACTIVITY_TYPE.HOT_LEAD
// ACTIVITY_TYPE.CALL -> name-> name should include this text-> 'missed a call',
// ACTIVITY_TYPE.UNSUBSCRIBE
// ACTIVITY_TYPE.BOUNCED_MAIL

const getWordsAfter = (sentence, targetWord) => {
	const words = sentence.split(" ");
	const targetIndex = words.indexOf(targetWord);
	if (targetIndex === -1) {
		return [];
	}

	const wordsAfter = words.slice(targetIndex + 1);
	return wordsAfter.join(" ");
};

const removeSubjectREPrefix = sentence => {
	const regex = /^Subject:\s*Re:\s*/i;
	const result = sentence.replace(regex, "");
	return result.trim();
};

const removeSubjectPrefix = sentence => {
	const regex = /^Subject:\s*/i;
	const result = sentence.replace(regex, "");
	return result.trim();
};

const isReceivedCall = activity => {
	if (activity.recording && activity.name.startsWith("You received")) return true;
	return false;
};

const isRejectedCall = activity => {
	if (activity.name.startsWith("You rejected a call")) return true;
	return false;
};

const isMessageReceived = activity => {
	if (activity.name.startsWith("Message recieved")) return true;
	return false;
};

export const getTranslateSubtext = activity => {
	switch (activity.type) {
		case "mail":
			if (activity.name.startsWith("Received email")) {
				return {
					ENGLISH: `Subject: ${removeSubjectPrefix(activity?.status)}`,
					FRENCH: `Sujette: ${removeSubjectPrefix(activity?.status)}`,
					SPANISH: `Sujeta: ${removeSubjectPrefix(activity?.status)}`,
				};
			} else if (activity.name.startsWith("Sent email")) {
				return {
					ENGLISH: `Subject: ${activity?.status}`,
					FRENCH: `Sujette:  ${activity?.status}`,
					SPANISH: `Sujeta:  ${activity?.status}`,
				};
			} else {
				return {
					ENGLISH: `Subject: `,
					FRENCH: `Sujette: `,
					SPANISH: `Sujeta: `,
				};
			}

		case "hot_lead":
			return {
				ENGLISH: `${activity?.Lead?.full_name} is now a hot lead`,
				FRENCH: `${activity?.Lead?.full_name} est maintenant une piste chaude`,
				SPANISH: `${activity?.Lead?.full_name} es ahora una pista candente`,
			};

		case "bounced_mail":
			return {
				ENGLISH: "The Email has bounced",
				FRENCH: "L'e-mail a rebondi",
				SPANISH: "El correo electrónico ha rebotado",
			};

		case "unsubscribe":
			return {
				ENGLISH: `The lead has unsubscribed from ${getWordsAfter(
					activity?.status,
					"from"
				)}`,
				FRENCH: `Le prospect s'est désabonné de ${getWordsAfter(
					activity?.status,
					"from"
				)}`,
				SPANISH: `El cliente potencial se ha dado de baja de ${getWordsAfter(
					activity?.status,
					"from"
				)}`,
			};

		case "viewed_mail":
			return {
				ENGLISH: "The lead has opened the mail",
				FRENCH: "Le prospect a ouvert le courrier",
				SPANISH: "El cliente potencial ha abierto el correo",
			};

		case "clicked_mail":
			return {
				ENGLISH: "The lead has clicked the mail",
				FRENCH: "Le prospect a cliqué sur l'e-mail",
				SPANISH: "El cliente potencial ha hecho clic en el correo",
			};

		case "clicked_message":
			return {
				ENGLISH: "The lead has clicked the message",
				FRENCH: "Le lead a cliqué sur le message",
				SPANISH: "El cliente potencial ha hecho clic en el mensaje.",
			};

		case "call":
			if (isMissedCall(activity)) {
				return {
					ENGLISH: `You missed a call from ${activity?.from_number ?? ""}`,
					FRENCH: `Vous avez manqué un appel du ${activity?.from_number ?? ""}`,
					SPANISH: `Perdiste una llamada del ${activity?.from_number ?? ""}`,
				};
			} else if (isReceivedCall(activity)) {
				return {
					ENGLISH: `You received a call from ${activity?.from_number ?? ""}`,
					FRENCH: `Vous avez reçu un appel du ${activity?.from_number ?? ""}`,
					SPANISH: `Recibiste una llamada del ${activity?.from_number ?? ""}`,
				};
			} else if (isRejectedCall(activity)) {
				return {
					ENGLISH: `You rejected a call from ${activity?.from_number ?? ""}`,
					FRENCH: `Vous avez rejeté un appel du ${activity?.from_number ?? ""}`,
					SPANISH: `Has rechazado una llamada del ${activity?.from_number ?? ""}`,
				};
			} else {
				return {
					ENGLISH: ` ${activity?.status}`,
					FRENCH: ` ${activity?.status}`,
					SPANISH: ` ${activity?.status}`,
				};
			}

		case "message":
			return {
				ENGLISH: ` ${activity?.status}`,
				FRENCH: ` ${activity?.status}`,
				SPANISH: ` ${activity?.status}`,
			};

		case "reply_to":
			return {
				ENGLISH: `Subject: ${removeSubjectREPrefix(activity?.status)}`,
				FRENCH: `Sujette: ${removeSubjectREPrefix(activity?.status)}`,
				SPANISH: `Sujeta: ${removeSubjectREPrefix(activity?.status)}`,
			};
	}
};
