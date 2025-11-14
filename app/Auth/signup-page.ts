import { EventData, Page, Frame, Observable, ApplicationSettings, Dialogs } from "@nativescript/core";

const viewModel = new Observable();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  
  viewModel.set("fullName", "");
  viewModel.set("email", "");
  viewModel.set("phone", "");
  viewModel.set("password", "");
  viewModel.set("confirmPassword", "");
  
  page.bindingContext = viewModel;
}

export function onSignupTap(args: EventData) {
  const fullName = viewModel.get("fullName");
  const email = viewModel.get("email");
  const phone = viewModel.get("phone");
  const password = viewModel.get("password");
  const confirmPassword = viewModel.get("confirmPassword");

  if (!fullName || !email || !phone || !password || !confirmPassword) {
    Dialogs.alert({
      title: "Error",
      message: "Please fill all fields.",
      okButtonText: "OK"
    });
    return;
  }

  if (password !== confirmPassword) {
    Dialogs.alert({
      title: "Error",
      message: "Passwords do not match.",
      okButtonText: "OK"
    });
    return;
  }

  if (password.length < 6) {
    Dialogs.alert({
      title: "Error",
      message: "Password must be at least 6 characters.",
      okButtonText: "OK"
    });
    return;
  }

  const userData = {
    fullName: fullName,
    email: email,
    phone: phone,
    password: password,
    patientId: "PT" + Date.now().toString().slice(-8),
    createdAt: new Date().toISOString()
  };

  ApplicationSettings.setString("user_data", JSON.stringify(userData));
  ApplicationSettings.setBoolean("isLoggedIn", true);

  Dialogs.alert({
    title: "Success",
    message: "Account created successfully!",
    okButtonText: "OK"
  }).then(() => {
    Frame.topmost().navigate({
      moduleName: "main-page",
      clearHistory: true
    });
  });
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}