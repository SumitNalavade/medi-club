import { StyleSheet, View, Text } from 'react-native';

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text>Inventory Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});
