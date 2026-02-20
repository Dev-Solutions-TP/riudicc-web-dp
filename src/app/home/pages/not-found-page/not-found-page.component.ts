import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from '@home/components/page-title/page-title.component';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [PageTitleComponent, RouterLink],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {
  private lang = inject(LocalizationService);

  pageTitleFirstWord = this.lang.getText(AppText.notFound.pageTitleFirstWord, 'Page');
  pageTitleSecondWord = this.lang.getText(AppText.notFound.pageTitleSecondWord, 'Not Found');
  title = this.lang.getText(AppText.notFound.title, 'Error 404');
  description = this.lang.getText(AppText.notFound.description, 'The page you are looking for does not exist or has been moved.');
  goHomeText = this.lang.getText(AppText.notFound.goHome, 'Go Home');
}
