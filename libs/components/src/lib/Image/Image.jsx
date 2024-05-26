import React, { forwardRef } from "react";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const Image = ({ ...rest }, ref) => {
	return (
		<ErrorBoundary>
			<img alt="img" ref={ref} {...rest} />
		</ErrorBoundary>
	);
};

export default forwardRef(Image);
