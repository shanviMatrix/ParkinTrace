import {
  EventData,
  Page,
  Frame,
  Observable,
  Dialogs,
  View,
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

  viewModel.set("heartRate", "--");
  viewModel.set("oxygen", "--");
  viewModel.set("tremor", "Stable");
  viewModel.set("fall", "Safe");
  viewModel.set("tremorStatusClass", "card");
  viewModel.set("fallStatusClass", "card");

  page.bindingContext = viewModel;
  startSensorSimulation();
}

export function onNavigatingFrom(args: EventData) {
  stopSensorSimulation();
}

// --- NAYE FUNCTIONS SIDE DRAWER KE LIYE ---
export function toggleDrawer(args: EventData) {
  console.log("Toggle Drawer Tapped!");
  if (drawer) {
    drawer.toggleDrawerState();
  }
}

export function onLearnTap(args: EventData) {
  console.log("Learn Tapped!");
  Dialogs.alert("Learn about Parkinson's page coming soon.");
  drawer.closeDrawer();
}

export function onUpdateDoctorTap(args: EventData) {
  console.log("Update Doctor Tapped!");
  Dialogs.alert("Update Doctor page coming soon.");
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
      console.log("User logged out.");
    }
  });
  drawer.closeDrawer();
}

export function onDoctorTap(args: EventData) {
  console.log("Doctor Tap!");
  Dialogs.alert({
    title: "Connecting to Doctor...",
    message:
      "This will open the phone's dialer to call your doctor. (Yeh feature abhi demo hai).",
    okButtonText: "OK",
  });
}

export function onSOSTap(args: EventData) {
  console.log("Manual SOS Tapped!");
  sendSOSAlert("Manual SOS Request!");
}

export function onCardTap(args: EventData) {
  if (isFallAlertActive) return;
  const currentHeartRate = viewModel.get("heartRate");
  Frame.topmost().navigate({
    moduleName: "heart-rate-page",
    context: { hrData: currentHeartRate },
  });
}

export function onOxygenCardTap(args: EventData) {
  if (isFallAlertActive) return;
  const currentOxygen = viewModel.get("oxygen");
  Frame.topmost().navigate({
    moduleName: "oxygen-page",
    context: { o2Data: currentOxygen },
  });
}

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
    viewModel.set("tremorStatusClass", "card card-tremor-alert");
  } else {
    viewModel.set("tremor", "Stable");
    viewModel.set("tremorStatusClass", "card");
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

  const alertDuration = 10000; // 10 seconds for testing

  console.log(`Starting ${alertDuration / 1000}-second SOS timer...`);

  fallAlertTimerId = setTimeout(() => {
    console.log("Timer finished. Sending auto-SOS.");
    sendSOSAlert("User did not respond to fall alert.");
    isFallAlertActive = false;
  }, alertDuration);

  Dialogs.confirm({
    title: "Fall Detected!",
    message:
      "Are you OK?\n\nAn SOS will be sent automatically if you don't respond.",
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
    title: "Emergency SOS Sent!",
    message:
      "Alert signal sent to Doctor, Caregiver, and Ambulance.\nReason: " +
      reason,
    okButtonText: "OK",
  });
}

function resetFallAlert() {
  isFallAlertActive = false;
  fallAlertTimerId = null;
  viewModel.set("fall", "Safe");
  viewModel.set("fallStatusClass", "card");
}
