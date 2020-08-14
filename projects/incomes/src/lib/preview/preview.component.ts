import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-preview',
  template: `
    <p>
      preview works!
    </p>
  `,
  styles: []
})
export class PreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
