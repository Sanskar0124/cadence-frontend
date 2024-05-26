import { useEffect, useState, useContext, useCallback } from "react";

//components
import {
	Container,
	Title,
	DeleteModal,
	Div,
	Skeleton,
} from "@cadence-frontend/components";
import { SearchBar, ThemedButton, TabNavSlider } from "@cadence-frontend/widgets";
import {
	ThemedButtonThemes,
	TabNavThemes,
	TabNavBtnThemes,
} from "@cadence-frontend/themes";
import { Plus, Sort } from "@cadence-frontend/icons";
import { useTemplate, useVideoTemplate } from "@cadence-frontend/data-access";
import { MessageContext } from "@cadence-frontend/contexts";
import SmsTemplates from "./components/TemplateCard/SmsTemplates/SmsTemplates";
import EmailTemplates from "./components/EmailTemplates/EmailTemplates";
import ScriptsTemplates from "./components/ScriptsTemplates/ScriptsTemplates";
import LinkedinTemplates from "./components/LinkedinTemplates/LinkedinTemplates";
import AddOrEditTemplateModal from "./components/AddOrEditTemplateModal/AddOrEditTemplateModal";
import ShareTemplateModal from "./components/ShareTemplateModal/ShareTemplateModal";
import DuplicateTemplateModal from "./components/DuplicateTemplateModal/DuplicateTemplateModal";
import {
	Common as COMMON_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";

//constants
import {
	TEMPLATE_TYPES,
	TEMPLATE_HEADINGS,
	TEMPLATE_LEVELS,
	TEMPLATE_LEVELS_ICONS,
	TEMPLATE_LEVELS_LABELS,
	TEMPLATE_SIDEBAR_OPTIONS,
	ACTIONS,
	ROLES,
} from "@cadence-frontend/constants";

import styles from "./Templates.module.scss";

// utils
import { isActionPermitted } from "./utils";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import SendTestMailModal from "./components/SendTestMailModal/SendTestMailModal";
import VideoTemplates from "./components/VideoTemplates/VideoTemplates";
import WhatsappTemplates from "./components/WhatsappTemplates/WhatsappTemplates";
// import TemplateFilter from "./components/TemplateFilter/TemplateFilter";

const TEMPLATE_VIEW = {
	TEMPLATE: "template",
	FILTER: "filter",
};

const Templates = () => {
	const user = useRecoilValue(userInfo);

	const { addError, addSuccess } = useContext(MessageContext);

	const [searchValue, setSearchValue] = useState("");
	const [templateType, setTemplateType] = useState(TEMPLATE_TYPES.EMAIL);
	const [templateLevel, setTemplateLevel] = useState(TEMPLATE_LEVELS.USER);
	const [addEditModal, setAddEditModal] = useState(false);
	const [shareTemplateModal, setShareTemplateModal] = useState(null);
	const [duplicateTemplateModal, setDuplicateTemplateModal] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [template, setTemplate] = useState(null);
	const [templates, setTemplates] = useState([]);

	const [sendTestMailModal, setSendTestMailModal] = useState(null);

	// const [showCard, setShowCard] = useState(false);
	// const [showFilter, setShowFilter] = useState(false);
	const [sidebarState, setSidebarState] = useState(null);

	const [filtersCount, setFiltersCount] = useState(0);

	const addNewDisabled = !isActionPermitted(ACTIONS.CREATE, templateLevel, user?.role);
	const {
		refetch,
		filters,
		setFilters,
		isFetching,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
		templates: templatesData,
		templateLoading,
		createTemplate,
		createLoading,
		updateTemplate,
		updateLoading,
		deleteTemplate,
		shareTemplate,
		shareLoading,
		duplicateTemplate,
		duplicateLoading,
		queryClient,
		KEY,
		templateCountData,
		infiniteLoadData,
	} = useTemplate({
		templateLevel,
		templateType,
	});

	const { templateCount, countLoading, refetchCount } = templateCountData;

	useEffect(() => {
		refetch();
		refetchCount();
	}, [templateLevel, templateType]);

	useEffect(() => {
		if (!searchValue) setTemplates(templatesData);
	}, [templatesData]);

	useEffect(() => {
		let count = 0;
		for (const filterLevel in filters) {
			count += filters[filterLevel]?.length;
		}
		setFiltersCount(count);
	}, [filters]);

	// useEffect(() => {
	// 	setTemplates(
	// 		templatesData
	// 			?.filter(
	// 				(template, index) =>
	// 					filter.groups.length === 0 || filter.groups.includes(template.sd_id)
	// 			)
	// 			?.filter(
	// 				(template, index) =>
	// 					filter.users.length === 0 || filter.users.includes(template.user_id)
	// 			)
	// 	);
	// }, [filter]);

	useEffect(() => {
		if (searchValue)
			setTemplates(
				templatesData?.filter(temp =>
					temp?.name?.toLowerCase()?.includes(searchValue.toLowerCase())
				)
			);
		else setTemplates(templatesData);
	}, [searchValue]);

	const handleAddNewTemplateClick = () => {
		setAddEditModal({ isAdd: true });
	};

	const handleDeleteTemplate = () => {
		const body = { ...template, type: templateType };

		deleteTemplate(body, {
			onError: (err, _, context) => {
				addError({
					text: "Failed to delete template.",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				queryClient.setQueryData(KEY, context.previousTemplates);
			},
			onSuccess: () => {
				refetchCount();
				// refetch();

				return addSuccess("Template deleted");
			},
		});
	};

	const handleDeleteModalClose = () => {
		if (!addEditModal) setTemplate(null);
		setSidebarState(null);
		setDeleteModal(false);
	};

	const handleFilterClick = () => {
		// setShowFilter(prev => !prev);

		setSidebarState(prev =>
			prev === TEMPLATE_SIDEBAR_OPTIONS.FILTER ? null : TEMPLATE_SIDEBAR_OPTIONS.FILTER
		);
	};

	// useEffect(() => {
	// 	if (sidebarState === TEMPLATE_SIDEBAR_OPTIONS.FILTER) setSidebarState(false);
	// }, [sidebarState]);

	const renderTemplates = () => {
		switch (templateType) {
			case TEMPLATE_TYPES.SMS:
				return (
					<SmsTemplates
						templates={templates}
						templateLevel={templateLevel}
						setAddEditModal={setAddEditModal}
						setDeleteModal={setDeleteModal}
						setDuplicateModal={setDuplicateTemplateModal}
						setShareModal={setShareTemplateModal}
						currentTemplate={template}
						setTemplate={setTemplate}
						templateLoading={templateLoading}
						filtersCount={filtersCount}
						dataAccess={{
							createTemplate,
							updateTemplate,
							deleteTemplate,
							shareTemplate,
							KEY,
							queryClient,
							refetchCount,
						}}
						infiniteLoadData={infiniteLoadData}
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
						addNewDisabled={addNewDisabled}
						filterProps={{ filters, setFilters }}
					/>
				);
			case TEMPLATE_TYPES.LINKEDIN:
				return (
					<LinkedinTemplates
						templates={templates}
						templateLevel={templateLevel}
						setAddEditModal={setAddEditModal}
						setDeleteModal={setDeleteModal}
						setDuplicateModal={setDuplicateTemplateModal}
						setShareModal={setShareTemplateModal}
						currentTemplate={template}
						setTemplate={setTemplate}
						filtersCount={filtersCount}
						templateLoading={templateLoading}
						dataAccess={{
							createTemplate,
							updateTemplate,
							deleteTemplate,
							shareTemplate,
							KEY,
							queryClient,
							refetchCount,
						}}
						infiniteLoadData={infiniteLoadData}
						addNewDisabled={addNewDisabled}
						filterProps={{ filters, setFilters }}
						isFetching={isFetching}
						isFetchingNextPage={isFetchingNextPage}
						hasNextPage={hasNextPage}
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
					/>
				);
			case TEMPLATE_TYPES.EMAIL:
				return (
					<EmailTemplates
						templates={templates}
						templateLevel={templateLevel}
						setAddEditModal={setAddEditModal}
						setDeleteModal={setDeleteModal}
						setDuplicateModal={setDuplicateTemplateModal}
						setShareModal={setShareTemplateModal}
						currentTemplate={template}
						setTemplate={setTemplate}
						templateLoading={templateLoading}
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
						infiniteLoadData={infiniteLoadData}
						setSendTestMailModal={setSendTestMailModal}
						addNewDisabled={addNewDisabled}
						filterProps={{ filters, setFilters }}
						isFetching={isFetching}
						isFetchingNextPage={isFetchingNextPage}
						hasNextPage={hasNextPage}
						filtersCount={filtersCount}
					/>
				);
			case TEMPLATE_TYPES.SCRIPT:
				return (
					<ScriptsTemplates
						templates={templates}
						templateLevel={templateLevel}
						setAddEditModal={setAddEditModal}
						setDeleteModal={setDeleteModal}
						setDuplicateModal={setDuplicateTemplateModal}
						setShareModal={setShareTemplateModal}
						currentTemplate={template}
						setTemplate={setTemplate}
						filtersCount={filtersCount}
						infiniteLoadData={infiniteLoadData}
						templateLoading={templateLoading}
						dataAccess={{
							createTemplate,
							updateTemplate,
							deleteTemplate,
							shareTemplate,
							KEY,
							queryClient,
						}}
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
						addNewDisabled={addNewDisabled}
						filterProps={{ filters, setFilters }}
					/>
				);
			case TEMPLATE_TYPES.VIDEO:
				return (
					<VideoTemplates
						templates={templates}
						templateLevel={templateLevel}
						setAddEditModal={setAddEditModal}
						setDeleteModal={setDeleteModal}
						setDuplicateModal={setDuplicateTemplateModal}
						setShareModal={setShareTemplateModal}
						currentTemplate={template}
						setTemplate={setTemplate}
						templateLoading={templateLoading}
						infiniteLoadData={infiniteLoadData}
						addNewDisabled={addNewDisabled}
						filterProps={{ filters, setFilters }}
						isFetching={isFetching}
						isFetchingNextPage={isFetchingNextPage}
						hasNextPage={hasNextPage}
						filtersCount={filtersCount}
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
					/>
				);
			case TEMPLATE_TYPES.WHATSAPP:
				return (
					<WhatsappTemplates
						templates={templates}
						templateLevel={templateLevel}
						setAddEditModal={setAddEditModal}
						setDeleteModal={setDeleteModal}
						setDuplicateModal={setDuplicateTemplateModal}
						setShareModal={setShareTemplateModal}
						currentTemplate={template}
						setTemplate={setTemplate}
						filtersCount={filtersCount}
						templateLoading={templateLoading}
						dataAccess={{
							createTemplate,
							updateTemplate,
							deleteTemplate,
							shareTemplate,
							KEY,
							queryClient,
							refetchCount,
						}}
						infiniteLoadData={infiniteLoadData}
						addNewDisabled={addNewDisabled}
						filterProps={{ filters, setFilters }}
						isFetching={isFetching}
						isFetchingNextPage={isFetchingNextPage}
						hasNextPage={hasNextPage}
						sidebarState={sidebarState}
						setSidebarState={setSidebarState}
					/>
				);
		}
	};

	return (
		<Container>
			<div className={styles.templatesContainer}>
				<div className={styles.header}>
					<div className={styles.leftHeader}>
						<Title className={styles.pageTitle}>
							{TEMPLATES_TRANSLATION.TEMPLATES[user?.language?.toUpperCase()]}
						</Title>
						<p className={styles.totalTemplates}>
							{countLoading ? (
								<Skeleton className={styles.totalCountLoader} />
							) : (
								`${
									TEMPLATES_TRANSLATION.TOTAL_TEMPLATES[user?.language?.toUpperCase()]
								} : ${+templateCount >= 0 ? templateCount : 0}`
							)}
						</p>
					</div>

					<div className={styles.headerOptions}>
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
							width="450px"
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
						/>
						<ThemedButton
							className={styles.addNewBtn}
							theme={ThemedButtonThemes.WHITE}
							onClick={handleAddNewTemplateClick}
							disabled={addNewDisabled}
						>
							<Plus />
							<div>{COMMON_TRANSLATION.ADD_NEW[user?.language?.toUpperCase()]}</div>
						</ThemedButton>

						{user?.role !== ROLES.SALESPERSON && (
							<ThemedButton
								theme={
									sidebarState === TEMPLATE_SIDEBAR_OPTIONS.FILTER || filtersCount
										? ThemedButtonThemes.ACTIVE
										: ThemedButtonThemes.WHITE
								}
								onClick={handleFilterClick}
								className={styles.filterBtn}
							>
								<Sort />
								<div>
									{COMMON_TRANSLATION.FILTERS[user?.language?.toUpperCase()]}
									{filtersCount !== 0 && <span> {`(${filtersCount})`}</span>}
								</div>
							</ThemedButton>
						)}
					</div>
				</div>
				<div className={styles.headerTemplateTypes}>
					<div className={styles.templateTypes}>
						<TabNavSlider
							theme={TabNavThemes.SLIDER}
							buttons={Object.keys(TEMPLATE_TYPES).map(type => ({
								label: TEMPLATE_HEADINGS[type][user?.language?.toUpperCase()],
								value: TEMPLATE_TYPES[type],
							}))}
							value={templateType}
							setValue={setTemplateType}
							className={styles.tabs}
							btnClassName={styles.tabBtns}
							activeBtnClassName={styles.tabBtnActive}
							activePillClassName={styles.activePill}
							width="600px"
							// noAnimation
						/>
					</div>
					<div className={styles.headerOptions}>
						<SearchBar
							// onSearch={handleSearch}
							placeholderText={
								TEMPLATES_TRANSLATION.SEARCH_BY_TEMPLATE_NAME[
									user?.language.toUpperCase()
								]
							}
							className={styles.searchBar}
							value={searchValue}
							setValue={setSearchValue}
							width="300px"
							height="50px"
						/>
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.renderTemplates}>{renderTemplates()}</div>
				</div>
			</div>

			<AddOrEditTemplateModal
				modal={addEditModal}
				// duplicate={duplicate}
				setModal={setAddEditModal}
				setDuplicateModal={setDuplicateTemplateModal}
				setDeleteModal={setDeleteModal}
				template={template}
				setTemplate={setTemplate}
				templateType={templateType}
				templateLevel={templateLevel}
				dataAccess={{
					createTemplate,
					updateTemplate,
					deleteTemplate,
					createLoading,
					updateLoading,
					KEY,
					queryClient,
					refetchCount,
				}}
				setSidebarState={setSidebarState}
			/>
			<DeleteModal
				modal={deleteModal}
				itemType="template"
				item={template?.name}
				handleClose={handleDeleteModalClose}
				onDelete={handleDeleteTemplate}
			/>
			<ShareTemplateModal
				modal={shareTemplateModal}
				setModal={setShareTemplateModal}
				dataAccess={{ shareTemplate, shareLoading, refetchCount }}
			/>
			<DuplicateTemplateModal
				modal={duplicateTemplateModal}
				setModal={setDuplicateTemplateModal}
				dataAccess={{ duplicateTemplate, duplicateLoading, refetchCount }}
			/>
			<SendTestMailModal modal={sendTestMailModal} setModal={setSendTestMailModal} />
		</Container>
	);
};

export default Templates;
