import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Directive({
  selector: '[appAnonSignin]'
})
export class AnonSigninDirective {

  constructor(private afAuth: AngularFireAuth) { }

  @HostListener('click')
  onclick(): void {
    this.afAuth.signInAnonymously();
  }

}
