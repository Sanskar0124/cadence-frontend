import { useState, useEffect, forwardRef } from "react";
import styles from "./ProgressiveImg.module.scss";
import Skeleton from "../Skeleton/Skeleton";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const ProgressiveImg = ({ src, alt, className, ...rest }, ref) => {
	const [loading, setLoading] = useState("loading");

	useEffect(() => {
		setLoading("loading");
		// const img = new Image();
		// img.src = src;
		// img.onload = () => {
		// 	setTimeout(() => {
		// 		setLoading(false);
		// 	}, 50);
		// };

		const isImgUrl = url => {
			const img = new Image();
			img.src = url;
			return new Promise(resolve => {
				img.onerror = () => resolve(false);
				img.onload = () => resolve(true);
			});
		};

		isImgUrl(src).then(f => setLoading(f));
	}, [src]);

	return (
		<ErrorBoundary>
			<div className={styles.wrapper}>
				{loading === "loading" && (
					<Skeleton className={`${styles.placeholder} ${className ?? ""}`} />
				)}
				<img
					ref={ref}
					src={
						loading
							? src
							: "https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/sub-department-images/earth.svg"
					}
					alt={alt ?? ""}
					className={`${className ?? ""}`}
					style={{ display: "block" }}
					{...rest}
				/>
			</div>
		</ErrorBoundary>
	);
};

export default forwardRef(ProgressiveImg);
