import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Button from "./button";
import WordsIcon from '@/assets/icons/words.svg';
import ChatIcon from '@/assets/icons/chat.svg';
import AccountIcon from '@/assets/icons/account.svg';
import Phrases from '@/assets/icons/phrases.svg';
import { router, usePathname } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { restoreSession } from "@/redux/user";
import { RootState } from "@/redux/store";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
const Navigation = () => {

    const pathname = usePathname();
    const {isAuthorized} = useAppSelector((state: RootState) => state.user)

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isAuthorized) return
        dispatch(restoreSession());
    }, [isAuthorized]);


    const {width} = useWindowDimensions();
    const isMobile = width < 768;

    const navItems = [
      { path: '/', label: 'СЛОВА', Icon: WordsIcon },
      { path: '/phrases', label: 'ФРАЗЫ', Icon: Phrases },
      { path: '/aichat', label: 'ОБЩЕНИЕ', Icon: ChatIcon },
      { path: '/account', label: 'АККАУНТ', Icon: AccountIcon },
    ];

    
    // if (isMobile) return null;
    return (
        <View style={[
          !isMobile && styles.mainContainer,
          isMobile && styles.mobileContainer
          ]}>
          {!isMobile && <Text style={styles.logo}>OUZI</Text>}
          {navItems.map((item) => (
            <Button
              key={item.path}
              mode="navigation"
              active={pathname === item.path}
              Icon={item.Icon}
              onClick={() => router.push(item.path as any)}
              isMobile={isMobile}
            >
              {!isMobile && item.label}
            </Button>
          ))}
        </View>
      );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(19, 31, 36, 1)',
        maxWidth: 250,
        minWidth: 250,
        paddingHorizontal: 30,
        alignItems: 'center',
        borderRightColor: 'rgba(82, 101, 109, 1)',
        borderRightWidth: 2,
    },
    mobileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderPrimary,
        paddingVertical: SPACING.sm,
    },
    logo: {
        fontSize: FONT_SIZES.logo,
        color: 'white',
        paddingVertical: 30,
    }
})

export default Navigation;