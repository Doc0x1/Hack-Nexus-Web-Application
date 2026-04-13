import styles from './loading-spinner.module.css';

export default function LoadingSpinner() {
    return (
        <div className={`${styles.spinnerContainer} backdrop-blur-sm`}>
            <div className={styles.spinner}></div>
        </div>
    );
}
