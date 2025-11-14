import { EventData, Page, Frame, Observable } from "@nativescript/core";

const viewModel = new Observable();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  const context = page.navigationContext;
  
  viewModel.set("currentHR", context?.hrData || "--");
  page.bindingContext = viewModel;
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}