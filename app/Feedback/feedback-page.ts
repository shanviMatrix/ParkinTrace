import { EventData, Page, Frame, Observable, Dialogs } from "@nativescript/core";

const viewModel = new Observable();
let rating = 0;
let selectedOptions: string[] = [];
let selectedImprovements: string[] = [];

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  
  rating = 0;
  selectedOptions = [];
  selectedImprovements = [];
  
  viewModel.set("ratingText", "Tap stars to rate");
  viewModel.set("comments", "");
  viewModel.set("contactEmail", "");
  
  // Checkboxes
  viewModel.set("option1Selected", "☐");
  viewModel.set("option2Selected", "☐");
  viewModel.set("option3Selected", "☐");
  viewModel.set("option4Selected", "☐");
  
  viewModel.set("improve1Selected", "☐");
  viewModel.set("improve2Selected", "☐");
  viewModel.set("improve3Selected", "☐");
  viewModel.set("improve4Selected", "☐");
  
  page.bindingContext = viewModel;
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}

export function onStarTap(args: EventData) {
  const starId = (args.object as any).id;
  rating = parseInt(starId.replace("star", ""));
  
  let ratingText = "";
  switch(rating) {
    case 1: ratingText = "😞 Poor"; break;
    case 2: ratingText = "😐 Fair"; break;
    case 3: ratingText = "🙂 Good"; break;
    case 4: ratingText = "😊 Very Good"; break;
    case 5: ratingText = "🤩 Excellent"; break;
  }
  
  viewModel.set("ratingText", ratingText);
  console.log("Rating:", rating);
}

// Like Options
export function onOption1Tap(args: EventData) {
  toggleOption("option1Selected", "Easy to use interface");
}

export function onOption2Tap(args: EventData) {
  toggleOption("option2Selected", "Accurate health monitoring");
}

export function onOption3Tap(args: EventData) {
  toggleOption("option3Selected", "Emergency SOS feature");
}

export function onOption4Tap(args: EventData) {
  toggleOption("option4Selected", "Doctor connectivity");
}

// Improvement Options
export function onImprove1Tap(args: EventData) {
  toggleImprovement("improve1Selected", "Add more health metrics");
}

export function onImprove2Tap(args: EventData) {
  toggleImprovement("improve2Selected", "Better chart visualizations");
}

export function onImprove3Tap(args: EventData) {
  toggleImprovement("improve3Selected", "Medication reminders");
}

export function onImprove4Tap(args: EventData) {
  toggleImprovement("improve4Selected", "Voice commands");
}

function toggleOption(key: string, value: string) {
  const current = viewModel.get(key);
  if (current === "☐") {
    viewModel.set(key, "☑");
    selectedOptions.push(value);
  } else {
    viewModel.set(key, "☐");
    selectedOptions = selectedOptions.filter(item => item !== value);
  }
}

function toggleImprovement(key: string, value: string) {
  const current = viewModel.get(key);
  if (current === "☐") {
    viewModel.set(key, "☑");
    selectedImprovements.push(value);
  } else {
    viewModel.set(key, "☐");
    selectedImprovements = selectedImprovements.filter(item => item !== value);
  }
}

export function onSubmitFeedback(args: EventData) {
  if (rating === 0) {
    Dialogs.alert({
      title: "Rating Required",
      message: "Please rate your experience before submitting.",
      okButtonText: "OK"
    });
    return;
  }
  
  const comments = viewModel.get("comments");
  const email = viewModel.get("contactEmail");
  
  const feedbackData = {
    rating: rating,
    likedFeatures: selectedOptions,
    improvements: selectedImprovements,
    comments: comments,
    contactEmail: email,
    timestamp: new Date().toISOString()
  };
  
  console.log("Feedback Submitted:", JSON.stringify(feedbackData, null, 2));
  
  // Custom Success Alert (SweetAlert style)
  Dialogs.alert({
    title: "✅ Thank You!",
    message: `Your feedback has been submitted successfully!\n\nRating: ${rating} stars\n\nWe appreciate your time and input. Your feedback helps us make ParkinTrace better for everyone.`,
    okButtonText: "Done"
  }).then(() => {
    Frame.topmost().goBack();
  });
}