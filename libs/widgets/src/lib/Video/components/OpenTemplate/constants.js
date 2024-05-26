import { BadgeAccountHorizontal, Company, User } from "@cadence-frontend/icons";

export const TEMPLATE_LEVELS = {
	USER: "personal",
	SUB_DEPARTMENT: "team",
	COMPANY: "company",
};

export const TEMPLATE_LEVELS_LABELS = {
	USER: {
		ENGLISH: "Personal",
		FRENCH: "Personnel",
		SPANISH: "Personal",
	},
	SUB_DEPARTMENT: {
		ENGLISH: "Group",
		FRENCH: "Groupe",
		SPANISH: "Grupo",
	},
	COMPANY: {
		ENGLISH: "Company",
		FRENCH: "Entreprise",
		SPANISH: "Empresa",
	},
};

export const TEMPLATE_LEVELS_ICONS = {
	USER: <User />,
	SUB_DEPARTMENT: <BadgeAccountHorizontal />,
	COMPANY: <Company />,
};
