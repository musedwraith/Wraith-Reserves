import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useGoals } from "../src/context/GoalsContext";
import ProgressBar from "../src/components/ProgressBar";
import { fmt } from "../src/components/Currency";

export default function Dashboard() {
  const { state, addGoal } = useGoals();
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const router = useRouter();

  const create = () => {
    if (!newName || !newTarget) return Alert.alert("Enter a name and target");
    const id = addGoal({ name: newName, target: Number(newTarget) });
    setNewName("");
    setNewTarget("");
    router.push(`/goal/${id}`);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      {/* Create new goal */}
      <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 12, gap: 8 }}>
        <Text style={{ color: "#bbb" }}>Create a New Savings Goal</Text>
        <TextInput
          placeholder="Name (e.g., Income)"
          placeholderTextColor="#666"
          value={newName}
          onChangeText={setNewName}
          style={input}
        />
        <TextInput
          placeholder="Target amount (e.g., 1100)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={newTarget}
          onChangeText={setNewTarget}
          style={input}
        />
        <TouchableOpacity onPress={create} style={btn}>
          <Text style={btnText}>Add a New Savings Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Goals list */}
      <FlatList
        data={state.goals}
        keyExtractor={(g) => g.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => {
          const remaining = Math.max(0, item.target - item.saved);
          const progress = item.target ? item.saved / item.target : 0;

          return (
            <Link href={`/goal/${item.id}`} asChild>
              <TouchableOpacity style={card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={title}>{item.name}</Text>
                  <Text style={title}>{fmt(item.target)}</Text>
                </View>
                <ProgressBar progress={progress} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                  <Text style={sub}>
                    Saved {fmt(item.saved)} ({Math.round(progress * 100)}%)
                  </Text>
                  <Text style={sub}>Remaining {fmt(remaining)}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: "#777", textAlign: "center" }}>
            No ledger is orbiting these stars. Create one above.
          </Text>
        }
      />
    </View>
  );
}

const card = { backgroundColor: "#141414", borderRadius: 12, padding: 12 };
const title = { color: "#eee", fontSize: 16, fontWeight: "700" };
const sub = { color: "#aaa" };
const btn = { backgroundColor: "#262626", padding: 12, borderRadius: 10, alignItems: "center" };
const btnText = { color: "#A87BBE", fontWeight: "700" };
const input = { backgroundColor: "#1a1a1a", color: "#eee", padding: 10, borderRadius: 8 };
