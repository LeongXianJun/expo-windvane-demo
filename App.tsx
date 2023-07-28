import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { WindVane } from './modules/wind-vane';
import 'expo-dev-client';

export default function App() {
  const onPress = async () => {
    const miniAppId: string = '1511684748103817113600';
    try {
      console.log(
        '[]',
        'init',
        WindVane.init({
          accessKey: 'F8eZ14p5',
          secretKey: 'VZuOyIiN/zbrF7gsk+fS5A==',
          host: 'emas-publish-intl.emas-poc.com',
          appCode: '1611683650779304964096',
        }),
      );
    } catch (e) {
      console.log('[]', 'init e', e);
    }

    WindVane.openMiniApp(miniAppId)
      .then((res) => {
        console.log('[]', 'mini again', res);
      })
      .catch((e) => {
        console.log('[]', 'mini again e ', e);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        onPress={onPress}
        title='Open miniapp'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
