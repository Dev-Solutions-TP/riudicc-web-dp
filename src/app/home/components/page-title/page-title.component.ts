import { Component, input } from '@angular/core';

@Component({
  selector: 'page-title',
  imports: [],
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent {

  firstWord = input<string>();
  secondWord = input<string>();

  reverse = input<boolean>(false);
}
