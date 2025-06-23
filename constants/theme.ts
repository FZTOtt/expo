export const COLORS = {
    primary: 'rgba(63, 133, 167, 1)',
    secondary: '#EE5013',
    backgroundMain: 'rgba(19, 31, 36, 1)',
    text: '#4B4942',
    error: '#FF0000',
    success: '#00FF00',
    borderPrimary: 'rgba(63, 133, 167, 1)',
};

export const FONT_SIZES = {
    small: 14,
    medium: 16,
    large: 20,
    xlarge: 60,
    logo: 30,
};

export const SPACING = {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 25,
};

export const BORDER_RADIUS = {
    sm: 5,
    md: 10,
    lg: 15,
    xl: 20,
};

export const BORDER_WIDTH = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export const getFontSizes = (deviceType: 'pc' | 'tablet' | 'mobile') => {
    const baseSizes = {
        small: 16,
        medium: 20,
        large: 30,
        xlarge: 60,
        exerciseTask: 40,
        logo: 30,
        leftDis: 50,
        botDis: 20
    };

    if (deviceType === 'mobile') {
        return {
            small: 16,
            medium: 20,
            large: 25,
            xlarge: 40,
            exerciseTask: 30,
            logo: 26,
            leftDis: 35,
            botDis: 7
        };
    }

    return baseSizes;
};

export const getButtonSizes = (deviceType: 'pc' | 'tablet' | 'mobile') => {
    const baseSizes = {
        horizontalLarge: 80,
        verticalLarge: 15,
        borderRadius: 12,
    };

    if (deviceType === 'mobile') {
        return {
            horizontalLarge: 30,
            verticalLarge: 10,
            borderRadius: 12,
        };
    }

    return baseSizes;
};