# Wraith Reserves

## Overview
Wraith Reserves is a savings tracker designed to let users create goals, record deposits, and track progress with a clean, minimal interface. The app persists data locally via AsyncStorage, which means no server is required. The theme blends deep purples, and pastel highlights.

---


## Project Setup
1. Clone the repository:
   ```
   git clone https://github.com/musedwraith/WraithReserves
   cd wraith-reserves
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Install Expo Router:
   ```
   npx expo install expo-router react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
   ```
4. Install required package
   ```
   npm install nanoid
   ```
5. Start the app:
   ```
   npm start
   ```
6. Open your browser and navigate to:
   ```
   http://localhost:8081/
   ```
7. Optionally, install Expo Go on your phone through an app store:
   ```
   Open Expo Go and scan the QR code generated in the termimal after running "npm start"
   ```

## File Structure
- **app/_layout.js** – App screens and navigation.
- **app/index.js** – Main screen.
- **app/goal/[id].js** – Goals details and edit screens.
- **app/goal/edit/[id].js** – Edit the goals screen.
- **assets/** - App icons and splash images.
- **scr/componets/Currency.js** - Currency formatting helper in USD.
- **scr/componets/ProgressBar.js** - Reusable progress bar for new goals.
- **scr/context/GoalsContext.js** - Global state of goals and savings records.
- **app.json** - Expo configuration.
- **package.json** - Project manifest with Expo and React.
- **README.md** - Project documentation


## GENERAL LAYOUT
Expo Router with a single stack:
- Main Screen
- Goal Details Screen
- Edit Goal Screen

## Current Functionality
1. Create a savings goal with a name and target amount.
2. Add savings with an amount and an optional note.
3. View the progress made toward reaching that savings goal based on the amount saved and the total desired amount.
4. View records in reverse chronological order.
5. Edit the name and target amount of the savings goal.
6. Set a target date of 30 days.
7. Persistent Storage where data survives if the app restarts.
8. Matches the "wraith" branding.

## Future Enhancements
- Custom date picker for target dates.
- Percent made toward progress saved.
- Multi-currency support.
- Data export (CSV/JSON).
- Goal deadlines where users see exactly how much they need to save eachd ay or week to stay on track.
- A countdown timer in a cosmic style like a moon slowly eclipsling as the time runs out.
- Progress bar has two overlays: an actual savings and where the savings should be by today.
- Show a visual history of savings growth over time in a graph form.
- Star map that lights up more constallations as savings increase over time.
- Toggle between the last 30 days and all time views for the graph.


## Landing Page
![Landing Page](.Image Progress/Wraith Reserves - 01 - Landing Screen.jpg)

## Goal Details
![Goal Details](./Image%20Progress/Wraith Reserves - 03 - Target Date Added AND Add More to Savings Goal.jpg)

## Updated Goal
![Updated Goal](./Image%20Progress/Wraith Reserves - 04 - More Added to Savings Goal.jpg)

## Updated Landing Page
![Updated Landing Page](./Image%20Progress/Wraith Reserves - 05 - Landing Screen Updated With Goals.jpg)