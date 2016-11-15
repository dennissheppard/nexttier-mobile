import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { UrlService, ApiService, EnvironmentService } from './index';
import { StorageService } from "./storage.service";
// import { UrlService } from './url.service';
// import { ApiService } from './api.service';

@NgModule({
    imports: [
        HttpModule
    ],
    exports: [],
    providers: [
        UrlService,
        ApiService,
        EnvironmentService,
        StorageService
    ]
})
export class ApiModule {}
