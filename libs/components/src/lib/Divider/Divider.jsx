import styles from "./Divider.module.scss";

const Divider = ({ className, ...rest }) => {
	return <div className={styles.divider + " " + className} {...rest}></div>;
};

export default Divider;
