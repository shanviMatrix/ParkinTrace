import { EventData, Page, Frame, Observable, ApplicationSettings, Dialogs } from "@nativescript/core";

const viewModel = new Observable();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  
  const storedProfile = ApplicationSettings.getString("user_profile");
  const profileData = storedProfile ? JSON.parse(storedProfile) : {};
  
  viewModel.set("age", profileData.age || "");
  viewModel.set("bloodGroup", profileData.bloodGroup || "");
  
  viewModel.set("doctorName", profileData.doctorName || "");
  viewModel.set("doctorSpecialization", profileData.doctorSpecialization || "");
  viewModel.set("doctorPhone", profileData.doctorPhone || "");
  
  viewModel.set("emergencyContact1Name", profileData.emergencyContact1Name || "");
  viewModel.set("emergencyContact1Phone", profileData.emergencyContact1Phone || "");
  viewModel.set("emergencyContact1Relation", profileData.emergencyContact1Relation || "");
  
  viewModel.set("emergencyContact2Name", profileData.emergencyContact2Name || "");
  viewModel.set("emergencyContact2Phone", profileData.emergencyContact2Phone || "");
  viewModel.set("emergencyContact2Relation", profileData.emergencyContact2Relation || "");
  
  viewModel.set("diagnosedDate", profileData.diagnosedDate || "");
  viewModel.set("currentStage", profileData.currentStage || "");
  viewModel.set("medications", profileData.medications || "");
  viewModel.set("allergies", profileData.allergies || "");
  
  page.bindingContext = viewModel;
}

export function onSaveTap(args: EventData) {
  const profileData = {
    age: viewModel.get("age"),
    bloodGroup: viewModel.get("bloodGroup"),
    
    doctorName: viewModel.get("doctorName"),
    doctorSpecialization: viewModel.get("doctorSpecialization"),
    doctorPhone: viewModel.get("doctorPhone"),
    
    emergencyContact1Name: viewModel.get("emergencyContact1Name"),
    emergencyContact1Phone: viewModel.get("emergencyContact1Phone"),
    emergencyContact1Relation: viewModel.get("emergencyContact1Relation"),
    
    emergencyContact2Name: viewModel.get("emergencyContact2Name"),
    emergencyContact2Phone: viewModel.get("emergencyContact2Phone"),
    emergencyContact2Relation: viewModel.get("emergencyContact2Relation"),
    
    diagnosedDate: viewModel.get("diagnosedDate"),
    currentStage: viewModel.get("currentStage"),
    medications: viewModel.get("medications"),
    allergies: viewModel.get("allergies"),
  };
  
  ApplicationSettings.setString("user_profile", JSON.stringify(profileData));
  
  Dialogs.alert({
    title: "✅ Success",
    message: "Profile updated successfully!",
    okButtonText: "OK"
  }).then(() => {
    Frame.topmost().goBack();
  });
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}