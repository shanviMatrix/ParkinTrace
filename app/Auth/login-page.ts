import { EventData, Page, Frame, Observable, ApplicationSettings, Dialogs } from "@nativescript/core";

const viewModel = new Observable();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  
  viewModel.set("email", "");
  viewModel.set("password", "");
  
  page.bindingContext = viewModel;
}

export function onLoginTap(args: EventData) {
  const email = viewModel.get("email");
  const password = viewModel.get("password");

  if (!email || !password) {
    Dialogs.alert({
      title: "Error",
      message: "Please enter both email and password.",
      okButtonText: "OK"
    });
    return;
  }

  const storedUser = ApplicationSettings.getString("user_data");
  
  if (!storedUser) {
    Dialogs.alert({
      title: "Error",
      message: "No account found. Please sign up first.",
      okButtonText: "OK"
    });
    return;
  }

  const userData = JSON.parse(storedUser);

  if (userData.email === email && userData.password === password) {
    ApplicationSettings.setBoolean("isLoggedIn", true);
    
    Dialogs.alert({
      title: "Success",
      message: "Login successful!",
      okButtonText: "OK"
    }).then(() => {
      Frame.topmost().navigate({
        moduleName: "main-page",
        clearHistory: true
      });
    });
  } else {
    Dialogs.alert({
      title: "Error",
      message: "Invalid email or password.",
      okButtonText: "OK"
    });
  }
}

export function onSignupTap(args: EventData) {
  Frame.topmost().navigate("Auth/signup-page");
}

export function onForgotPasswordTap(args: EventData) {
  Dialogs.alert({
    title: "Forgot Password",
    message: "Password recovery feature coming soon!",
    okButtonText: "OK"
  });
}