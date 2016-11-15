import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { setStatusBarColors } from "./shared";

import { LoginModule } from "./login/login.module";
import { WebviewModule } from './webview/webview.module';

import { ApiModule } from "./api/api.module";
import { StakeholderModule } from "./stakeholder/stakeholder.module";

setStatusBarColors();

@NgModule({
    providers: [
        authProviders
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(appRoutes),
        ApiModule,
        LoginModule,
        WebviewModule,
        StakeholderModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
