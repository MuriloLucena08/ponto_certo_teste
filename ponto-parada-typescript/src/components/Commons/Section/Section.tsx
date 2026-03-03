import React from 'react';
import styles from './Section.module.css';

interface SectionProps {
    icon?: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({ icon, title, children, className }) => {
    return (
        <div className={className}>
            <div className={styles.sectionHeader}>
                {icon}
                <h2 className={styles.sectionTitle}>{title}</h2>
            </div>
            {children}
        </div>
    );
};
