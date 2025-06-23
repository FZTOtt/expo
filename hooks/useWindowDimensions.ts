import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const useWindowDimensions = () => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [deviceType, setDeviceType] = useState<'pc' | 'tablet' | 'mobile'>(
        Dimensions.get('window').width > 1200 
            ? 
            'pc'
            :
            Dimensions.get('window').width < 768 
                ?
                'mobile'
                :
                'tablet'
    );

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
            setDimensions(window);
            setDeviceType(
                window.width > 1200 
                ? 
                'pc'
                :
                window.width < 768 
                    ?
                    'mobile'
                    :
                    'tablet'
            )
        });

        return () => subscription.remove();
    }, []);

    return {
        deviceType
    };
}; 