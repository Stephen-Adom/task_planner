import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss'],
})
export class SettingsOverviewComponent implements OnInit {
  settings: any;

  constructor() {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'));
    }
  }

  ngOnInit(): void {}
}
