import { EventData, Page, Frame, Dialogs } from "@nativescript/core";

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}

export function onHelplineTap(args: EventData) {
  Dialogs.alert({
    title: "📞 Parkinson's Foundation Helpline",
    message: "Call: 1-800-4PD-INFO (1-800-473-4636)\nAvailable Monday-Friday, 9am-5pm ET\n\n(This would open phone dialer in production)",
    okButtonText: "OK"
  });
}

export function onSupportGroupTap(args: EventData) {
  Dialogs.alert({
    title: "🌐 Online Support Groups",
    message: "Connect with others:\n\n• Parkinson's Foundation Community\n• Michael J. Fox Foundation Forum\n• Local Support Groups\n\n(Links would open in production)",
    okButtonText: "OK"
  });
}

export function onVideosTap(args: EventData) {
  Dialogs.alert({
    title: "📚 Educational Videos",
    message: "Access video library covering:\n\n• Exercise routines\n• Medication management\n• Daily living tips\n• Expert interviews\n\n(Would navigate to video library)",
    okButtonText: "OK"
  });
}