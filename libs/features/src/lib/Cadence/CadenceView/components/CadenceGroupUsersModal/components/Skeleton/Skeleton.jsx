import styles from "./Skeleton.module.scss";

const Skeleton = ({ className, ...rest }) => {
	return <div className={`${styles.skeletonLoader} ${className}`} {...rest} />;
};

export default Skeleton;
