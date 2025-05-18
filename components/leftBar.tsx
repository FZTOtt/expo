import { StyleSheet, Text, View } from "react-native";
import Button from "./button";
import WordsIcon from '@/assets/icons/words.svg';
import ChatIcon from '@/assets/icons/chat.svg';
import AccountIcon from '@/assets/icons/account.svg';
import Phrases from '@/assets/icons/phrases.svg';
import { router, usePathname } from "expo-router";

const LeftBar = () => {

    const pathname = usePathname();

    const navItems = [
      { path: '/', label: 'СЛОВА', Icon: WordsIcon },
      { path: '/phrases', label: 'ФРАЗЫ', Icon: Phrases },
      { path: '/aichat', label: 'ОБЩЕНИЕ', Icon: ChatIcon },
      { path: '/account', label: 'АККАУНТ', Icon: AccountIcon },
    ];

    return (
        <View style={styles.container}>
          <Text style={styles.logo}>OUZI</Text>
          {navItems.map((item) => (
            <Button
              key={item.path}
              mode="navigation"
              active={pathname === item.path}
              Icon={item.Icon}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(19, 31, 36, 1)',
        maxWidth: 300,
        minWidth: 250,
        width: '30%',
        paddingHorizontal: 30,
        alignItems: 'center',
        borderRightColor: 'rgba(82, 101, 109, 1)',
        borderRightWidth: 2,
    },
    logo: {
        fontSize: 30,
        color: 'white',
        paddingVertical: 30,
    }
})

export default LeftBar;