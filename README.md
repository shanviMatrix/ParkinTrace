# ParkinTrace - Parkinson's Monitoring App
**ParkinTrace** is a NativeScript & TypeScript mobile app designed to monitor Parkinson's patients and provide peace of mind to caregivers. It features a real-time dashboard for "Live Vitals" (Heart Rate, Blood Oxygen, Tremor, Fall Status) that updates automatically. The app's core feature is a "Smart Fall Detection" system: when a fall is detected, the app flashes a visual alert and starts an inactivity timer. If the user does not dismiss the alert by confirming they are "OK" (within 10 seconds for this demo), an SOS is automatically triggered, simulating a call to caregivers and emergency services. The app also includes a manual "SOS" button and a "Connect to Doctor" contact button.

## ✨ Core Features

* **Real-time Vitals Dashboard:** Automatically monitors and displays simulated Heart Rate, Blood Oxygen, Tremor Status, and Fall Status.
* **Live Alert System:** Dynamically changes card styles (`.card-tremor-alert`, `.card-fall-alert`) based on live data.
* **CSS Animation:** Uses `@keyframes` to create a flashing "pulse" animation for fall alerts.
* **Smart Inactivity Timer:** A 10-second (demo) timer triggers an auto-SOS if a fall alert is not dismissed by the user.
* **Emergency Buttons:** Includes manual "SOS" and "Connect to Doctor" buttons.
* **Data-Driven Navigation:** Tapping vitals cards navigates to details pages, passing the live data via `navigationContext`.
* **Info & Exercises Scroll:** A horizontal `ScrollView` with tappable cards for patient information.

## 🛠️ Tech Stack & Core Concepts

This project was built from scratch to demonstrate core NativeScript concepts, ensuring 100% compatibility with `ns preview` (Playground).

* **Framework:** **`@nativescript/core`**
* **Language:** **`TypeScript`** (for all application logic, state management, and event handling).
* **UI Layout:** **`NativeScript XML`** (using `<GridLayout>`, `<StackLayout>`, `<ScrollView>`, `<Button>`, `<Label>`).
* **Styling:** **`CSS`** (all styles are in `app.css` with custom classes).
* **CSS Animations:** **`@keyframes`** (used to create the `pulse` animation for the `.card-fall-alert`).
* **State Management:** **`Observable`** from `@nativescript/core`. The entire UI is driven by a `viewModel` object.
* **Data Binding:** One-way data binding (e.g., `text="{{ heartRate }}"`, `class="{{ fallStatusClass }}"`) is used to link the `viewModel` to the UI.
* **Navigation:** **`Frame.topmost().navigate()`** is used for navigating between the dashboard and details pages.
* **Native Modules:** **`Dialogs`** module (`Dialogs.alert`, `Dialogs.confirm`) is used for all native popups and alerts.
* **Event Handling:** `tap="onTapFunction"` in XML bound to `export function` in TypeScript.
* **Async Operations:** JavaScript's **`setInterval()`** (to simulate sensor data) and **`setTimeout()`** (to manage the fall alert timer).

## 📲 How to Run (Using `ns preview`)

This project is 100% compatible with the **NativeScript Playground** app (no emulator needed).

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(If `npm install` fails, do a "Super Clean" install: `rimraf node_modules`, `del package-lock.json`, and then `npm install`)*

2.  **Run the Preview Server:**
    ```bash
    ns preview
    ```

3.  **On Your Phone (CRITICAL STEP):**
    * Install the "NativeScript Playground" app from the Play Store.
    * Go to **Settings -> Apps -> NativeScript Playground -> Storage & cache**.
    * Tap **"Clear Storage"** and **"Clear Cache"**. 
        *(This is necessary so the app doesn't crash because of old code.)*
    * Open the reset app and scan the QR code from your terminal. 
