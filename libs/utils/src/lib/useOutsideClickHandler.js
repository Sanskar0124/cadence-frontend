import { useEffect } from "react";

const useOutsideClickHandler = (ref, action, disableOutsideClick, dependencies = []) => {
	useEffect(() => {
		const handleClickOutside = event => {
			if (ref.current && !ref.current.contains(event.target) && !disableOutsideClick) {
				event.stopPropagation();
				action(event);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, ...dependencies]);
};

export default useOutsideClickHandler;
