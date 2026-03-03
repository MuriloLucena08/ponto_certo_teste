import { useState } from 'react';
import styles from './topBar.module.css';
import {Sidebar} from '../Sidebar/Sidebar';
import { Header } from '../Commons/Header/Header';
import { IoMdMenu } from 'react-icons/io';

export const TopBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Header
                onBack={() => setSidebarOpen(true)}
                backIcon={<span className={styles.menuIcon} style={{ marginLeft: '20px' }}>
                    <IoMdMenu size={28} />
                    </span>}
            />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
};
