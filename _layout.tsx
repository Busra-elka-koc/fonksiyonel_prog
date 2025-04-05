import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="gameScreen"/>
      </Stack>
    </>
  );
}
