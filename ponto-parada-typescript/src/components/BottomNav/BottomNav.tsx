import { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CurvedNavigationBar.module.css';
import { IoMapSharp } from 'react-icons/io5';
import { FaCirclePlus } from "react-icons/fa6";

const createPath = (width: number, activeIndex: number, itemCount: number): string => {
    if (width === 0 || itemCount === 0) return '';

    const itemWidth = width / itemCount;
    const curveCenter = itemWidth * activeIndex + itemWidth / 2;

    const curveRadius = 35; // Raio da curva
    const curveDepth = 25;  // Profundidade da curva
    const topMargin = 15;   // Margem superior da barra

    const startX = curveCenter - curveRadius;
    const endX = curveCenter + curveRadius;

    const path = `
    M 0 ${topMargin}
    L ${startX} ${topMargin}
    C ${curveCenter - curveRadius / 1.5} ${topMargin}, ${curveCenter - curveRadius / 1.5} ${topMargin - curveDepth}, ${curveCenter} ${topMargin - curveDepth}
    C ${curveCenter + curveRadius / 1.5} ${topMargin - curveDepth}, ${curveCenter + curveRadius / 1.5} ${topMargin}, ${endX} ${topMargin}
    L ${width} ${topMargin}
    L ${width} 80
    L 0 80
    Z
  `;

    return path.trim();
};

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    const items = [
        { path: '/', icon: <IoMapSharp size={24} />, label: 'Mapa' },
        { path: '/registros', icon: <FaCirclePlus size={24} />, label: 'Paradas registradas' },
    ];

    const activeIndex = items.findIndex(item => location.pathname === item.path);
    const currentIndex = activeIndex === -1 ? 0 : activeIndex;

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const pathD = useMemo(() => createPath(width, currentIndex, items.length), [width, currentIndex, items.length]);
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(); // Azul padrão
    const secondaryColor = '#ffffff'; // Cor de destaque

    if (location.pathname !== '/' && location.pathname !== '/registros') return null;

    return (
        <div ref={containerRef} className={styles.navContainer}>
            <svg className={styles.navSvg}>
                <path className={styles.navPath} d={pathD} fill={primaryColor} />
            </svg>

            <div className={styles.buttonsContainer}>
                {items.map((item, index) => (
                    <button
                        key={index}
                        className={`${styles.navButton} ${currentIndex === index ? styles.active : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <div className={styles.activeButtonBg} style={{ backgroundColor: secondaryColor }} />
                        <span className={styles.iconWrapper} style={{ color: currentIndex === index ? primaryColor : 'white' }}>
                            {item.icon}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
