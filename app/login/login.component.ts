import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "color";
import { connectionType, getConnectionType } from "connectivity";
import { Animation } from "ui/animation";
import { View } from "ui/core/view";
import { prompt } from "ui/dialogs";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";

import { alert, setHintColor } from "../shared";
import { StakeholderService, Stakeholder } from "../stakeholder/"

@Component({
    selector: "gr-login",
    templateUrl: "login/login.component.html",
    styleUrls: ["login/login-common.css", "login/login.component.css"],
})
export class LoginComponent implements OnInit {
    stakeholder: Stakeholder;
    loginInfo: any = {};
    isLoggingIn = true;
    isAuthenticating = false;

    @ViewChild("initialContainer") initialContainer: ElementRef;
    @ViewChild("mainContainer") mainContainer: ElementRef;
    @ViewChild("logoContainer") logoContainer: ElementRef;
    @ViewChild("formControls") formControls: ElementRef;
    @ViewChild("forgotPassword") forgotPassword: ElementRef;
    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;

    constructor(private router: Router,
                private stakeholderService: StakeholderService,
                private page: Page) {
        this.loginInfo.email = '';
        this.loginInfo.password = '';
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        if (this.stakeholderService.hasAToken) {
            this.getStakeholderInformation();
        }
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }

    login() {
        if (getConnectionType() === connectionType.none) {
            alert("NextTier requires an internet connection to log in.");
            return;
        }
        this.isAuthenticating = true;
        this.stakeholderService.basicLogin(this.loginInfo)
            .subscribe((stakeholder) => {
                    this.isAuthenticating = false;
                    this.getStakeholderInformation();
                },
                (error) => {
                    alert("Unfortunately we could not find your account.");
                    this.isAuthenticating = false;
                }
            );
    }

    getStakeholderInformation() {
        this.stakeholderService.getStakeholderInformation()
            .subscribe((data) => {
                // alert('logged in' + data.id);
                this.router.navigate(["/webview"]);

            });

    }

    // signUp() {
    //   if (getConnectionType() === connectionType.none) {
    //     alert("Groceries requires an internet connection to register.");
    //     return;
    //   }
    //
    //   this.userService.register(this.user)
    //     .subscribe(
    //       () => {
    //         alert("Your account was successfully created.");
    //         this.isAuthenticating = false;
    //         this.toggleDisplay();
    //       },
    //       (message) => {
    //         // TODO: Verify this works
    //         if (message.match(/same user/)) {
    //           alert("This email address is already in use.");
    //         } else {
    //           alert("Unfortunately we were unable to create your account.");
    //         }
    //         this.isAuthenticating = false;
    //       }
    //     );
    // }

    // forgotPassword() {
    //   prompt({
    //     title: "Forgot Password",
    //     message: "Enter the email address you used to register for Groceries to reset your password.",
    //     defaultText: "",
    //     okButtonText: "Ok",
    //     cancelButtonText: "Cancel"
    //   }).then((data) => {
    //     if (data.result) {
    //       this.userService.resetPassword(data.text.trim())
    //         .subscribe(() => {
    //           alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
    //         }, () => {
    //           alert("Unfortunately, an error occurred resetting your password.");
    //         });
    //     }
    //   });
    // }

    // toggleDisplay() {
    //   this.isLoggingIn = !this.isLoggingIn;
    //   this.setTextFieldColors();
    //   let mainContainer = <View>this.mainContainer.nativeElement;
    //   mainContainer.animate({
    //     backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
    //     duration: 200
    //   });
    // }

    startBackgroundAnimation(background) {
        background.animate({
            scale: {x: 1.0, y: 1.0},
            duration: 10000
        });
    }

    showMainContent() {
        let initialContainer = <View>this.initialContainer.nativeElement;
        let mainContainer = <View>this.mainContainer.nativeElement;
        let logoContainer = <View>this.logoContainer.nativeElement;
        let formControls = <View>this.formControls.nativeElement;
        let forgotPassword = <View>this.forgotPassword.nativeElement;
        let animations = [];

        // Fade out the initial content over one half second
        initialContainer.animate({
            opacity: 0,
            duration: 500
        }).then(function () {
            // After the animation completes, hide the initial container and
            // show the main container and logo. The main container and logo will
            // not immediately appear because their opacity is set to 0 in CSS.
            initialContainer.style.visibility = "collapse";
            mainContainer.style.visibility = "visible";
            logoContainer.style.visibility = "visible";

            // Fade in the main container and logo over one half second.
            animations.push({target: mainContainer, opacity: 1, duration: 500});
            animations.push({target: logoContainer, opacity: 1, duration: 500});

            // Slide up the form controls and sign up container.
            animations.push({target: forgotPassword, translate: {x: 0, y: 0}, opacity: 1, delay: 500, duration: 150});
            animations.push({target: formControls, translate: {x: 0, y: 0}, opacity: 1, delay: 650, duration: 150});

            // Kick off the animation queue
            new Animation(animations, false).play();
        });
    }

    setTextFieldColors() {
        let emailTextField = <TextField>this.email.nativeElement;
        let passwordTextField = <TextField>this.password.nativeElement;

        let mainTextColor = new Color(this.isLoggingIn ? "black" : "#C4AFB4");
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;

        let hintColor = new Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
        setHintColor({view: emailTextField, color: hintColor});
        setHintColor({view: passwordTextField, color: hintColor});
    }
}
