import { APP_BOOTSTRAP_LISTENER, Component, OnInit } from '@angular/core';
import * as atlas from 'azure-maps-control';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'whenbuilt';

  constructor() {

  }
  ngOnInit(): void {
    let pos = {
      lng: 6.7735,
      lat: 51.2277,
    } 


    this.getPosition().then(position => {
      pos.lng = position.lng;
      pos.lat = position.lat;
      console.log(`Position: ${position.lng} ${position.lat}`);
    })
    var map = new atlas.Map('myMap', {
      center: new atlas.data.Position( -79.7430075, 43.7747598),
      zoom: 10,
      showLogo: false,
      language: 'en-US',
      showBuildModels: true,
      // style: 'night'
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: '-vPd1RrHFHckSbYQGdxHH5r90fuvI4IuuEX8Ff76OlU'
      }
    });
    map.controls.add([
      new atlas.control.ZoomControl(),
      new atlas.control.CompassControl(),
      new atlas.control.PitchControl(),
      new atlas.control.StyleControl(),
    ], {
      position: atlas.ControlPosition.TopRight
    });

    //pin
    map.events.add('ready', function() {
      var dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);
      var layer = new atlas.layer.SymbolLayer(dataSource);
      map.layers.add(layer)
      dataSource.add(new atlas.data.Point( new atlas.data.Position( -79.7430075, 43.7747598)))
    })

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
