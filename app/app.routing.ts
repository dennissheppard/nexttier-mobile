import { AuthGuard } from "./auth-guard.service";
import { WebviewComponent } from "./webview/webview.component";
import { LoginComponent } from "./login/login.component";

export const authProviders = [
  AuthGuard
];

export const appRoutes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "webview", component: WebviewComponent}

];
