import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { useGoals } from "../../src/context/GoalsContext";
import ProgressBar from "../../src/components/ProgressBar";
import { fmt } from "../../src/components/Currency";

export default function GoalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { state, addSaving, setTargetDate, removeGoal } = useGoals();
  const goal = state.goals.find(g => g.id === id);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const remaining = useMemo(() => Math.max(0, (goal?.target || 0) - (goal?.saved || 0)), [goal]);
  const progress  = useMemo(() => (goal?.target ? goal.saved / goal.target : 0), [goal]);

  if (!goal) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#fff" }}>Goal not found.</Text>
      </View>
    );
  }

  const save = () => {
    const a = Number(amount);
    if (!a || a <= 0) return Alert.alert("Enter a positive amount");
    addSaving(goal.id, a, note);
    setAmount("");
    setNote("");
  };

  const pickTargetDate = () => {
    const in30 = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days from now
    setTargetDate(goal.id, in30);
    Alert.alert("Target date set to ~30 days from now (MVP).");
  };

  const del = () => {
    Alert.alert("Delete Goal", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          removeGoal(goal.id);
          router.back();
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      {/* Goal Summary */}
      <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 12, gap: 6 }}>
        <Text style={{ color: "#A87BBE", fontSize: 20, fontWeight: "700" }}>{goal.name}</Text>
        <ProgressBar progress={progress} height={10} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#aaa" }}>Saved {fmt(goal.saved)}</Text>
          <Text style={{ color: "#aaa" }}>Remaining {fmt(remaining)}</Text>
        </View>
        <Text style={{ color: "#888" }}>Goal {fmt(goal.target)}</Text>
        {goal.targetDate && (
          <Text style={{ color: "#888" }}>
            Target date {new Date(goal.targetDate).toLocaleDateString()}
          </Text>
        )}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <Link href={`/goal/edit/${goal.id}`} asChild>
            <TouchableOpacity style={button}>
              <Text style={buttonText}>Edit</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={pickTargetDate} style={button}>
            <Text style={buttonText}>Set Target Date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={del} style={[button, { backgroundColor: "#3a1a1a" }]}>
            <Text style={[buttonText, { color: "#ff6b6b" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Saving */}
      <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 12, gap: 8 }}>
        <Text style={{ color: "#bbb" }}>Add Saving</Text>
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={input}
        />
        <TextInput
          placeholder="Add an optional reminder note"
          placeholderTextColor="#666"
          value={note}
          onChangeText={setNote}
          style={input}
        />
        <TouchableOpacity onPress={save} style={button}>
          <Text style={buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Records */}
      <View style={{ flex: 1, backgroundColor: "#141414", borderRadius: 12, padding: 12 }}>
        <Text style={{ color: "#bbb", marginBottom: 8 }}>Records</Text>
        <FlatList
          data={goal.records}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomColor: "#222", borderBottomWidth: 1 }}>
              <Text style={{ color: "#eee" }}>
                {fmt(item.amount)}{" "}
                <Text style={{ color: "#777" }}>{item.note || ""}</Text>
              </Text>
              <Text style={{ color: "#777", fontSize: 12 }}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: "#666" }}>No records yet.</Text>}
        />
      </View>
    </View>
  );
}

const button = { backgroundColor: "#262626", padding: 10, borderRadius: 10 };
const buttonText = { color: "#A87BBE", fontWeight: "700" };
const input = { backgroundColor: "#1a1a1a", color: "#eee", padding: 10, borderRadius: 8 };
