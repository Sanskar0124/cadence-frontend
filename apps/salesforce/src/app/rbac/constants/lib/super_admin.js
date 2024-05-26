import { Navigate } from "react-router-dom";

import {
	Cadences,
	Dashboard,
	Tasks,
	Leads,
	Templates as TemplateIcon,
	Statistics as StatisticsIcon,
	BadgeAccountHorizontal,
	Marketplace as MarketplaceIcon,
	HomeIcon,
	Settings,
} from "@cadence-frontend/icons";

import CompanyOnboarding from "../../../pages/CompanyOnboarding/CompanyOnboarding";
import Statistics from "../../../pages/Statistics/Statistics";
import TasksDashboard from "../../../pages/Tasks/Tasks";
import LeadsDashboard from "../../../pages/Leads/Leads";
import Cadence from "../../../pages/Cadence/Cadence";
import CadenceSettings from "../../../pages/Cadence/Settings/Settings";
import CadenceView from "../../../pages/Cadence/CadenceView/CadenceView";
import CadenceImport from "../../../pages/CadenceImport/CadenceImport";
import Salesforce from "../../../pages/Settings/Settings";
import { Extension } from "../../../pages/ExtensionImport/ExtensionImport";
import Lead from "../../../pages/Lead/Lead";
import Templates from "../../../pages/Templates/Templates";

import { Home } from "@cadence-frontend/features";

const SUPER_ADMIN_ROUTES = [
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/extension-web-app",
		name: "Extension",
		component: <Extension />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/onboarding",
		name: "Onboarding",
		component: <CompanyOnboarding />,
		icon: <Leads />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/",
		name: "Home",
		component: <Navigate to="/home" />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/home",
		name: "Home",
		component: <Home />,
		icon: <HomeIcon />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/tasks",
		name: "Tasks",
		component: <TasksDashboard />,
		icon: <Tasks />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/leads",
		name: "People",
		component: <LeadsDashboard />,
		icon: <Leads />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/leads/:leadId",
		name: "Lead page",
		component: <Lead />,
	},

	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/cadence",
		name: "Cadence",
		component: <Cadence />,
		icon: <Cadences />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/cadence/edit/:id",
		name: "Edit Cadence",
		component: <CadenceSettings />,
	},
	{
		fullScreen: false,
		includedInSidebar: false,
		link: "/cadence/:id",
		name: "Cadence View",
		component: <CadenceView />,
		icon: <Dashboard />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/stats",
		name: "Statistics",
		component: <Statistics />,
		icon: <StatisticsIcon />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/templates",
		name: "Templates",
		component: <Templates />,
		icon: <TemplateIcon />,
	},
	// {
	// 	fullScreen: false,
	// 	includedInSidebar: true,
	// 	link: "/users-status",
	// 	name: "Users Status",
	// 	component: <UsersSignedInStatus />,
	// 	icon: <Leads />,
	// },
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/cadence-import",
		name: "Cadence Import",
		component: <CadenceImport />,
	},
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/cadence-import",
		name: "Cadence Import",
		component: <CadenceImport />,
	},

	// {
	// 	fullScreen: false,
	// 	includedInSidebar: false,
	// 	link: "/settings",
	// 	name: "Settings",
	// 	component: <Marketplace />,
	// },
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/settings",
		name: "Settings",
		component: <Salesforce />,
		icon: <Settings />,
	},
];

export default SUPER_ADMIN_ROUTES;
