import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

export interface ButtonProps {
    mode: 'navigation' | 'modules' | 'references';
    active?: boolean;
    size?: 'lg' | 'md' | 'sm';
    Icon?: React.FC<SvgProps>;
    onClick?: () => void;
    children?: React.ReactNode;
}

export interface AudioPlayerProps {
    buttonStyle?: StyleProp<ViewStyle>;
    audioUrl: string | null;
    children?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
}