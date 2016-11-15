import { Injectable } from '@angular/core';

@Injectable()
export class EnvironmentService {
    private _environment: string;

    constructor() {
        this.determineEnvironment();
    }

    get environment() {
        return this._environment;
    }

    determineEnvironment() {

        // let hostName = location.host;
        //     // Figure out if we are production, staging, or dev from host name
        // if (/staging/.test( hostName ) || /stg/.test( hostName )) {
             this._environment = 'staging';
        // } else if (/local/.test( hostName ) || (/^192/.test( hostName ) || (/^127/.test( hostName )))) {
        //     this._environment = 'development';
        // } else if (/nexttier/.test( hostName )) {
        //     this._environment = 'production';
        // } else {
        //     console.error('Unknown URL');
        // }
    }

}
