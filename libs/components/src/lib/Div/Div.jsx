/* eslint-disable react/jsx-no-useless-fragment */
import { forwardRef } from "react";
import styles from "./Div.module.scss";
import Skeleton from "../Skeleton/Skeleton";
import Spinner from "../Spinner/Spinner";

const Div = forwardRef(
	(
		{
			loading,
			className,
			loaderStyles,
			children,
			loader = "skeleton",
			span = false,
			...rest
		},
		ref
	) => {
		if (!span)
			return (
				<div
					ref={ref}
					className={`${styles.modifiedDiv} ${className ?? ""} ${
						loading ? styles.loading : ""
					}`}
					{...rest}
				>
					{loading &&
						(loader === "skeleton" ? (
							<Skeleton className={styles.loader} styles={loaderStyles ?? {}} />
						) : (
							<Spinner className={styles.spinner} styles={loaderStyles ?? {}} />
						))}
					{children ?? " "}
				</div>
			);
		else
			return (
				<span
					ref={ref}
					className={`${styles.modifiedDiv} ${className ?? ""} ${
						loading ? styles.loading : ""
					}`}
					{...rest}
				>
					{loading &&
						(loader === "skeleton" ? (
							<Skeleton className={styles.loader} styles={loaderStyles ?? {}} />
						) : (
							<Spinner className={styles.spinner} styles={loaderStyles ?? {}} />
						))}
					{children ?? " "}
				</span>
			);
	}
);

export default Div;
