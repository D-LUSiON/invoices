import { Component, OnInit } from '@angular/core';
import { AppStateService } from '@app/services';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {

  constructor(
    private _appState: AppStateService,
  ) { }

  ngOnInit() {
  }

}
