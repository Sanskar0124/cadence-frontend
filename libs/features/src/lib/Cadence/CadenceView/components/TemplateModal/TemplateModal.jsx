import { Div, Modal, Skeleton, Tooltip } from "@cadence-frontend/components";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./TemplateModal.module.scss";
import { SearchBar } from "@cadence-frontend/widgets";
import { LANGUAGES_CONSTANTS, TEMPLATE_TYPE } from "./constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { CloseBold } from "@cadence-frontend/icons";
import { Colors } from "@cadence-frontend/utils";
import { TooltipThemes } from "@cadence-frontend/themes";
import TemplateCard from "./components/TemplateCard/TemplateCard";
import StepsContainer from "./components/Stepscontainer/StepsContainer";
import { useCadencesTemplates } from "@cadence-frontend/data-access";
import { data } from "../TemplateModal/components/Stepscontainer/db";
import { useParams } from "react-router-dom";

const TemplateModal = ({ modal, setModal, cadenceSettingsDataAccess, cadence }) => {
	const user = useRecoilValue(userInfo);
	let { id: cadence_id } = useParams();

	const [type, setType] = useState("all_templates");
	const [language, setLanguage] = useState("english");
	const [SelectedTemplated, setSelectedTemplate] = useState({
		data: null,
		template_index: 0,
	});
	const [isSelected, setIsSelected] = useState(false);
	const [search, setSearch] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const observer = useRef();
	const {
		cadenceTemplates: templates,
		cadenceTemplateLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useCadencesTemplates(
		{ template: true },
		{
			language,
			searchValue,
			type,
			created_at: cadence?.created_at,
		}
	);

	//search
	const handleSearch = () => {
		if (isSelected) {
			setIsSelected(false);
			setSearchValue(search);
		} else {
			setSearchValue(search);
		}
	};

	useEffect(() => {
		if (!search) setSearchValue("");
	}, [search]);

	const handleTemplateSelect = template => {
		setSelectedTemplate(prev => ({
			...prev,
			data: template,
			template_index: template?.cadence_template_id,
		}));
		setIsSelected(true);
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

	const handleType = opt => {
		if (isSelected) {
			setIsSelected(false);
			setType(opt);
		} else {
			setType(opt);
		}
	};
	const handleLanguage = lang => {
		if (isSelected) {
			return 0;
		} else {
			setLanguage(lang);
		}
	};

	return (
		<Modal
			isModal={modal}
			onClose={() => setModal(false)}
			className={styles.modalcontainer}
		>
			<div className={styles.container}>
				<SearchBar
					className={styles.searchBar}
					width="284px"
					height="50px"
					value={search}
					setValue={setSearch}
					onSearch={handleSearch}
					placeholderText={
						COMMON_TRANSLATION.SEARCH_TEMPLATES[user?.language.toUpperCase()]
					}
				/>
				<div className={styles.languagecontainer}>
					{LANGUAGES_CONSTANTS.map(lang => {
						return (
							<div
								className={language === lang.name ? styles.selected : ""}
								onClick={() => handleLanguage(lang.name)}
							>
								<span
									key={lang.name}
									className={
										language === lang.name
											? styles.selectedflag
											: isSelected
											? `${styles.flagicon} ${styles.opacity}`
											: styles.flagicon
									}
								>
									{lang.icon}
								</span>
							</div>
						);
					})}
				</div>
				<span className={styles.closeIcon} onClick={() => setModal(false)}>
					<Tooltip text="Close" theme={TooltipThemes.BOTTOM} span>
						<CloseBold color={Colors.lightBlue} />
					</Tooltip>
				</span>
			</div>
			<div className={styles.templatecontainer}>
				<div className={styles.options}>
					{Object.keys(TEMPLATE_TYPE).map(opt => (
						<div
							key={opt}
							className={type === opt ? styles.isSelected : ""}
							onClick={() => handleType(opt)}
						>
							{TEMPLATE_TYPE[opt][user?.language.toUpperCase()]}
						</div>
					))}
				</div>
				<div className={styles.templatecardcontainer}>
					{isSelected ? (
						<StepsContainer
							cadenceSettingsDataAccess={cadenceSettingsDataAccess}
							nodeData={SelectedTemplated?.data}
							setIsSelected={setIsSelected}
							cadenceId={cadence_id}
							setModal={setModal}
						/>
					) : (
						<div className={styles.templates}>
							{cadenceTemplateLoading ? (
								<div className={styles.linePlaceholders}>
									{[...Array(4).keys()].map(key => (
										<Skeleton className={styles.linePlaceholder} />
									))}
								</div>
							) : templates?.length > 0 ? (
								templates?.map((template, index) => {
									const isLastTemplate = index === templates.length - 1;
									return isLastTemplate ? (
										<>
											<TemplateCard
												template={template}
												key={template?.cadence_template_id}
												handleTemplateSelect={handleTemplateSelect}
												template_index={SelectedTemplated?.template_index}
												ref={lastTemplateRef}
											/>
											{isFetchingNextPage && (
												<div className={styles.placeholder}>
													<Div loading className={styles.templateplaceholder} />
												</div>
											)}
										</>
									) : (
										<TemplateCard
											template={template}
											key={template?.cadence_template_id}
											handleTemplateSelect={handleTemplateSelect}
											template_index={SelectedTemplated?.template_index}
										/>
									);
								})
							) : (
								<div className={styles.noTemplates}>No Templates found</div>
							)}
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default TemplateModal;
