import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getAlertMessage, getAlertState, State } from '../states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';

@Component({
  selector: 'app-alert-bubble',
  templateUrl: './alert-bubble.component.html',
  styleUrls: ['./alert-bubble.component.scss'],
})
export class AlertBubbleComponent implements OnInit, AfterViewInit {
  @ViewChild('alertBubble') alertBubble: ElementRef;
  timeout: any;
  AlertMessage$: Observable<any>;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.AlertMessage$ = this.store.select(getAlertMessage);
  }

  ngAfterViewInit(): void {
    this.store.select(getAlertState).subscribe((state) => {
      if (state === true) {
        this.showAlertBubble();
      }
    });
  }

  showAlertBubble() {
    this.alertBubble!.nativeElement.style.right = '23px';
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.hideAlertBubble();
      this.store.dispatch(MainActions.ShowAlert());
    }, 5000);
  }

  hideAlertBubble() {
    this.alertBubble!.nativeElement.style.right = '-420px';
  }

  hideAlert() {
    this.hideAlertBubble();
    this.store.dispatch(MainActions.ShowAlert());
  }
}
