import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(
    goal?.targetDate ? new Date(goal.targetDate) : new Date()
  );

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

  // Open the picker prefilled with current/selected date
  const openDatePicker = () => {
    setTempDate(goal.targetDate ? new Date(goal.targetDate) : new Date());
    setShowDatePicker(true);
  };

  // Handle native change (Android commits immediately)
  const onChangeDate = (_event, selected) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (!selected) return; // dismissed
    setTempDate(selected);
    if (Platform.OS === "android") {
      setTargetDate(goal.id, selected.getTime());
    }
  };

  // iOS confirm (since picker can be inline)
  const confirmIOSDate = () => {
    setTargetDate(goal.id, tempDate.getTime());
    setShowDatePicker(false);
  };

  // Clear the target date
  const clearTargetDate = () => {
    setTargetDate(goal.id, null);
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
        <Text style={{ color: "#aaa" }}>
          Saved {fmt(goal.saved)} ({Math.round(progress * 100)}%)
        </Text>
        <Text style={{ color: "#aaa" }}>Remaining {fmt(remaining)}</Text>
      </View>

        <Text style={{ color: "#888" }}>Goal {fmt(goal.target)}</Text>
        {/* Target date row (NEW) */}
<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
  <Text style={{ color: "#888" }}>
    {goal.targetDate
      ? `Target date ${new Date(goal.targetDate).toLocaleDateString()}`
      : "No target date"}
  </Text>
  <View style={{ flexDirection: "row", gap: 8 }}>
    <TouchableOpacity onPress={openDatePicker} style={button}>
      <Text style={buttonText}>{goal.targetDate ? "Change Date" : "Set Date"}</Text>
    </TouchableOpacity>
    {goal.targetDate && (
      <TouchableOpacity onPress={clearTargetDate} style={[button, { backgroundColor: "#3a1a1a" }]}>
        <Text style={[buttonText, { color: "#ff6b6b" }]}>Clear</Text>
      </TouchableOpacity>
    )}
  </View>
</View>

{/* Keep your existing action row: Edit + Delete */}
<View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
  <Link href={`/goal/edit/${goal.id}`} asChild>
    <TouchableOpacity style={button}>
      <Text style={buttonText}>Edit</Text>
    </TouchableOpacity>
  </Link>
  <TouchableOpacity onPress={del} style={[button, { backgroundColor: "#3a1a1a" }]}>
    <Text style={[buttonText, { color: "#ff6b6b" }]}>Delete</Text>
  </TouchableOpacity>
</View>

{/* Native DateTimePicker (NEW) */}
{showDatePicker && (
  <View style={{ marginTop: 8 }}>
    <DateTimePicker
      value={tempDate}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "default"}
      onChange={onChangeDate}
      minimumDate={new Date()} // remove if you want to allow past dates
    />
    {Platform.OS === "ios" && (
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8, gap: 8 }}>
        <TouchableOpacity onPress={() => setShowDatePicker(false)} style={[button, { backgroundColor: "#222" }]}>
          <Text style={buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmIOSDate} style={button}>
          <Text style={buttonText}>Set Date</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
)}
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
