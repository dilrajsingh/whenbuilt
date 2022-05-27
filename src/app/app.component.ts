import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LoaderService } from './services/loader.service';
import { environment } from 'src/environments/environment';
import { GoogleAnalyticsService } from './services/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private sub;
  constructor(public translate: TranslateService, 
              private titleService: Title,
              public loader: LoaderService,
              private googleAnalyticsService: GoogleAnalyticsService
    ) {
        translate.addLangs(['en','fr', 'es', 'de']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang?.match(/en|fr|es|de/) ? browserLang : 'en');

        this.sub = translate.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
          this.titleService.setTitle(this.translate.instant('nav.whenBuilt'));
        });


  }
  ngOnInit(): void {
    if (environment.production) {
      console.log('production mode');
      this.googleAnalyticsService.initialize();
    }
  }

  public selectLanguage(event: any) {
      this.translate.use(event.target.value);
  }

  getPosition(): Promise<any>{
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
