import React, { createContext, useContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";

const GoalsContext = createContext();

const initialState = { goals: [], loaded: false };

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, goals: action.payload || [], loaded: true };
    case "ADD_GOAL":
      return { ...state, goals: [...state.goals, action.payload] };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map(g => (g.id === action.payload.id ? action.payload : g)),
      };
    case "DELETE_GOAL":
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    default:
      return state;
  }
}

export function GoalsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("GOALS");
      dispatch({ type: "LOAD", payload: raw ? JSON.parse(raw) : [] });
    })();
  }, []);

  useEffect(() => {
    if (state.loaded) AsyncStorage.setItem("GOALS", JSON.stringify(state.goals));
  }, [state.goals, state.loaded]);

  const addGoal = ({ name, target }) => {
    const goal = {
      id: nanoid(),
      name,
      target: Number(target),
      saved: 0,
      targetDate: null,
      records: [], // {id, amount, date, note}
      createdAt: Date.now(),
    };
    dispatch({ type: "ADD_GOAL", payload: goal });
    return goal.id;
  };

  const addSaving = (goalId, amount, note = "") => {
    const g = state.goals.find(x => x.id === goalId);
    if (!g) return;
    const rec = { id: nanoid(), amount: Number(amount), date: Date.now(), note };
    const updated = { ...g, saved: g.saved + rec.amount, records: [rec, ...g.records] };
    dispatch({ type: "UPDATE_GOAL", payload: updated });
  };

  const setTargetDate = (goalId, millis) => {
    const g = state.goals.find(x => x.id === goalId);
    if (!g) return;
    dispatch({ type: "UPDATE_GOAL", payload: { ...g, targetDate: millis } });
  };

  const updateGoal = (goalId, patch) => {
    const g = state.goals.find(x => x.id === goalId);
    if (!g) return;
    dispatch({ type: "UPDATE_GOAL", payload: { ...g, ...patch } });
  };

  const removeGoal = goalId => dispatch({ type: "DELETE_GOAL", payload: goalId });

  return (
    <GoalsContext.Provider value={{ state, addGoal, addSaving, setTargetDate, updateGoal, removeGoal }}>
      {children}
    </GoalsContext.Provider>
  );
}

export const useGoals = () => useContext(GoalsContext);
