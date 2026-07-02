import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { EditScreenInfo } from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { PLATFORM_OS, STATUS_BAR_STYLE, semanticColors } from '@/lib/ui';

const ModalScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View
        style={styles.separator}
        lightColor={semanticColors.separatorLight}
        darkColor={semanticColors.separatorDark}
      />
      <EditScreenInfo path="app/modal.tsx" />
      <StatusBar
        style={Platform.OS === PLATFORM_OS.ios ? STATUS_BAR_STYLE.light : STATUS_BAR_STYLE.auto}
      />
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
