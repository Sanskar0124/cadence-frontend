import { useEffect, useState } from "react";

const useCookie = () => {
	const [cookie, setCookie] = useState(null);

	useEffect(() => {
		const getCookie = async () => {
			await document?.cookies?.get(
				{ url: "https://www.linkedin.com", name: "li_at" },
				cookie => {
					if (!cookie) setCookie(null);
					else setCookie(cookie.value);
				}
			);
		};
		getCookie();
	}, []);

	return [cookie, setCookie];
};

export default useCookie;
