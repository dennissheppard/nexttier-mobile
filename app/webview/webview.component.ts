import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { WebView, LoadEventData } from 'ui/web-view';

@Component({
    selector: 'webview',
    templateUrl: 'webview/webview.component.html'
})
export class WebviewComponent implements AfterViewInit {
    //@ViewChild('webView') webView: ElementRef;
    private oLangWebViewInterface;

    ngAfterViewInit(): void {
        console.log('in webview component');
        this.setupWebViewInterface();
    }

    private setupWebViewInterface() {
        // webView.WebView()
        // let webView: webView = this.webView.nativeElement;

        // this.oLangWebViewInterface = new WebView. webViewInterfaceModule.WebViewInterface(webView, 'https://stg.nexttier.com');


        // loading languages in dropdown, on load of webView.
        // webView.on(webView.loadFinishedEvent, (args: LoadEventData) => {
        //
        // });

  }

}