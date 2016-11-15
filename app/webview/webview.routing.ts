import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WebviewComponent } from "./webview.component";

const webviewRoutes: Routes = [
  { path: "webview", component: WebviewComponent },
];
export const webviewRouting: ModuleWithProviders = RouterModule.forChild(webviewRoutes);