import { Modal, Title } from "@cadence-frontend/components";
import { useVideoTemplate } from "@cadence-frontend/data-access";
import { InputThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useState } from "react";
import Input from "../../../Input/Input";
import ThemedButton from "../../../ThemedButton/ThemedButton";
import styles from "./EmbedLinkModal.module.scss";

const EmbedLinkModal = ({
	isModal,
	onClose,
	embedLink,
	mailInput,
	setMailInput,
	signature,
	onAddVideoModalClose,
	thumbnailLink,
	videoId,
}) => {
	const [copied, setCopied] = useState(false);

	const { deleteVideo } = useVideoTemplate();

	const embedVideoLinkHandler = () => {
		if (mailInput.body?.includes(signature?.signature)) {
			setMailInput(prev => ({
				...prev,
				body: prev.body.replace(
					signature.signature,
					`
<div class="video-tracking-img" style="display: block; text-align: center" >
  <a class="video-url" href="${embedLink}">
		<img src="${thumbnailLink}">	
  </a>
</div>

<div style="margin: auto;text-decoration:none;display:block;color:#ffffff;background-color:#3bd6d0;border-radius:4px;width:25%;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:04px;padding-bottom:04px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-align:center;word-break:keep-all" target="_blank">
  <a href="${embedLink}" style="color: #ffffff;">
      <span style="padding-left:04px;padding-right:04px;font-size:16px;display:inline-block;letter-spacing:normal">
        <span dir="ltr" style="word-break:break-word;line-height:32px">
          <strong>Watch now</strong>
        </span>
      </span>
  </a>
</div>
<p>&nbsp;</p>
${signature.signature}
<p>&nbsp;</p>
`
				),
			}));
		} else {
			setMailInput(prev => ({
				...prev,
				body: `${prev.body}<p>&nbsp;</p>
<div class="video-tracking-img" style="display: block; text-align: center" >
  <a class="video-url" href="${embedLink}">
		<img src="${thumbnailLink}">	
  </a>
</div>

<div style="margin: auto;text-decoration:none;display:block;color:#ffffff;background-color:#3bd6d0;border-radius:4px;width:25%;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:04px;padding-bottom:04px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-align:center;word-break:keep-all" target="_blank">
  <a href="${embedLink}" style="color: #ffffff;">
      <span style="padding-left:04px;padding-right:04px;font-size:16px;display:inline-block;letter-spacing:normal">
        <span dir="ltr" style="word-break:break-word;line-height:32px">
          <strong>Watch now</strong>
        </span>
      </span>
  </a>
</div>
<p>&nbsp;</p>
`,
			}));
		}
		onAddVideoModalClose();
	};

	const modalCloseHandler = () => {
		deleteVideo(videoId, {
			onSuccess: data => {
				onClose();
			},
			onError: data => {
				console.log(data);
			},
		});
	};

	return (
		<Modal
			leftCloseIcon
			showCloseButton={true}
			isModal={isModal}
			onClose={modalCloseHandler}
			disableOutsideClick
			className={styles.embedLinkModal}
		>
			<div className={styles.header}>
				<Title size="1rem" className={styles.title}>
					Video Link
				</Title>
				<div className={styles.right}>
					<ThemedButton
						onClick={() => embedVideoLinkHandler()}
						theme={ThemedButtonThemes.TRANSPARENT}
					>
						{" "}
						Embed Video{" "}
					</ThemedButton>
					{/* <ThemedButton
						onClick={() => {
							navigator.clipboard.writeText(embedLink);
							setCopied(true);
						}}
						theme={ThemedButtonThemes.TRANSPARENT}
					>
						{copied ? (
							<>
								<RoundedTick height={16} width={16} />
								Link has been copied
							</>
						) : (
							"Copy"
						)}
					</ThemedButton> */}
				</div>
			</div>
			<div className={styles.body}>
				<Input
					value={embedLink}
					theme={InputThemes.WHITE_WITH_GREY_BORDER}
					className={styles.input}
					disabled
				/>
			</div>
		</Modal>
	);
};

export default EmbedLinkModal;
