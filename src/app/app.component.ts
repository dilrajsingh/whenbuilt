import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as atlas from 'azure-maps-control';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string = 'When Built'; 

  constructor(public translate: TranslateService, 
    ) {
        translate.addLangs(['en','fr']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserCultureLang();
        translate.use(browserLang?.match(/en|fr/) ? browserLang : 'en');

  }
  ngOnInit(): void {

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
}
