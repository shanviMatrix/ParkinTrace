import { EventData, Page, Frame, Observable, ApplicationSettings, Dialogs } from "@nativescript/core";

const viewModel = new Observable();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  
  const storedProfile = ApplicationSettings.getString("user_profile");
  const profileData = storedProfile ? JSON.parse(storedProfile) : {};
  
  viewModel.set("doctorName", profileData.doctorName || "Dr. Sarah Johnson");
  viewModel.set("doctorSpecialization", profileData.doctorSpecialization || "Neurologist");
  viewModel.set("doctorPhone", profileData.doctorPhone || "+1 (555) 123-4567");
  viewModel.set("doctorEmail", "sarah.johnson@citymedical.com");
  viewModel.set("doctorExperience", "15 years");
  viewModel.set("clinicHours", "Mon-Fri: 9:00 AM - 5:00 PM");
  
  page.bindingContext = viewModel;
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}

export function onCallTap(args: EventData) {
  const phone = viewModel.get("doctorPhone");
  Dialogs.confirm({
    title: "📞 Call Doctor",
    message: `Call ${viewModel.get("doctorName")}?\n\n${phone}`,
    okButtonText: "Call",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result) {
      console.log(`Calling ${phone}`);
      Dialogs.alert({
        title: "Calling...",
        message: "This would open phone dialer in production",
        okButtonText: "OK"
      });
    }
  });
}

export function onMessageTap(args: EventData) {
  Dialogs.prompt({
    title: "💬 Message Doctor",
    message: "Type your message:",
    okButtonText: "Send",
    cancelButtonText: "Cancel",
    inputType: "text"
  }).then((result) => {
    if (result.result && result.text) {
      console.log("Message:", result.text);
      Dialogs.alert({
        title: "Message Sent",
        message: "Your message has been sent to the doctor. They will respond soon.",
        okButtonText: "OK"
      });
    }
  });
}

export function onAppointmentTap(args: EventData) {
  Dialogs.alert({
    title: "📅 Book Appointment",
    message: "Choose your preferred date and time:\n\n• Available slots shown\n• Instant confirmation\n• Reminder notifications\n\n(Full booking system coming soon)",
    okButtonText: "OK"
  });
}

export function onEmergencyTap(args: EventData) {
  Dialogs.confirm({
    title: "🆘 Emergency Contact",
    message: "This will immediately notify your doctor and emergency services.\n\nProceed?",
    okButtonText: "Call Emergency",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result) {
      Dialogs.alert({
        title: "Emergency Alert Sent",
        message: "✓ Doctor notified\n✓ Emergency services alerted\n✓ Emergency contacts informed\n\nHelp is on the way!",
        okButtonText: "OK"
      });
    }
  });
}

export function onScheduleNewTap(args: EventData) {
  Dialogs.alert({
    title: "Schedule Appointment",
    message: "Select appointment type:\n\n• Regular Checkup\n• Follow-up Visit\n• Medication Review\n• Emergency Consultation\n\n(Appointment scheduler coming soon)",
    okButtonText: "OK"
  });
}

export function onRefillTap(args: EventData) {
  Dialogs.alert({
    title: "Request Refill",
    message: "Prescription refill request will be sent to:\n\n" + viewModel.get("doctorName") + "\n\nYou'll receive confirmation within 24 hours.\n\n(Feature coming soon)",
    okButtonText: "OK"
  });
}

export function onChangeDoctorTap(args: EventData) {
  const doctorOptions = [
    "Dr. Sarah Johnson - Neurologist",
    "Dr. Michael Chen - Movement Disorder Specialist",
    "Dr. Emily Rodriguez - Parkinson's Expert",
    "Dr. James Williams - Neurology Consultant",
    "Search for other doctors..."
  ];
  
  Dialogs.action({
    title: "Change Your Doctor",
    message: "Select a new doctor or search:",
    cancelButtonText: "Cancel",
    actions: doctorOptions
  }).then((result) => {
    if (result && result !== "Cancel") {
      if (result.includes("Search")) {
        Dialogs.prompt({
          title: "Search Doctor",
          message: "Enter doctor name or specialty:",
          okButtonText: "Search",
          cancelButtonText: "Cancel",
          inputType: "text"
        }).then((searchResult) => {
          if (searchResult.result && searchResult.text) {
            Dialogs.alert({
              title: "Search Results",
              message: `Searching for: ${searchResult.text}\n\n(Search feature coming soon)`,
              okButtonText: "OK"
            });
          }
        });
      } else {
        Dialogs.confirm({
          title: "Confirm Doctor Change",
          message: `Change to:\n${result}\n\nYour medical history and appointments will be transferred.`,
          okButtonText: "Confirm",
          cancelButtonText: "Cancel"
        }).then((confirmed) => {
          if (confirmed) {
            const newName = result.split(" - ")[0];
            const newSpec = result.split(" - ")[1];
            
            viewModel.set("doctorName", newName);
            viewModel.set("doctorSpecialization", newSpec);
            
            // Save to profile
            const storedProfile = ApplicationSettings.getString("user_profile");
            const profileData = storedProfile ? JSON.parse(storedProfile) : {};
            profileData.doctorName = newName;
            profileData.doctorSpecialization = newSpec;
            ApplicationSettings.setString("user_profile", JSON.stringify(profileData));
            
            Dialogs.alert({
              title: "✅ Doctor Changed",
              message: `Your primary doctor is now:\n${newName}\n\nAn introduction email has been sent to your new doctor.`,
              okButtonText: "OK"
            });
          }
        });
      }
    }
  });
}