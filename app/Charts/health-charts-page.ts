import { EventData, Page, Frame, Dialogs } from "@nativescript/core";

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}

export function onFilter24h(args: EventData) {
  console.log("Filter: 24 hours");
  Dialogs.alert({
    title: "Filter Applied",
    message: "Showing data for last 24 hours",
    okButtonText: "OK"
  });
}

export function onFilter7d(args: EventData) {
  console.log("Filter: 7 days");
  Dialogs.alert({
    title: "Filter Applied",
    message: "Showing data for last 7 days",
    okButtonText: "OK"
  });
}

export function onFilter30d(args: EventData) {
  console.log("Filter: 30 days");
  Dialogs.alert({
    title: "Filter Applied",
    message: "Showing data for last 30 days",
    okButtonText: "OK"
  });
}

export function onExportPDF(args: EventData) {
  Dialogs.alert({
    title: "📄 Export PDF",
    message: "Generating comprehensive health report...\n\nThis would create a PDF with all your health data, charts, and trends.\n\n(Feature coming soon)",
    okButtonText: "OK"
  });
}

export function onEmailDoctor(args: EventData) {
  Dialogs.alert({
    title: "📧 Email to Doctor",
    message: "Your health report will be sent to:\nDr. [Doctor Name]\n\nThis would email your complete health data to your registered doctor.\n\n(Feature coming soon)",
    okButtonText: "OK"
  });
}