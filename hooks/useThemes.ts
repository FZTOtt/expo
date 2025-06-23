import { useWindowDimensions } from './useWindowDimensions';
import { getButtonSizes, getFontSizes } from '../constants/theme';

export const useTheme = () => {
    const { deviceType } = useWindowDimensions();
    
    return {
        fontSizes: getFontSizes(deviceType),
        buttonSizes: getButtonSizes(deviceType)
    };
};