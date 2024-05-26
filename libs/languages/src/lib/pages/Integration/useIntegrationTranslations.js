import { capitalize } from "@cadence-frontend/utils";

const useIntegrationTranslations = user_integration => ({
	INSTALL_INTEGRATION_PACKAGE: {
		ENGLISH: `install ${capitalize(user_integration)} package`,
		FRENCH: `installer le pack ${capitalize(user_integration)}`,
		SPANISH: `instalar el paquete de ${capitalize(user_integration)}`,
	},
	EMPLOYEES_CAN_USE_THIS_INSTALLATION: {
		ENGLISH: `in order to ensure that all your employees can use this installation, you’ll need to install the Cadence package in your ${capitalize(
			user_integration
		)}.`,
		FRENCH: `afin de garantir que tous vos employés puissent utiliser cette installation, vous devrez installer le package Cadence dans votre ${capitalize(
			user_integration
		)}.`,
		SPANISH: `para que todos tus empleados puedan utilizar esta instalación, debes instalar el paquete Cadence en tu ${capitalize(
			user_integration
		)}.`,
	},

	LOG_NOTE_ACTIVITIES: {
		ENGLISH: `to log note activities please set up note activities in ${capitalize(
			user_integration
		)}`,
		FRENCH: `installer le pack ${capitalize(user_integration)}`,
		SPANISH: `Para registrar tus notas, configura las actividades de notas en ${capitalize(
			user_integration
		)}`,
	},
	LOG_ACTIVITIES: {
		ENGLISH: `Log activities in ${capitalize(user_integration)}`,
		FRENCH: `Loguer vos activités dans ${capitalize(user_integration)}`,
		SPANISH: `Registra tus actividades en ${capitalize(user_integration)}`,
	},
	LOG_YOUR_CADENCE_ACTIVITIES_WITH: {
		ENGLISH: `You can log your cadence activities with ${capitalize(
			user_integration
		)} by enabling these options`,
		FRENCH: `Vous pouvez enregistrer vos activités de cadence avec ${capitalize(
			user_integration
		)} en activant ces options `,
		SPANISH: `Puedes registrar tus actividades con Cadence activando ${capitalize(
			user_integration
		)} estas opciones`,
	},
	SYNC_YOUR_CADENCE_ACTIVITIES_WITH: {
		ENGLISH: `Sync your Cadence activities with ${capitalize(user_integration)}`,
		FRENCH: `Sync vos activités de Cadence avec  ${capitalize(user_integration)}`,
		SPANISH: `Sincroniza tus actividades de Cadence con ${capitalize(user_integration)}`,
	},
	INTEGRATION_ADMINISTRATOR: {
		ENGLISH: `${capitalize(user_integration)} Administrator`,
		FRENCH: `Administrateur ${capitalize(user_integration)}`,
		SPANISH: `Administrador de ${capitalize(user_integration)}`,
	},
	CREATE_INTEGRATION_ADMINISTRATOR: {
		ENGLISH: `create ${user_integration} administrator from the dropdown in order to log activities in ${capitalize(
			user_integration
		)} for events and also to show duplicates in the task page`,
		FRENCH: `créez un administrateur ${capitalize(
			user_integration
		)} à partir du menu déroulant afin de consigner les activités dans ${capitalize(
			user_integration
		)} pour les événements et également d'afficher les doublons dans la page des tâches`,
		SPANISH: `crea un administrador de ${capitalize(
			user_integration
		)} en el menú desplegable para registrar actividades en ${capitalize(
			user_integration
		)} para eventos y también para mostrar duplicados en la página de tareas`,
	},
	INTEGRATION_ID: {
		ENGLISH: `salesforce id`,
		FRENCH: `id salesforce`,
		SPANISH: `id de salesforce`,
	},
	ENSURE_YOU_HAVE_GLOBAL_ACCESS_IN_PIPEDRIVE: {
		ENGLISH: `Ensure you have "global access" right in pipedrive`,
		FRENCH: `Assurez-vous d'avoir les droits "total accès" dans pipedrive`,
		SPANISH: `Comprueba que tengas el permiso de "acceso global" en Pipedrive`,
	},
	CONNECTED_WITH_INTEGRATION: {
		ENGLISH: `You are connected with ${capitalize(user_integration)}`,
		FRENCH: `Vous êtes connecté à ${capitalize(user_integration)}`,
		SPANISH: `Estás conectado a ${capitalize(user_integration)}`,
	},
	CONNECTED_WITH_CALENDLY: {
		ENGLISH: `You are connected with Calendly`,
		FRENCH: `Vous êtes connecté avec Calendly`,
		SPANISH: `Estas conectado a Calendly`,
	},
	CRM_ADMIN_IS_NOT_CONNECTED_WITH_SALESFORCE: {
		ENGLISH: `CRM admin is not connected with ${capitalize(user_integration)}`,
		FRENCH: `Le CRM de l'administrateur n'est pas connecté à ${capitalize(
			user_integration
		)}`,
		SPANISH: `CRM admin is not connected with ${capitalize(user_integration)}`,
	},
	IS_CONNECTED_WITH_SALESFORCE: {
		ENGLISH: `is connected with ${capitalize(user_integration)}`,
		FRENCH: `est connecté à ${capitalize(user_integration)}`,
		SPANISH: `está conectado con ${capitalize(user_integration)}`,
	},
	SYNC_YOUR_CALENDAR_ACTIVITIES: {
		ENGLISH: `Sync your calendar activities with ${capitalize(user_integration)}`,
		FRENCH: `Synchroniser vos activités du calendrier avec ${capitalize(
			user_integration
		)}`,
		SPANISH: `Sincroniza tus actividades del calendario con ${capitalize(
			user_integration
		)}`,
	},
	SYNC_YOUR_NOTE_ACTIVITIES: {
		ENGLISH: `Sync your note activities with ${capitalize(user_integration)}`,
		FRENCH: `Synchroniser vos activités de notes avec ${capitalize(user_integration)}`,
		SPANISH: `Sincroniza tus actividades de notas con ${capitalize(user_integration)}`,
	},
	SYNC_YOUR_EMAIL_ACTIVITIES: {
		ENGLISH: `Sync your email activities with ${capitalize(user_integration)}`,
		FRENCH: `Synchroniser vos activités d’emails avec ${capitalize(user_integration)}`,
		SPANISH: `Sincroniza tus actividades de emails con ${capitalize(user_integration)}`,
	},
	SALESPERSON_DASHBOARD: {
		ENGLISH: `Salesperson Dashboard`,
		FRENCH: `Dashboard Commercial`,
		SPANISH: `Panel De Control Del Comercial`,
	},
	INTEGRATION_LEAD_URL: {
		ENGLISH: `${capitalize(user_integration)} lead URL`,
		FRENCH: `URL prospect ${capitalize(user_integration)}`,
		SPANISH: `URL de lead de ${capitalize(user_integration)}`,
	},
	LOGIN_TO_INTEGRATION: {
		ENGLISH: `login to ${capitalize(user_integration)}`,
		FRENCH: `se connecter à ${capitalize(user_integration)}`,
		SPANISH: `iniciar sesión en ${capitalize(user_integration)}`,
	},
	TO_SIGN_IN_TO_INTEGRATION: {
		ENGLISH: `To sign into ${capitalize(
			user_integration
		)}, simply click on the link below, and you’ll be redirected to an access authorisation request. Make sure that the email address you use for this login is one that has a ${capitalize(
			user_integration
		)} database associated with it. Once you’ve signed in, you’ll be automatically redirected to your onboarding`,
		FRENCH: `Pour vous connecter à ${capitalize(
			user_integration
		)}, il vous suffit de cliquer sur le lien ci-dessous, vous allez être redirigé vers une demande d’autorisation d’accès. Faites attention à ce que l’adresse mail proposée pour cette connexion soit bien une adresse mail possédant une base de données ${capitalize(
			user_integration
		)}. Une fois la connexion établie vous allez être redirigé automatiquement vers votre Onboarding.`,
		SPANISH: `Para iniciar sesión en ${capitalize(
			user_integration
		)}, haz clic en el siguiente enlace y se abrirá una solicitud de autorización de acceso. Asegúrate de que la dirección de email que utilizas para iniciar sesión tiene una base de datos de ${capitalize(
			user_integration
		)} asociada. En cuanto inicies la sesión, el sistema te redirigirá al proceso de incorporación`,
	},
	NOW_CLICK_ON_THE_LINK_BELOW: {
		ENGLISH: `Now, click on the link below:`,
		FRENCH: `Cliquez sur le lien ci-dessous maintenant:`,
		SPANISH: `Ahora, haz clic en este enlace:`,
	},
	TO_START_THE_INSTALLATION: {
		ENGLISH: `To start the installation, copy the link section below “packaging/installPackage.apexp?p0=04t7Q000000IKxW” and insert it into the top of the page you've opened in ${capitalize(
			user_integration
		)}, and paste it after “name-of-your-company.lightning.force.com/…“, replacing the rest. You'll then be taken to a new page, where you'll be asked to select who will be using this installation. Validate the conditions and click on “Install”, A small window will open, allowing you to confirm the access permissions to a third-party site (which will communicate data needed for the installation). `,
		FRENCH: `Pour lancer l’installation, il vous faut copier une partie du lien ci-dessous « packagingSetupUI/ipLanding.app ?apvidB=000000009oZ3JBI » et l’insérer sur le haut de la page préalablement ouverte de ${capitalize(
			user_integration
		)}, collez le à la suite de « nom-de-votre-entreprise.lightning.force.com/… » en remplaçant le reste. Vous allez découvrir une nouvelle page où l’on vous demandera de choisir pour qui cette installation sera profitable. Valider les conditions et cliquez sur « Install ». Une petite fenêtre apparaîtra afin que vous puissiez confirmer vous avez laissé les accès à un site tier (qui transmettra des données pour l’installation). `,
		SPANISH: `Para iniciar la instalación, copia la parte del enlace «packaging/installPackage.apexp?p0=04t7Q000000IKxW» e insértala en la parte superior de la página que has abierto en ${capitalize(
			user_integration
		)}. Debes pegarla justo después de «nombre-de-tu-empresa.lightning.force.com/…», sustituyendo el resto. A continuación, accederás a una nueva página en la que deberás seleccionar quién va a utilizar esta instalación. Acepta las condiciones y haz clic en «Instalar». Se abrirá una pequeña ventana para confirmar los permisos de acceso a un sitio de terceros (que comunicará los datos necesarios para la instalación). `,
	},
	KINDLY_GENERATE_AN_API_TOKEN: {
		ENGLISH: `kindly generate an API token and add it to your ${capitalize(
			user_integration
		)} custom settings in order to sync ${capitalize(
			user_integration
		)} data with the tool.`,
		FRENCH: `veuillez générer un jeton API et l'ajouter à vos paramètres personnalisés ${capitalize(
			user_integration
		)} afin de synchroniser les données ${capitalize(user_integration)} avec l'outil.`,
		SPANISH: `genera un token de API y añádelo a tu configuración personalizada de ${capitalize(
			user_integration
		)} para sincronizar los datos de ${capitalize(user_integration)} con la herramienta.`,
	},
	INTEGRATION_NOT_CONNECTED: {
		ENGLISH: `salesforce not connected`,
		FRENCH: `salesforce non connecté`,
		SPANISH: `salesforce no está conectado`,
	},
	PLEASE_CONNECT_TO_INTEGRATION: {
		ENGLISH: `please connect to ${capitalize(
			user_integration
		)} on the cadence tool to use the extension`,
		FRENCH: `veuillez vous connecter à ${capitalize(
			user_integration
		)} sur l'outil cadence pour utiliser l'extension`,
		SPANISH: `conéctate a ${capitalize(
			user_integration
		)} en la herramienta Cadence para utilizar la extensión`,
	},
	CONNECT_TO_INTEGRATION: {
		ENGLISH: `connect to ${capitalize(user_integration)}`,
		FRENCH: `connectez-vous à ${capitalize(user_integration)}`,
		SPANISH: `conectar con ${capitalize(user_integration)}`,
	},
	EXTRACT_INFORMATION_FROM_LINKEDIN: {
		ENGLISH: `extract information from LinkedIn to your cadence tool.`,
		FRENCH: `extraire les informations de LinkedIn vers l'outil Cadence.`,
		SPANISH: `extraer información de LinkedIn a la herramienta Cadence.`,
	},
	ENTER_LINKEDIN_URL: {
		ENGLISH: `enter linkedIn URL`,
		FRENCH: `entrez l'URL linkedIn`,
		SPANISH: `introducir la URL de linkedIn`,
	},
	ENTER_COOKIE: {
		ENGLISH: `enter cookie`,
		FRENCH: `entrez les cookies`,
		SPANISH: `introducir la cookie`,
	},
	EXTRACT_INFORMATION: {
		ENGLISH: `extract information `,
		FRENCH: `extraire les informations`,
		SPANISH: `extraer información `,
	},
	INTEGRATION_EXPORT_COMPLETED: {
		ENGLISH: `salesforce export completed`,
		FRENCH: `exportation de ${capitalize(user_integration)}s terminée`,
		SPANISH: `exportación de ${capitalize(user_integration)} finalizada `,
	},
	CADENCE_EXPORT_COMPLETED: {
		ENGLISH: `cadence export completed`,
		FRENCH: `exportation de Cadence terminée`,
		SPANISH: `exportación de Cadence finalizada `,
	},
	UNABLE_TO_PERFORM_INTEGRATION_ACTION: {
		ENGLISH: `unable to perform ${capitalize(user_integration)} action`,
		FRENCH: `impossible d'effectuer l'action ${capitalize(user_integration)}`,
		SPANISH: `no se puede realizar la acción de ${capitalize(user_integration)} `,
	},
	SIGN_IN_WITH_INTEGRATION_TO_ACCESS_THIS_FEATURE: {
		ENGLISH: `sign in with ${capitalize(user_integration)} to access this feature`,
		FRENCH: `connectez-vous avec ${capitalize(
			user_integration
		)} pour accéder à cette fonctionnalité`,
		SPANISH: `inicia sesión con ${capitalize(
			user_integration
		)} para acceder a esta función `,
	},
	SIGN_IN_WITH_INTEGRATION: {
		ENGLISH: `sign in with ${capitalize(user_integration)}`,
		FRENCH: `connexion avec ${capitalize(user_integration)}`,
		SPANISH: `iniciar sesión con ${capitalize(user_integration)} `,
	},
	API_TOKEN: {
		ENGLISH: `API Tokens`,
		FRENCH: `jetons d'API`,
		SPANISH: `tokens de API `,
	},
	INTEGRATION_API_TOKEN: {
		ENGLISH: `salesforce API Token`,
		FRENCH: `jeton d'API ${capitalize(user_integration)}`,
		SPANISH: `token de API de ${capitalize(user_integration)} `,
	},
	SESSION_COOKIE_EXPIRED: {
		ENGLISH: `Session Cookie has expired`,
		FRENCH: `Le cookie de session a expiré`,
		SPANISH: `La cookie de sesión ha caducado`,
	},
	UPDATE_SESSION_COOKIE_IN_PROFILE: {
		ENGLISH: `Your session cookie has expired. Please update the session cookie in your profile page`,
		FRENCH: `Votre cookie de session a expiré. Veuillez mettre à jour le cookie de session dans votre page de profil`,
		SPANISH: `Su cookie de sesión ha caducado. Actualice la cookie de sesión en su página de perfil.`,
	},
	VISIT_LINKEDIN_PROFILE: {
		ENGLISH: `Visit Linkedin profile`,
		FRENCH: `Visita el perfil de Linkedin`,
		SPANISH: `Visiter le profil Linkedin`,
	},
	SALESFORCE: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	pipedrive: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	hubspot: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	sellsy: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	dynamics: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	zoho: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	bullhorn: {
		ENGLISH: `${capitalize(user_integration)}`,
		FRENCH: `${capitalize(user_integration)}`,
		SPANISH: `${capitalize(user_integration)}`,
	},
	USE_EMAIL_WITH_DATABASE: {
		ENGLISH: `Use email address with a ${capitalize(
			user_integration
		)} database associated`,
		FRENCH: `Veuillez utiliser une adresse email avec une base de données ${capitalize(
			user_integration
		)} associée`,
		SPANISH: `Utiliza una cuenta email con una base de datos de ${capitalize(
			user_integration
		)} asociada `,
	},
	MATCH_FIELDS: {
		ENGLISH: `Match your ${capitalize(user_integration)} fields to
    our existing Cadence fields`,
		FRENCH: `Faîtes correspondre vos champs ${capitalize(
			user_integration
		)} avec les champs Cadence existants`,
		SPANISH: `Aligna tus campos de ${capitalize(
			user_integration
		)} con tus campos de Salesforce existentes
	`,
	},
});

export default useIntegrationTranslations;
