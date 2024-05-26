import {
	Dashboard,
	Templates as TemplateIcon,
	Tasks,
	Leads,
	Cadences,
	Statistics as StatisticsIcon,
	HomeIcon,
	Settings as SettingsIcon,
} from "@cadence-frontend/icons";
import { Navigate } from "react-router-dom";
import {
	Home as HOME_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
	People as PEOPLE_TRANSLATION,
	Statistics as STATISTICS_TRANSLATION,
	Templates as TEMPLATES_TRANSLATION,
} from "@cadence-frontend/languages";

import {
	Templates,
	Tasks as TasksDashboard,
	Leads as LeadsDashboard,
	Lead,
	Cadence,
	CadenceSettings,
	CadenceView,
	CadenceImport,
	Extension,
	UserOnboarding,
	Home,
	StatisticsTemp as Statistics,
	CsvColumnMap,
	LinkedinCadenceImport,
	Settings,
	CompareCadence,
} from "@cadence-frontend/features";

const SALES_PERSON_ROUTES = [
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/extension-web-app",
		name: { label: COMMON_TRANSLATION.EXTENSION, value: "extension" },
		component: <Extension />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/",
		name: { label: HOME_TRANSLATION.HOME, value: "home" },
		component: <Navigate to="/home" />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/home",
		name: { label: HOME_TRANSLATION.HOME, value: "home" },
		component: <Home />,
		icon: <HomeIcon />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/cadence",
		name: { label: CADENCE_TRANSLATION.CADENCES, value: "cadence" },
		component: <Cadence />,
		icon: <Cadences />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/leads/:leadId",
		name: { label: COMMON_TRANSLATION.LEAD_PAGE, value: "lead page" },
		component: <Lead />,
	},
	//deprecated
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/salesforce/leads/:leadId",
		name: { label: COMMON_TRANSLATION.LEAD_PAGE, value: "lead page" },
		component: <Lead />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/pipedrive/leads/:leadId",
		name: { label: COMMON_TRANSLATION.LEAD_PAGE, value: "lead page" },
		component: <Lead />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/hubspot/leads/:leadId",
		name: { label: COMMON_TRANSLATION.LEAD_PAGE, value: "lead page" },
		component: <Lead />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/google-sheets/leads/:leadId",
		name: { label: COMMON_TRANSLATION.LEAD_PAGE, value: "lead page" },
		component: <Lead />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/tasks",
		name: { label: COMMON_TRANSLATION.TASKS, value: "tasks" },
		component: <TasksDashboard />,
		icon: <Tasks />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/leads",
		name: { label: PEOPLE_TRANSLATION.PEOPLE, value: "people" },
		component: <LeadsDashboard />,
		icon: <Leads />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/cadence/edit/:id",
		name: { label: CADENCE_TRANSLATION.EDIT_CADENCE, value: "edit cadence" },
		component: <CadenceSettings />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/cadence/:id",
		name: { label: CADENCE_TRANSLATION.CADENCE_VIEW, value: "cadence view" },
		component: <CadenceView />,
		icon: <Dashboard />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/stats",
		name: { label: STATISTICS_TRANSLATION.STATISTICS, value: "statistics" },
		component: <Statistics />,
		icon: <StatisticsIcon />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/stats/comparecadence",
		name: { label: STATISTICS_TRANSLATION.COMPARE_CADENCES, value: "compare cadences" },
		component: <CompareCadence />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/templates",
		name: { label: TEMPLATES_TRANSLATION.TEMPLATES, value: "templates" },
		component: <Templates />,
		icon: <TemplateIcon />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/settings",
		name: { label: COMMON_TRANSLATION.SETTINGS, value: "settings" },
		component: <Settings />,
		icon: <SettingsIcon />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/import-csv",
		name: { label: COMMON_TRANSLATION.IMPORT_CSV, value: "import csv" },
		component: <CsvColumnMap />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/linkedin/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <LinkedinCadenceImport />,
	},
	//temp for cadence import
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/salesforce/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/linkedin/salesforce/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <LinkedinCadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/pipedrive/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/hubspot/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/dynamics/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/bullhorn/cadence-import",
		name: { label: CADENCE_TRANSLATION.CADENCE_IMPORT, value: "cadence import" },
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/onboarding",
		name: { label: COMMON_TRANSLATION.ONBOARDING, value: "onboarding" },
		component: <UserOnboarding />,
		icon: <Leads />,
	},
];

export default SALES_PERSON_ROUTES;
