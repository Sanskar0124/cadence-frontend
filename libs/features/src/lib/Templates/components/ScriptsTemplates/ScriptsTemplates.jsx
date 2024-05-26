import { useEffect, useState, useRef, useCallback } from "react";
//components
import TemplateCard from "../TemplateCard/TemplateCard";
import { PhoneGradient } from "@cadence-frontend/icons";

//constants
import { isOptionsTop, TEMPLATE_SIDEBAR_OPTIONS, TEMPLATE_TYPES } from "../../constants";

import styles from "./ScriptsTemplates.module.scss";
import TemplateSidebar from "../AddOrEditTemplateModal/components/TemplateSidebar/TemplateSidebar";

import Placeholder from "../Placeholder/Placeholder";
import {
	Cadence as CADENCE_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import Loader from "../Loader/Loader";
import TemplateFilter from "../TemplateFilter/TemplateFilter";

const ScriptsTemplates = ({
	templates,
	templateLevel,
	setDuplicateModal,
	setTemplate,
	setShareModal,
	setAddEditModal,
	setDeleteModal,
	templateLoading,
	addNewDisabled,
	filterProps,
	sidebarState,
	setSidebarState,
	infiniteLoadData,
	filtersCount,
}) => {
	const { filters, setFilters } = filterProps;
	const { isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } = infiniteLoadData;
	const [currentTemplate, setCurrentTemplate] = useState(null);
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
		<div className={styles.scriptsTemplates}>
			{templateLoading ? (
				<Loader compressed={sidebarState} />
			) : templates?.length > 0 ? (
				<div className={styles.tableContainer}>
					<div className={styles.tableHeader}>
						<div className={sidebarState && styles.compressed}>
							<div>
								{TEMPLATES_TRANSLATION.TEMPLATE_NAME[user?.language?.toUpperCase()]}
							</div>
							<div>{TEMPLATES_TRANSLATION.TEMPLATE[user?.language?.toUpperCase()]}</div>
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
											template={template}
											ref={templates?.length > 9 ? lastTemplateRef : null}
											setTemplate={setTemplate}
											currentTemplate={currentTemplate}
											setCurrentTemplate={setCurrentTemplate}
											templateLevel={templateLevel}
											setDuplicateModal={setDuplicateModal}
											setAddEditModal={setAddEditModal}
											setDeleteModal={setDeleteModal}
											setShareModal={setShareModal}
											sidebarState={sidebarState}
											setSidebarState={setSidebarState}
											loading={templateLoading}
											type={TEMPLATE_TYPES.SCRIPT}
											Icon={<PhoneGradient />}
											key={template.st_id}
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
										templateLevel={templateLevel}
										setDuplicateModal={setDuplicateModal}
										setAddEditModal={setAddEditModal}
										setDeleteModal={setDeleteModal}
										setShareModal={setShareModal}
										loading={templateLoading}
										type={TEMPLATE_TYPES.SCRIPT}
										Icon={<PhoneGradient />}
										key={template.st_id}
										sidebarState={sidebarState}
										setSidebarState={setSidebarState}
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
					templateType={TEMPLATE_TYPES.SCRIPT}
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

export default ScriptsTemplates;
