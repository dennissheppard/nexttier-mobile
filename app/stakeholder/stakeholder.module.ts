import { NgModule } from '@angular/core';

import { StakeholderService } from './stakeholder.service';

import { ApiModule } from '../api/api.module';
// import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        // SharedModule,
        ApiModule
    ],
    exports: [],
    providers: [
        StakeholderService
    ]
})
export class StakeholderModule {}
