import { forwardRef } from "react";
import { Spinner } from "@cadence-frontend/components";

import styles from "./Button.module.scss";

const Button = forwardRef(
	(
		{
			children,
			loading,
			loadingText,
			spinnerClassName = "",
			btnheight = "",
			btnwidth = "100%",
			style,
			...rest
		},
		ref
	) => {
		return (
			<>
				{/* <Spinner/> */}
				<button
					ref={ref}
					{...rest}
					style={{ height: btnheight, width: btnwidth, ...style }}
				>
					{loading && loadingText ? (
						<div className={styles.wrapper}>
							<Spinner className={spinnerClassName} /> <p>{loadingText}</p>
						</div>
					) : loading ? (
						<div>
							<Spinner className={spinnerClassName} />
						</div>
					) : (
						children
					)}
				</button>
			</>
		);
	}
);

export default Button;
