// import { IStudentConnection } from '../shared/services/connections/student-connection.interface';
// import { IInstitution } from '../shared/services/institutions/institution.interface';
import { UrlService, StorageService } from '../api/';

export class Stakeholder {
    act_composite: number = null;
    act_english: number = null;
    act_math: number = null;
    act_reading: number = null;
    act_science: number = null;
    act_writing: number = null;
    adult_connections: any[] = null;
    ambassador_uid: string = null;
    anonymous: boolean = null;
    attachments: any[] = null;
    authToken: string = null;
    // canAddSchools: boolean = null;
    // canRecommendSchools: boolean = null;
    city: string = null;
    class_rank: number = null;
    completed_tasks: number = null;
    district: string = null;
    email: string = null;
    entitlements: any[] = null;
    firstName: string = null;
    first_name: string = null;
    // fullName: string = null;
    gender: string = null;
    gpa: any = null;
    graduation_year: number = null;
    hasCompletedAcademicInformation: boolean = null;
    hasConnections: boolean = null;
    has_letters: boolean = null;
    has_transitioned: boolean = null;
    highschool: string = null;
    id: number = null;

    /////////// Changing IInstitution to 'any' for now /////////////

    institution: any = null;
    institution_trackers: any[] = null;

    /////

    // isCounselor: boolean = null;
    // isMentor: boolean = null;
    // isStudent: boolean = null;
    // isTeamMember: boolean = null;
    is_active: boolean = null;
    is_ambassador: boolean = null;
    lastName: string = null;
    last_login: Date = null;
    last_name: string = null;
    loggedIn: boolean = null;
    meta: any = null;
    // name: string = null;
    phase: string = null;
    // photoUrl: string = null;
    photo_url: string = null;
    points: number = null;
    potential_majors: number[] = null;
    profile_photo: string = null;

    /////////// Changing IInstitution to 'any' for now /////////////
    recommended_institutions: any[] = null;
    ////

    referred_users: number = null;
    registration_date: Date = null;
    sat_math: number = null;
    sat_reading: number = null;
    sat_writing: number = null;
    signin_prompt: boolean = null;
    signin_prompt_category: any = null;
    stakeholderType: string = null;
    stakeholder_type: string = null;
    state: string = null;

    //////// changing IStudentconnection to 'any' for now ///////
    student_connections: Array<any> = null;
    /////

    // trackType: string = null;
    // usesApplicationDates: boolean = null;
    verified: boolean = null;

    isAllowed(actionName: string, resource?: string) {
        if (this.entitlements) {
            for (let i = 0, entitlement: any; entitlement = this.entitlements[i]; ++i) {
                if (entitlement.name.toUpperCase() === actionName.toUpperCase()) {
                    if (!resource) {
                        return true;
                    } // if no specific resource, default to allowed
                    if (entitlement.resource
                        && resource.toUpperCase() === entitlement.resource.toUpperCase()) {
                            return true;
                    }
                }
            }
        }
        return false;
    }

    // stakeholder trait getters

    get isAdmin(): boolean {
        return (this.email &&
                this.email.indexOf('admin') !== -1 &&
                this.email.indexOf('@nexttier') !== -1);
    }

    get isGhost(): boolean {
        return !!this.storageService.getItem('ls.isGhost');
    }

    get isUpperClassman(): boolean {
        return ( /senior/.test(this.phase.toLowerCase()) || /junior/.test(this.phase.toLowerCase())) ;
    }

    get isSenior(): boolean {
        return /senior/gi.test(this.phase);
    }

    get isParent(): boolean {
        return /parent/gi.test(this.stakeholder_type);
    }

    get isStudent() {
        return (/(student|anonymous)/i.test(this.stakeholderType));
    }

    get isCounselor() {
        return (this.stakeholderType === "Counselor");
    }

    get isAnonymous() {
        return this.anonymous;
    }

    get canAddSchools () {
        return (this.isStudent || this.anonymous || !this.loggedIn);
    }

    get canRecommendSchools() {
        return ((this.stakeholderType === "Counselor") || (this.stakeholderType === "Parent"));
    }

    get name() {
        let name = this.firstName || this.lastName || this.email ;
        return( name.replace(/@.*/,"") );
    }

    get fullName() {
        return( this.firstName || this.lastName ?
			(this.firstName || "") + " " + (this.lastName || "") :
				(this.email).replace(/@.*/,"") ).trim();
    }

    get isTeamMember() {
        return !(this.isStudent || this.isCounselor);
    }

    get isMentor() {
        return ((this.stakeholderType === "Counselor") || (this.stakeholderType === "Parent"));
    }

    get usesApplicationDates() {
        return /senior/i.test( this.phase ) && this.phase.toLowerCase().indexOf('rising') === -1;
    }

    get photoUrl() {
        return this.parseUserPhoto(this.photoUrl, this.stakeholder_type);
    }

    get trackType() {
        return this.isStudent ? "student" : "mentor";
    }

    constructor(private urlService: UrlService, private storageService: StorageService) { }

    populateData(obj: any) {
        for (let prop in obj) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = obj[prop];
            }
        }
    }

    parseUserPhoto(photo, userType) {
        userType = userType || "";
        if(!photo) {
            if(userType.toLowerCase() === "counselor") {
                photo = this.urlService.getPathRoot() + "build/images/ic_counselor.png";
            } else if(userType.toLowerCase() === "parent" ) {
                photo = this.urlService.getPathRoot() + "build/images/ic_teammate.png";
            } else {
                photo = this.urlService.getPathRoot() + "build/images/ic_student_badge.png";
            }
        }
        if(!/https?:\/\//.test(photo)) {
            photo = 'http://next-tier-cust-files.s3.amazonaws.com/' + photo;
        }

        return photo;
    }

}
