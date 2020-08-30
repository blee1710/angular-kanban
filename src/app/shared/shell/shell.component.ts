import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  faGithub = faGithub;
  faLinkedIn = faLinkedin;
  faKeyboard = faKeyboard;

  constructor(private breakpointObserver: BreakpointObserver) { }


}
