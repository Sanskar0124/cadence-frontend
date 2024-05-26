import { MailGradient } from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { isOptionsTop } from "../../constants";
import { TEMPLATE_SIDEBAR_OPTIONS, TEMPLATE_TYPES } from "@cadence-frontend/constants";
import Loader from "../Loader/Loader";
import {
	Cadence as CADENCE_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";
import TemplateCard from "../TemplateCard/TemplateCard";
import styles from "./VideoTemplates.module.scss";
import Placeholder from "../Placeholder/Placeholder";
import TemplateSidebar from "../AddOrEditTemplateModal/components/TemplateSidebar/TemplateSidebar";
import TemplateFilter from "../TemplateFilter/TemplateFilter";
const VideoTemplates = ({
	templates,
	templateLevel,
	setTemplate,
	setAddEditModal,
	setDuplicateModal,
	setShareModal,
	setDeleteModal,
	templateLoading,
	addNewDisabled,
	sidebarState,
	setSidebarState,
	infiniteLoadData,
	filterProps,
	filtersCount,
}) => {
	const user = useRecoilValue(userInfo);
	const { filters, setFilters } = filterProps;
	const [currentTemplate, setCurrentTemplate] = useState(null);
	const [tableWidth, setTableWidth] = useState(sidebarState ? "70%" : "100%");

	const { isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } = infiniteLoadData;

	useEffect(() => {
		setSidebarState(null);
	}, [templateLevel]);

	useEffect(() => {
		sidebarState ? setTableWidth("70%") : setTableWidth("100%");
	}, [sidebarState]);

	const handleOnClick = () => {
		setSidebarState(TEMPLATE_SIDEBAR_OPTIONS.TEMPLATE_DATA);
	};

	const handleOnClose = () => {
		setSidebarState(null);
	};

	const handleFilterClose = () => {
		setSidebarState(null);
	};

	const observerRef = useRef();
	const lastTemplateRef = useCallback(
		template => {
			if (isFetchingNextPage || isFetching) return;
			if (observerRef.current) observerRef.current.disconnect();
			observerRef.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
			});
			if (template) observerRef.current.observe(template);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	return (
		<div className={styles.videoTemplates}>
			{templateLoading ? (
				<Loader compressed={sidebarState} />
			) : templates?.length > 0 ? (
				<div className={styles.tableContainer}>
					<div className={styles.tableHeader}>
						<div className={sidebarState && styles.compressed}>
							<div>
								{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
							</div>
							{!sidebarState && (
								<div>
									{TEMPLATES_TRANSLATION.VIDEO_LINK[user?.language?.toUpperCase()]}
								</div>
							)}
							<div>{TEMPLATES_TRANSLATION.CREATED_BY[user?.language?.toUpperCase()]}</div>
							<div>{TEMPLATES_TRANSLATION.STATS[user?.language?.toUpperCase()]}</div>
							{!sidebarState && (
								<div>{CADENCE_TRANSLATION.ACTIONS[user?.language?.toUpperCase()]}</div>
							)}
						</div>
					</div>
					<table className={styles.table} width={tableWidth}>
						<tbody>
							{templates?.map((template, index) => {
								const isLastTemplate = index === templates.length - 1;

								return isLastTemplate ? (
									<>
										<TemplateCard
											ref={templates?.length > 9 ? lastTemplateRef : null}
											template={template}
											setTemplate={setTemplate}
											currentTemplate={currentTemplate}
											setCurrentTemplate={setCurrentTemplate}
											templateLevel={templateLevel}
											setDuplicateModal={setDuplicateModal}
											setAddEditModal={setAddEditModal}
											setDeleteModal={setDeleteModal}
											setShareModal={setShareModal}
											type={TEMPLATE_TYPES.VIDEO}
											loading={templateLoading}
											key={template.et_id}
											handleOnClick={handleOnClick}
											optionsOnTop={isOptionsTop(templates?.length, index)} //for options on top
											sidebarState={sidebarState}
											setSidebarState={setSidebarState}
										/>
										{isFetchingNextPage && <Loader compressed={sidebarState} rows={1} />}
									</>
								) : (
									<TemplateCard
										template={template}
										setTemplate={setTemplate}
										sidebarState={sidebarState}
										setSidebarState={setSidebarState}
										currentTemplate={currentTemplate}
										setCurrentTemplate={setCurrentTemplate}
										templateLevel={templateLevel}
										setDuplicateModal={setDuplicateModal}
										setAddEditModal={setAddEditModal}
										setDeleteModal={setDeleteModal}
										setShareModal={setShareModal}
										loading={templateLoading}
										type={TEMPLATE_TYPES.VIDEO}
										key={template.et_id}
										handleOnClick={handleOnClick}
										optionsOnTop={isOptionsTop(templates?.length, index)} //for options on top
									/>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<Placeholder
					setAddEditModal={setAddEditModal}
					addNewDisabled={addNewDisabled}
					width={sidebarState ? "69.25%" : "100%"}
					user={user}
				/>
			)}
			<div className={`${styles.sidevar} ${sidebarState ? styles.open : styles.close}`}>
				<TemplateSidebar
					sidebarState={sidebarState}
					template={currentTemplate}
					onSidebarClose={handleOnClose}
					templateType={TEMPLATE_TYPES.VIDEO}
					templateLevel={templateLevel}
					setTemplate={setTemplate}
					setShareModal={setShareModal}
					setDuplicateModal={setDuplicateModal}
					setAddEditModal={setAddEditModal}
					setDeleteModal={setDeleteModal}
				/>
				{sidebarState === TEMPLATE_SIDEBAR_OPTIONS.FILTER && (
					<TemplateFilter
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
						handleFilterClose={handleFilterClose}
						filters={filters}
						setFilters={setFilters}
						templateLevel={templateLevel}
						filtersCount={filtersCount}
					/>
				)}
			</div>
		</div>
	);
};

export default VideoTemplates;
