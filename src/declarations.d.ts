declare module 'react-safe-area-component' {
    import { ReactNode, ComponentType } from 'react';

    interface SafeAreaProps {
        top?: boolean;
        bottom?: boolean;
        left?: boolean;
        right?: boolean;
        children?: ReactNode;
        component?: string | ComponentType<any>;
        style?: React.CSSProperties;
    }

    export const SafeArea: ComponentType<SafeAreaProps>;
}