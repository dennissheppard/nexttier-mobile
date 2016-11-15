import { Injectable } from '@angular/core';
import { Stakeholder } from './stakeholder.model';
import { ApiService, UrlService, StorageService } from '../api/';

@Injectable()
export class StakeholderService {
    private _stakeholder: Stakeholder;
    token: string;

    constructor(private apiService: ApiService, private urlService: UrlService, private storageService: StorageService) {

    }

    get stakeholder(): Stakeholder {
        return this._stakeholder;
    }

    basicLogin(loginInfo: any) {
        return this.apiService.post('/stakeholder/login/', loginInfo)
            .map((response) => {
                let data = response.json();
                this._stakeholder = new Stakeholder(this.urlService, this.storageService);
                this._stakeholder.authToken = data.token;
                this._stakeholder.id = data.id;
                this.storageService.setItem('ls.authToken', this._stakeholder.authToken);
                this.storageService.setItem('ls.user.roleId', String(this._stakeholder.id));
                this.apiService.setupHeaders();
                return data;
            });
    }

    getStakeholderInformation() {
        return this.apiService.get('/stakeholder')
            .map(response => {
                let data = response.json();
                if (!this._stakeholder) {
                    this._stakeholder = new Stakeholder(this.urlService, this.storageService);
                    this._stakeholder.authToken = this.storageService.getItem('ls.authToken');
                    this._stakeholder.id = data.id;
                }
                this._stakeholder.populateData(data);
                ////////////////////////////////////////////////////////////
                // NEED TO DO THIS
                // if(this._stakeholder.highschool) {
                //     this.setHighSchool(this._stakeholder.highschool);
                // }
                // hasCompletedAcademicInformation();
                ////////////////////////////////////////////////////////////////////////

                this.populateEntitlements();
                return this._stakeholder;
            });
    }

    populateEntitlements() {
        return this.apiService.get('/stakeholder/entitlement/all/')
            .map((response) => response.json())
            .subscribe((data) => {
                this._stakeholder.entitlements = <any>data.results;
            });
    }

    get hasAToken(): boolean {
        return this.storageService.hasItem('ls.authToken')
    }

}
