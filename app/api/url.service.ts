import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable()
export class UrlService {

  private pathRoot: string;

  constructor(private environmentService: EnvironmentService) {
    this.init();
  }

  private init() {

      const LOCAL_API = 'http://localdocker/v1';
      const STAGING_API = 'https://api-staging.nexttier.com/v1';
      const PROD_API = 'https://api.nexttier.com/v1';

      if (this.environmentService.environment === 'development') {
          this.pathRoot = STAGING_API;
      } else if (this.environmentService.environment === 'staging') {
          this.pathRoot = STAGING_API;
      } else if (this.environmentService.environment === 'production') {
          this.pathRoot = PROD_API;
      }
  }


  public getPathRoot(): string {
    return this.pathRoot;
  }

}
