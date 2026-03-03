import React from 'react';
import styles from './Header.module.css';
import logo from '../../../assets/images/logo.png'; // Assuming logo path
import { IoIosArrowBack } from 'react-icons/io';

interface HeaderProps {
    title?: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    backIcon?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction, children, style, className }) => {
    return (
        <header className={`${styles.header} ${className || ''}`} style={style}>
            <div className={styles.left}>
                {onBack && (
                    <button onClick={onBack} className={styles.backButton}>
                        <IoIosArrowBack />
                    </button>
                )}
            </div>
            <div className={styles.center}>
                {title ? (
                    <h1 className={styles.title}>{title}</h1>
                ) : children ? (
                    children
                ) : (
                    <img src={logo} alt="Ponto Certo" className={styles.logo} />
                )}
            </div>
            <div className={styles.right}>
                {rightAction}
            </div>
        </header>
    );
};
