import { EventData, Page, Frame, Observable, ApplicationSettings } from "@nativescript/core";

const viewModel = new Observable();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  
  const storedUser = ApplicationSettings.getString("user_data");
  const userData = storedUser ? JSON.parse(storedUser) : {};
  
  const storedProfile = ApplicationSettings.getString("user_profile");
  const profileData = storedProfile ? JSON.parse(storedProfile) : {};
  
  viewModel.set("fullName", userData.fullName || "User Name");
  viewModel.set("email", userData.email || "email@example.com");
  viewModel.set("phone", userData.phone || "Not set");
  viewModel.set("patientId", userData.patientId || "PT12345");
  
  viewModel.set("age", profileData.age || "Not set");
  viewModel.set("bloodGroup", profileData.bloodGroup || "Not set");
  
  viewModel.set("doctorName", profileData.doctorName || "Not assigned");
  viewModel.set("doctorSpecialization", profileData.doctorSpecialization || "Neurologist");
  viewModel.set("doctorPhone", profileData.doctorPhone || "Not set");
  
  viewModel.set("emergencyContact1Name", profileData.emergencyContact1Name || "Not set");
  viewModel.set("emergencyContact1Phone", profileData.emergencyContact1Phone || "Not set");
  viewModel.set("emergencyContact1Relation", profileData.emergencyContact1Relation || "Not set");
  
  viewModel.set("emergencyContact2Name", profileData.emergencyContact2Name || "Not set");
  viewModel.set("emergencyContact2Phone", profileData.emergencyContact2Phone || "Not set");
  viewModel.set("emergencyContact2Relation", profileData.emergencyContact2Relation || "Not set");
  
  viewModel.set("diagnosedDate", profileData.diagnosedDate || "Not set");
  viewModel.set("currentStage", profileData.currentStage || "Not set");
  viewModel.set("medications", profileData.medications || "Not set");
  viewModel.set("allergies", profileData.allergies || "None");
  
  page.bindingContext = viewModel;
}

export function onEditTap(args: EventData) {
  Frame.topmost().navigate("Profile/edit-profile-page");
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}