//components
import { useEffect, useState, useRef, useCallback } from "react";
import TemplateCard from "../TemplateCard/TemplateCard";
import { MailGradient } from "@cadence-frontend/icons";

import Loader from "../Loader/Loader";

//constants
import {
	isOptionsTop,
	TEMPLATE_SIDEBAR_OPTIONS,
	TEMPLATE_TYPES,
	TEMPLATE_TYPES_OPTIONS,
} from "../../constants";
import styles from "./EmailTemplates.module.scss";
import moment from "moment-timezone";
import { Table } from "@cadence-frontend/widgets";
import { TableThemes } from "@cadence-frontend/themes";
import TemplateSidebar from "../AddOrEditTemplateModal/components/TemplateSidebar/TemplateSidebar";
import EmailStatsSidebar from "./components/EmailStatsSidebar/EmailStatsSidebar";
import Placeholder from "../Placeholder/Placeholder";
import TemplateFilter from "../TemplateFilter/TemplateFilter";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import templateTypes from "libs/constants/src/lib/templateTypes";
import { useTemplate } from "@cadence-frontend/data-access";
import { Skeleton } from "@cadence-frontend/components";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";

const EmailTemplates = ({
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
	filtersCount,
	infiniteLoadData,
	filterProps,
	setSendTestMailModal,
}) => {
	const user = useRecoilValue(userInfo);
	const { filters, setFilters } = filterProps;
	const [currentTemplate, setCurrentTemplate] = useState(null);
	const [tableWidth, setTableWidth] = useState(sidebarState ? "70%" : "100%");
	const { isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } = infiniteLoadData;

	const { selectedStat, setSelectedStat, leadsData } = useTemplate({
		templateLevel,
		templateType: TEMPLATE_TYPES.EMAIL,
	});

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
		<div className={styles.emailTemplates}>
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
								<div>{TEMPLATES_TRANSLATION.TEMPLATE[user?.language?.toUpperCase()]}</div>
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
											type={TEMPLATE_TYPES.EMAIL}
											loading={templateLoading}
											Icon={<MailGradient />}
											key={template.et_id}
											sidebarState={sidebarState}
											setSidebarState={setSidebarState}
											handleOnClick={handleOnClick}
											optionsOnTop={isOptionsTop(templates?.length, index)} //for options on top
											setSelectedStat={setSelectedStat}
											setSendTestMailModal={setSendTestMailModal}
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
										type={TEMPLATE_TYPES.EMAIL}
										Icon={<MailGradient />}
										key={template.et_id}
										sidebarState={sidebarState}
										setSidebarState={setSidebarState}
										setSelectedStat={setSelectedStat}
										handleOnClick={handleOnClick}
										optionsOnTop={isOptionsTop(templates?.length, index)} //for options on top
										setSendTestMailModal={setSendTestMailModal}
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
					templateType={TEMPLATE_TYPES.EMAIL}
					templateLevel={templateLevel}
					setTemplate={setTemplate}
					setShareModal={setShareModal}
					setDuplicateModal={setDuplicateModal}
					setAddEditModal={setAddEditModal}
					setDeleteModal={setDeleteModal}
					setSendTestMailModal={setSendTestMailModal}
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

				{selectedStat.stats && (
					<EmailStatsSidebar
						onSidebarClose={handleOnClose}
						sidebarState={sidebarState}
						selectedStat={selectedStat}
						setSelectedStat={setSelectedStat}
						leadsData={leadsData}
					/>
				)}
			</div>
		</div>
	);
};

export default EmailTemplates;
