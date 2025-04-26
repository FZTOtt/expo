export interface ButtonProps {
    mode: 'navigation' | 'modules' | 'references';
    active?: boolean;
    size?: 'lg' | 'md' | 'sm'
    icon?: string,
    onClick?: () => void;
    children?: React.ReactNode;
}