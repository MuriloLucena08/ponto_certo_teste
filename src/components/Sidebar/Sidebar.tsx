import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './sidebar.module.css';
import clsx from 'clsx';
import { IoMapSharp } from 'react-icons/io5';
import { BsPinMapFill, BsInfoSquareFill } from 'react-icons/bs';
import { CiLogout } from 'react-icons/ci';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            <div
                className={clsx(styles.overlay, isOpen && styles.open)}
                onClick={onClose}
            />
            <div className={clsx(styles.sidebar, isOpen && styles.open)}>
                <div className={styles.header}>
                    <h2>Menu</h2>
                </div>
                <nav className={styles.nav}>
                    <button className={styles.item} onClick={() => handleNavigate('/')}>
                        <IoMapSharp size={20} />
                        <span>Mapa</span>
                    </button>
                    <button className={styles.item} onClick={() => handleNavigate('/paradas-banco')}>
                        <BsPinMapFill size={20} />
                        <span>Paradas</span>
                    </button>
                    <button className={styles.item} onClick={() => handleNavigate('/sobre')}>
                        <BsInfoSquareFill size={20} />
                        <span>Sobre</span>
                    </button>
                    <button className={clsx(styles.item, styles.logout)} onClick={handleLogout}>
                        <CiLogout size={20} />
                        <span>Sair</span>
                    </button>
                </nav>
            </div>
        </>
    );
};
