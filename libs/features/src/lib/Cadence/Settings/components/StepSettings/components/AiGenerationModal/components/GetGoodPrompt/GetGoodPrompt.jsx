import React from "react";
import styles from "./GetGoodPrompt.module.scss";

const GetGoodPrompt = () => {
	return (
		<div className={styles.promptInfo}>
			<p className={styles.header}>
				<span role="img" aria-label="icon">
					{" "}
					👉{" "}
				</span>
				How to write a good prompt:
			</p>

			<li>
				Clearly state your goal, for example, you can say, "Write a persuasive email to
				get product demos from potential customers."
			</li>
			<li>
				{" "}
				Provide AI with as much information as you can, including your unique selling
				points and any other crucial details.
			</li>
			<li>
				If you have specific preferences for the style or length, be sure to mention them.
			</li>
			<li>
				Keep your instructions simple and avoid using complicated jargon that might
				confuse AI.
			</li>
		</div>
	);
};

export default GetGoodPrompt;
