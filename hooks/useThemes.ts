import { useWindowDimensions } from './useWindowDimensions';
import { getFontSizes } from '../constants/theme';

export const useTheme = () => {
    const { deviceType } = useWindowDimensions();
    
    return {
        fontSizes: getFontSizes(deviceType),
    };
};