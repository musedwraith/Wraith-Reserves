import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGoals } from "../../../src/context/GoalsContext";
import { fmt } from "../../../src/components/Currency";

export default function EditGoal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { state, updateGoal } = useGoals();
  const goal = state.goals.find(g => g.id === id);

  const [name, setName] = useState(goal?.name || "");
  const [target, setTarget] = useState(String(goal?.target || ""));

  if (!goal) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#fff" }}>No ledger in these stars.</Text>
      </View>
    );
  }

  const save = () => {
    if (!name || !target) {
      return Alert.alert("Please enter a name for your savings goal and a target amount.");
    }
    updateGoal(id, { name, target: Number(target) });
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ color: "#A87BBE", fontSize: 18, fontWeight: "700" }}>
        Edit Savings Goal
      </Text>

      <TextInput
        style={input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#666"
      />
      <TextInput
        style={input}
        value={target}
        onChangeText={setTarget}
        keyboardType="numeric"
        placeholder="Total"
        placeholderTextColor="#666"
      />

      <Text style={{ color: "#888" }}>
        Currently saved: {fmt(goal.saved)}
      </Text>

      <TouchableOpacity onPress={save} style={button}>
        <Text style={buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const input = {
  backgroundColor: "#1a1a1a",
  color: "#eee",
  padding: 10,
  borderRadius: 8,
};
const button = {
  backgroundColor: "#262626",
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
};
const buttonText = { color: "#A87BBE", fontWeight: "700" };
