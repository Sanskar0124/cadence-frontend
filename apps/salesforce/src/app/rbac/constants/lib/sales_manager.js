import { Navigate } from "react-router-dom";

import {
	Dashboard,
	Tasks,
	Templates as TemplatesIcon,
	Cadences,
	Leads,
	Statistics as StatisticsIcon,
	HomeIcon,
	Settings,
} from "@cadence-frontend/icons";

import Statistics from "../../../pages/Statistics/Statistics";
import TasksDashboard from "../../../pages/Tasks/Tasks";
import LeadsDashboard from "../../../pages/Leads/Leads";
import Templates from "../../../pages/Templates/Templates";
import Cadence from "../../../pages/Cadence/Cadence";
import CadenceSettings from "../../../pages/Cadence/Settings/Settings";
import CadenceView from "../../../pages/Cadence/CadenceView/CadenceView";
import Lead from "../../../pages/Lead/Lead";
import CadenceImport from "../../../pages/CadenceImport/CadenceImport";
import { Extension } from "../../../pages/ExtensionImport/ExtensionImport";
import UserOnboarding from "../../../pages/UserOnboarding/UserOnboarding";
import Salesforce from "../../../pages/Settings/Settings";
import { Home } from "@cadence-frontend/features";

const SALES_MANAGER_ROUTES = [
	{
		fullScreen: true,
		includedInSidebar: false,
		link: "/extension-web-app",
		name: "Extension",
		component: <Extension />,
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
		includedInSidebar: false,
		link: "/leads/:leadId",
		name: "Lead page",
		component: <Lead />,
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
		icon: <TemplatesIcon />,
	},
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
		link: "/onboarding",
		name: "Onboarding",
		component: <UserOnboarding />,
		icon: <Leads />,
	},
	{
		fullScreen: false,
		includedInSidebar: true,
		link: "/settings",
		name: "Settings",
		component: <Salesforce />,
		icon: <Settings />,
	},
];

export default SALES_MANAGER_ROUTES;
