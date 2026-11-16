import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>碗糖时序</Text>
        <Text style={styles.title}>首页开发环境已准备</Text>
        <Text style={styles.description}>
          下一步将依据 Figma 首页设计逐个模块实现，并使用模拟数据跑通流程。
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEFAEE',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  eyebrow: {
    marginBottom: 12,
    color: '#8A3F1E',
    fontSize: 14,
    letterSpacing: 2,
  },
  title: {
    color: '#3D2118',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    marginTop: 16,
    color: '#6F554B',
    fontSize: 16,
    lineHeight: 26,
  },
});
