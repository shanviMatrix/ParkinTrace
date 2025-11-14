import {
  EventData,
  Page,
  Frame,
  Observable,
  Dialogs,
  ApplicationSettings,
} from "@nativescript/core";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";

const viewModel = new Observable();
let sensorTimerId: any = null;
let fallAlertTimerId: any = null;
let isFallAlertActive = false;
let drawer: RadSideDrawer;

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;

  drawer = page.getViewById("drawer") as RadSideDrawer;

  // Load user data for sidebar
  const storedUser = ApplicationSettings.getString("user_data");
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    viewModel.set("userName", userData.fullName || "User");
    viewModel.set("patientId", userData.patientId || "PT12345");
  } else {
    viewModel.set("userName", "Guest User");
    viewModel.set("patientId", "PT00000");
  }

  // Set greeting based on time
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  else if (hour >= 17) greeting = "Good Evening";
  viewModel.set("greetingText", greeting);

  // Initialize vitals
  viewModel.set("heartRate", "--");
  viewModel.set("oxygen", "--");
  viewModel.set("tremor", "Stable");
  viewModel.set("fall", "Safe");
  viewModel.set("tremorStatusClass", "card mini-card");
  viewModel.set("fallStatusClass", "card mini-card");
  viewModel.set("tremorCount", 0);

  page.bindingContext = viewModel;
  startSensorSimulation();
}

export function onNavigatingFrom(args: EventData) {
  stopSensorSimulation();
}

// Sidebar Functions
export function toggleDrawer(args: EventData) {
  console.log("Toggle Drawer Tapped!");
  if (drawer) {
    drawer.toggleDrawerState();
  }
}

export function onProfileTap(args: EventData) {
  console.log("Profile Tapped!");
  Frame.topmost().navigate("Profile/profile-page");
  drawer.closeDrawer();
}

export function onLearnTap(args: EventData) {
  console.log("Learn Tapped!");
  Frame.topmost().navigate("Disease/disease-overview-page");
  drawer.closeDrawer();
}

export function onHealthChartsTap(args: EventData) {
  console.log("Health Charts Tapped!");
  Frame.topmost().navigate("Charts/health-charts-page");
  drawer.closeDrawer();
}

export function onDoctorPageTap(args: EventData) {
  console.log("Doctor Page Tapped!");
  Frame.topmost().navigate("Doctor/doctor-page");
  drawer.closeDrawer();
}

export function onUpdateDoctorTap(args: EventData) {
  console.log("Update Doctor Tapped!");
  Frame.topmost().navigate("Profile/edit-profile-page");
  drawer.closeDrawer();
}

export function onFeedbackTap(args: EventData) {
  console.log("Feedback Tapped!");
  Dialogs.prompt({
    title: "Send Feedback",
    message: "We'd love to hear from you!",
    okButtonText: "Submit",
    cancelButtonText: "Cancel",
    inputType: "text",
    defaultText: ""
  }).then((result) => {
    if (result.result && result.text) {
      console.log("Feedback:", result.text);
      Dialogs.alert({
        title: "Thank You!",
        message: "Your feedback has been submitted successfully.",
        okButtonText: "OK"
      });
    }
  });
  drawer.closeDrawer();
}

export function onLogoutTap(args: EventData) {
  console.log("Logout Tapped!");
  Dialogs.confirm({
    title: "Logout",
    message: "Are you sure you want to logout?",
    okButtonText: "Logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result) {
      ApplicationSettings.setBoolean("isLoggedIn", false);
      Frame.topmost().navigate({
        moduleName: "Auth/login-page",
        clearHistory: true
      });
      console.log("User logged out.");
    }
  });
  drawer.closeDrawer();
}

// Main Page Functions
export function onDoctorTap(args: EventData) {
  console.log("Doctor Tap!");
  Frame.topmost().navigate("Doctor/doctor-page");
}

export function onSOSTap(args: EventData) {
  console.log("Manual SOS Tapped!");
  sendSOSAlert("Manual SOS Request!");
}

export function onCardTap(args: EventData) {
  if (isFallAlertActive) return;
  const currentHeartRate = viewModel.get("heartRate");
  Frame.topmost().navigate({
    moduleName: "Heart/heart-rate-page",
    context: { hrData: currentHeartRate },
  });
}

export function onOxygenCardTap(args: EventData) {
  if (isFallAlertActive) return;
  const currentOxygen = viewModel.get("oxygen");
  Frame.topmost().navigate({
    moduleName: "oxygen/oxygen-page",
    context: { o2Data: currentOxygen },
  });
}

// Sensor Simulation
function startSensorSimulation() {
  if (sensorTimerId) return;
  console.log("Starting sensor simulation...");
  runSimulationTick();
  sensorTimerId = setInterval(runSimulationTick, 2000);
}

function runSimulationTick() {
  if (isFallAlertActive) return;
  
  const newHeartRate = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
  const newOxygen = Math.floor(Math.random() * (100 - 97 + 1)) + 97;
  
  viewModel.set("heartRate", newHeartRate);
  viewModel.set("oxygen", newOxygen);

  if (Math.random() > 0.7) {
    viewModel.set("tremor", "Detected");
    viewModel.set("tremorStatusClass", "card mini-card card-tremor-alert");
    const currentCount = viewModel.get("tremorCount") || 0;
    viewModel.set("tremorCount", currentCount + 1);
  } else {
    viewModel.set("tremor", "Stable");
    viewModel.set("tremorStatusClass", "card mini-card");
  }

  if (Math.random() > 0.95) {
    triggerFallAlert();
  }
}

function stopSensorSimulation() {
  if (sensorTimerId) {
    clearInterval(sensorTimerId);
    sensorTimerId = null;
    console.log("Stopping sensor simulation.");
  }
  if (fallAlertTimerId) {
    clearTimeout(fallAlertTimerId);
    fallAlertTimerId = null;
  }
}

function triggerFallAlert() {
  if (isFallAlertActive) return;
  isFallAlertActive = true;
  
  console.log("FALL DETECTED! Showing popup...");
  viewModel.set("fall", "FALL DETECTED!");
  viewModel.set("fallStatusClass", "card card-fall-alert");

  const alertDuration = 10000;

  fallAlertTimerId = setTimeout(() => {
    console.log("Timer finished. Sending auto-SOS.");
    sendSOSAlert("User did not respond to fall alert.");
    resetFallAlert();
  }, alertDuration);

  Dialogs.confirm({
    title: "⚠️ Fall Detected!",
    message: "Are you OK?\n\nAn SOS will be sent automatically if you don't respond within 10 seconds.",
    okButtonText: "I'm OK",
    cancelButtonText: "Send SOS Now",
  }).then((result) => {
    if (result) {
      console.log("User is OK. Cancelling SOS timer.");
      if (fallAlertTimerId) {
        clearTimeout(fallAlertTimerId);
      }
      resetFallAlert();
    } else {
      console.log("User pressed SEND SOS NOW.");
      if (fallAlertTimerId) {
        clearTimeout(fallAlertTimerId);
      }
      sendSOSAlert("User manually sent SOS after fall.");
      resetFallAlert();
    }
  });
}

function sendSOSAlert(reason: string) {
  console.log(`SENDING SOS: ${reason}`);
  Dialogs.alert({
    title: "🆘 Emergency SOS Sent!",
    message: "Alert signal sent to:\n• Doctor\n• Emergency Contact\n• Ambulance\n\nReason: " + reason,
    okButtonText: "OK",
  });
}

function resetFallAlert() {
  isFallAlertActive = false;
  fallAlertTimerId = null;
  viewModel.set("fall", "Safe");
  viewModel.set("fallStatusClass", "card mini-card");
}

// New Quick Actions
export function onNotificationTap(args: EventData) {
  Dialogs.alert({
    title: "🔔 Notifications",
    message: "• Medication reminder at 2:00 PM\n• Doctor appointment tomorrow\n• Weekly report ready",
    okButtonText: "OK"
  });
}

export function onMedicationTap(args: EventData) {
  Dialogs.alert({
    title: "💊 Medication Tracker",
    message: "Today's Medications:\n\n✓ Carbidopa-Levodopa - Taken\n⏰ Pramipexole - 2:00 PM\n⏰ Evening dose - 8:00 PM",
    okButtonText: "OK"
  });
}

export function onExerciseTap(args: EventData) {
  Dialogs.alert({
    title: "🏃 Exercise Routine",
    message: "Recommended exercises:\n\n• Walking: 30 mins\n• Stretching: 15 mins\n• Balance training: 10 mins\n\n(Full exercise guide coming soon)",
    okButtonText: "Start"
  });
}

export function onAppointmentsTap(args: EventData) {
  Frame.topmost().navigate("Doctor/doctor-page");
}

export function onSettingsTap(args: EventData) {
  Dialogs.alert({
    title: "⚙️ Settings",
    message: "Settings page with:\n\n• Notification preferences\n• Emergency contacts\n• Privacy settings\n• App theme\n\n(Coming soon)",
    okButtonText: "OK"
  });
  drawer.closeDrawer();
}

export function onTremorDetailTap(args: EventData) {
  const count = viewModel.get("tremorCount") || 0;
  Dialogs.alert({
    title: "🤝 Tremor Status",
    message: `Current Status: ${viewModel.get("tremor")}\n\nDetections Today: ${count}\nLast Detected: 2 mins ago\nAverage Duration: 15 seconds`,
    okButtonText: "OK"
  });
}

export function onFallDetailTap(args: EventData) {
  Dialogs.alert({
    title: "🚨 Fall Detection Status",
    message: `Current Status: ${viewModel.get("fall")}\n\nFalls Today: 0\nFalls This Week: 2\nLast Incident: 3 days ago`,
    okButtonText: "OK"
  });
}