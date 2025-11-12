import { EventData, Page, Frame, Observable } from "@nativescript/core";

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;

  const context = page.navigationContext;

  const pageViewModel = new Observable();
  pageViewModel.set("currentHR", context.hrData);

  page.bindingContext = pageViewModel;
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}
