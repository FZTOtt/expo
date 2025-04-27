import { SvgProps } from "react-native-svg";

export interface ButtonProps {
    mode: 'navigation' | 'modules' | 'references';
    active?: boolean;
    size?: 'lg' | 'md' | 'sm'
    Icon?: React.FC<SvgProps>,
    onClick?: () => void;
    children?: React.ReactNode;
}