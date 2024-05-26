import { useEffect, useState, useRef, useCallback } from "react";
//components
import TemplateCard from "../TemplateCard/TemplateCard";
// import { LinkedinGradient } from "@cadence-frontend/icons";

//constants
import { isOptionsTop, TEMPLATE_SIDEBAR_OPTIONS, TEMPLATE_TYPES } from "../../constants";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";

import styles from "./WhatsappTemplates.module.scss";
import TemplateSidebar from "../AddOrEditTemplateModal/components/TemplateSidebar/TemplateSidebar";

import Placeholder from "../Placeholder/Placeholder";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import TemplateFilter from "../TemplateFilter/TemplateFilter";
import Loader from "../Loader/Loader";

const WhatsappTemplates = ({
	templates,
	templateLevel,
	setDuplicateModal,
	setTemplate,
	setAddEditModal,
	setDeleteModal,
	setShareModal,
	templateLoading,
	filtersCount,
	addNewDisabled,
	filterProps,
	sidebarState,
	setSidebarState,
	infiniteLoadData,
}) => {
	const { filters, setFilters } = filterProps;
	const [currentTemplate, setCurrentTemplate] = useState(null);

	const { isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } = infiniteLoadData;

	const [tableWidth, setTableWidth] = useState(sidebarState ? "70%" : "100%");
	const user = useRecoilValue(userInfo);

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

	const observer = useRef();
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

	return (
		<div className={styles.whatsappTemplates}>
			{templateLoading ? (
				<Loader compressed={sidebarState} />
			) : templates?.length > 0 ? (
				<div className={styles.tableContainer}>
					<div className={styles.tableHeader}>
						<div className={sidebarState && styles.compressed}>
							<div>
								{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
							</div>
							<div>
								{TEMPLATES_TRANSLATION.TEMPLATE_BODY[user?.language?.toUpperCase()]}
							</div>
							<div>{TEMPLATES_TRANSLATION.CREATED_BY[user?.language?.toUpperCase()]}</div>
							{!sidebarState && (
								<div>{CADENCE_TRANSLATION.ACTIONS[user?.language?.toUpperCase()]}</div>
							)}
						</div>
					</div>
					<table className={styles.table} width={tableWidth}>
						<tbody>
							{templates.map((template, index) => {
								const isLastTemplate = index === templates.length - 1;
								return isLastTemplate ? (
									<>
										<TemplateCard
											ref={templates?.length > 9 ? lastTemplateRef : null}
											template={template}
											setTemplate={setTemplate}
											sidebarState={sidebarState}
											setSidebarState={setSidebarState}
											currentTemplate={currentTemplate}
											setCurrentTemplate={setCurrentTemplate}
											templateLevel={templateLevel}
											setDuplicateModal={setDuplicateModal}
											setShareModal={setShareModal}
											setAddEditModal={setAddEditModal}
											setDeleteModal={setDeleteModal}
											loading={templateLoading}
											type={TEMPLATE_TYPES.WHATSAPP}
											key={template.wt_id}
											handleOnClick={handleOnClick}
											optionsOnTop={isOptionsTop(templates?.length, index)} //for options on top
										/>
										{isFetchingNextPage && <Loader compressed={sidebarState} rows={1} />}
									</>
								) : (
									<TemplateCard
										template={template}
										setTemplate={setTemplate}
										currentTemplate={currentTemplate}
										setCurrentTemplate={setCurrentTemplate}
										sidebarState={sidebarState}
										setSidebarState={setSidebarState}
										templateLevel={templateLevel}
										setDuplicateModal={setDuplicateModal}
										setShareModal={setShareModal}
										setAddEditModal={setAddEditModal}
										setDeleteModal={setDeleteModal}
										loading={templateLoading}
										type={TEMPLATE_TYPES.WHATSAPP}
										key={template.wt_id}
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
					templateLevel={templateLevel}
					onSidebarClose={handleOnClose}
					templateType={TEMPLATE_TYPES.WHATSAPP}
					setTemplate={setTemplate}
					setDuplicateModal={setDuplicateModal}
					setAddEditModal={setAddEditModal}
					setDeleteModal={setDeleteModal}
					setShareModal={setShareModal}
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

export default WhatsappTemplates;
