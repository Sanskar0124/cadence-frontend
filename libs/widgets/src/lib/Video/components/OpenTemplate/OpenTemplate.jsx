import { useTemplate } from "@cadence-frontend/data-access";
import {
	TabNavBtnThemes,
	TabNavThemes,
	ThemedButtonThemes,
} from "@cadence-frontend/themes";
import { Modal } from "@cadence-frontend/components";
import { ThemedButton, TabNavSlider, SearchBar } from "@cadence-frontend/widgets";
import Loader from "../OpenTemplate/components/Loader/Loader";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./OpenTemplate.module.scss";
import { TemplateSidebarPlayer } from "@cadence-frontend/widgets";
import {
	TEMPLATE_LEVELS,
	TEMPLATE_LEVELS_ICONS,
	TEMPLATE_LEVELS_LABELS,
} from "./constants";
import TemplateCard from "../OpenTemplate/components/TemplateCard/TemplateCard";

const OpenTemplate = ({
	onClose,
	isModal,
	videoModalClose,
	user,
	mailInput,
	setMailInput,
	signature,
}) => {
	const [showVideoPlayer, setShowVideoPlayer] = useState(false);
	const [videoSrc, setVideoSrc] = useState(null);
	const [videoDuration, setVideoDuration] = useState(null);
	const [selected, setSelected] = useState(null);
	const [templateLevel, setTemplateLevel] = useState(TEMPLATE_LEVELS.USER);
	const [searchValue, setSearchValue] = useState("");

	const closeButtonHandler = () => {
		setShowVideoPlayer(false);
	};

	const observer = useRef();
	const templateType = "video";
	// const templateLevel = "personal";

	const {
		isFetching,
		isFetchingNextPage,
		templates: templatesData,
		templateLoading,
		hasNextPage,
	} = useTemplate({
		templateLevel,
		templateType,
	});

	const useTemplateHandler = () => {
		if (mailInput.body?.includes(signature?.signature)) {
			setMailInput(prev => ({
				...prev,
				body: prev.body.replace(
					signature.signature,
					`
<p>&nbsp;</p>
<div class="video-tracking-img" style="display: block; text-align: center" >
  <a style="text-align: center;" class="video-url" href="${selected?.Video?.video_url}&vt_id=${selected?.vt_id}">
    <img style="display:inline-block; " src="${selected?.Video?.thumbnail_url}" />
  </a>
</div>

<div style="margin: auto;text-decoration:none;display:block;color:#ffffff;background-color:#3bd6d0;border-radius:4px;width:25%;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:04px;padding-bottom:04px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-align:center;word-break:keep-all" target="_blank">
  <a href="${selected?.Video?.video_url}&vt_id=${selected?.vt_id}" style="color: #ffffff;">
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
				body: `
${prev.body} <p>&nbsp;</p>
<div class="video-tracking-img" style="display: block; text-align: center" >
  <a style="text-align: center;" class="video-url" href="${selected?.Video?.video_url}&vt_id=${selected?.vt_id}">
    <img style="display:inline-block; " src="${selected?.Video?.thumbnail_url}" />
  </a>
</div>

<div style="margin: auto;text-decoration:none;display:block;color:#ffffff;background-color:#3bd6d0;border-radius:4px;width:25%;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:04px;padding-bottom:04px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-align:center;word-break:keep-all" target="_blank">
  <a href="${selected?.Video?.video_url}&vt_id=${selected?.vt_id}" style="color: #ffffff;">
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
		onClose();
		videoModalClose();
	};

	const lastTemplateRef = useCallback(
		template => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (template) observer.current.observe(template);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	useEffect(() => {
		closeButtonHandler();
		setSelected(null);
	}, [templateLevel]);

	return (
		<Modal
			isModal={isModal}
			onClose={onClose}
			disableOutsideClick
			className={styles.openTemplate}
		>
			<div className={styles.headerwrapper}>
				<div className={styles.header}>
					<ThemedButton
						onClick={onClose}
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
					>
						Back
					</ThemedButton>
					<h3>Templates</h3>
					<ThemedButton
						onClick={() => useTemplateHandler()}
						width="fit-content"
						theme={ThemedButtonThemes.TRANSPARENT}
						disabled={selected === null}
					>
						Use Template
					</ThemedButton>
				</div>
				<div className={styles.templateFilters}>
					<TabNavSlider
						theme={TabNavThemes.WHITE}
						btnTheme={TabNavBtnThemes.PRIMARY_AND_WHITE}
						buttons={Object.keys(TEMPLATE_LEVELS).map(level => ({
							label: (
								<>
									{TEMPLATE_LEVELS_ICONS[level]}{" "}
									{TEMPLATE_LEVELS_LABELS[level][user?.language?.toUpperCase()]}
								</>
							),
							value: TEMPLATE_LEVELS[level],
						}))}
						value={templateLevel}
						setValue={setTemplateLevel}
						width="800px"
						className={styles.tabs}
						btnClassName={styles.tabBtns}
						activeBtnClassName={styles.tabBtnActive}
						activePillClassName={styles.activePill}
					/>
					<SearchBar
						width="800px"
						height="40px"
						value={searchValue}
						setValue={setSearchValue}
						className={styles.searchBar}
					/>
				</div>
			</div>

			{!templateLoading ? (
				<>
					{templatesData?.length > 0 ? (
						<>
							<div className={styles.player}>
								{showVideoPlayer && (
									<TemplateSidebarPlayer
										showCloseButton={true}
										leftCloseIcon={true}
										onClose={closeButtonHandler}
										height={450}
										width={750}
										videosrc={videoSrc}
										duration={videoDuration}
										templateLevel={templateLevel}
									/>
								)}
							</div>
							<div className={styles.list}>
								{templatesData
									?.filter(template =>
										template?.name?.toLowerCase()?.includes(searchValue?.toLowerCase())
									)
									.map((data, index) => {
										const isLastItem = index === templatesData.length - 1;
										return isLastItem ? (
											<>
												<TemplateCard
													data={data}
													setVideoSrc={setVideoSrc}
													setShowVideoPlayer={setShowVideoPlayer}
													setVideoDuration={setVideoDuration}
													selected={selected}
													setSelected={setSelected}
													ref={lastTemplateRef}
												/>

												{isFetchingNextPage && <Loader />}
											</>
										) : (
											<TemplateCard
												data={data}
												setVideoSrc={setVideoSrc}
												setShowVideoPlayer={setShowVideoPlayer}
												setVideoDuration={setVideoDuration}
												selected={selected}
												setSelected={setSelected}
											/>
										);
									})}
							</div>
						</>
					) : (
						<>
							<h1 className={styles.fallback}>No Templates Found</h1>
						</>
					)}
				</>
			) : (
				<>
					<Loader />
					<Loader />
					<Loader />
					<Loader />
				</>
			)}
		</Modal>
	);
};

export default OpenTemplate;
