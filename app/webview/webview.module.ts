import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { WebviewComponent } from "./webview.component";
import { webviewRouting } from "./webview.routing";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    webviewRouting
  ],
  declarations: [
    WebviewComponent
  ]
})
export class WebviewModule { }
