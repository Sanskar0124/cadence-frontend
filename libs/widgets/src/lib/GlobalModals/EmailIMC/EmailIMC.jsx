import ViewEmailIMC from "./components/ViewEmailIMC/ViewEmailIMC";
import ComposeEmailIMC from "./components/ComposeEmailIMC/ComposeEmailIMC";

const EmailIMC = ({ preview, ...rest }) => {
	return preview ? <ViewEmailIMC {...rest} /> : <ComposeEmailIMC {...rest} />;
};

export default EmailIMC;
