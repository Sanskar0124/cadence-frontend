import { useState, createContext, useEffect } from "react";
import { nanoid } from "nanoid";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
	const [errorsArray, setErrorsArray] = useState([]);
	const [successArray, setSuccessArray] = useState([]);
	const [warningsArray, setWarningsArray] = useState([]);
	const [confirmMessage, setConfirmMessage] = useState([]);
	const [stepChangeable, setStepChangeable] = useState(true);

	const addSuccess = (text, isDeleted = false) => {
		const newSuccess = {
			id: nanoid(10),
			text,
			isDeleted,
		};
		setSuccessArray(prev => [...prev, newSuccess]);
	};

	const removeSuccess = id => {
		setSuccessArray(prev => prev.filter(success => success.id !== id));
	};

	const addError = ({
		text = "Unknown error occured, please try again later",
		desc = "",
		cId = "",
		onClick = null,
	}) => {
		if (text?.includes("invalid_grant")) text = "Please login with Google";
		let newError = {
			id: nanoid(10),
			text,
			...(desc !== undefined && desc?.length > 0 && { description: desc }),
			...(cId !== "" && cId !== undefined && { correlationId: cId }),
			onClick,
		};
		// setErrorsArray(prev => [...prev, newError]);
		setErrorsArray(prev => {
			if (prev.filter(i => i.text.localeCompare(text) === 0).length === 0) {
				return [...prev, newError];
			} else return prev;
		});
	};

	const removeError = id => {
		setErrorsArray(prev => prev.filter(error => error.id !== id));
	};

	const addWarning = text => {
		if (text.includes("invalid_grant")) text = "Please login with Google";
		let newError = {
			id: nanoid(10),
			text,
		};
		setWarningsArray(prev => {
			if (prev.filter(i => i.text.localeCompare(text) === 0).length === 0) {
				return [...prev, newError];
			} else return prev;
		});
	};

	const removeWarning = id => {
		setWarningsArray(prev => prev.filter(error => error.id !== id));
	};

	const addConfirmMessage = obj => {
		setConfirmMessage(prev =>
			prev.filter(item => item.type === obj.type).length === 0 ? [...prev, obj] : prev
		);
	};
	const removeConfirmMessage = type => {
		setConfirmMessage(prev => prev.filter(item => item.type !== type));
	};
	return (
		<MessageContext.Provider
			value={{
				errorsArray,
				setErrorsArray,
				addError,
				removeError,
				successArray,
				setSuccessArray,
				addSuccess,
				removeSuccess,
				warningsArray,
				setWarningsArray,
				addWarning,
				removeWarning,
				confirmMessage,
				addConfirmMessage,
				removeConfirmMessage,
				stepChangeable,
				setStepChangeable,
			}}
		>
			{children}
		</MessageContext.Provider>
	);
};

export default MessageProvider;
