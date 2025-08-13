import React from "react";
import { Image, Text, View } from "react-native";
import { Stack } from "expo-router";
import { GoalsProvider } from "../src/context/GoalsContext";

function TitleWithIcon({ title }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Image
        source={require("../assets/images/wraith-jar-icon.png")}
        style={{ width: 51, height: 50, borderRadius: 4 }}
        resizeMode="contain"
      />
      <Text style={{ color: "#A87BBE", fontSize: 24, fontWeight: "700" }}>
        {title}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GoalsProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#A87BBE",
          contentStyle: { backgroundColor: "#0b0b0b" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => <TitleWithIcon title="Wraith Reserves" />,
          }}
        />
        <Stack.Screen
          name="goal/[id]"
          options={{
            headerTitle: () => <TitleWithIcon title="Savings Goal Details" />,
          }}
        />
        <Stack.Screen
          name="goal/edit/[id]"
          options={{
            headerTitle: () => <TitleWithIcon title="Edit Savings Goal" />,
          }}
        />
      </Stack>
    </GoalsProvider>
  );
}
