import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';

import { MapMarker, MapInfoWindow, GoogleMap } from "@angular/google-maps";

import { } from '@angular/google-maps';
import { catchError, map, Observable, of } from 'rxjs';
import { timezoneMap } from 'src/app/data/internationalizationZones';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
    public apiLoaded: Observable<boolean>;

    public markerPositions: google.maps.LatLngLiteral[] = [];
    public markers: any[] = []

     
    public center: google.maps.LatLngLiteral = { 
        lat: 37.7749295,  // San francisco why not
        lng: -122.4194155 
    };

    public options: google.maps.MapOptions = {
        zoom: 9,
        mapId: '1f8473d802bbf22c',

    };

    // @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    // @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
    // @ViewChild(MapMarker, { static: false }) mapMarkerMapMarker: MapMarker;


    constructor(private readonly httpClient: HttpClient) {
        this.loadApiOnly();
        this.getCurrentLocation();
    }

    ngOnInit(): void {
    }
    
    ngAfterViewInit() {
    }

    public loadApiOnly() {
        this.apiLoaded = this.loadApi().pipe(map(() => true));
    }

    private loadApi(): Observable<any> {
        const key = environment.googleMapKey;
        return this.httpClient.jsonp(
            `https://maps.googleapis.com/maps/api/js?key=${key}`,
            'callback'
        );
    }
    
    private getCurrentLocation(): void {
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
        navigator?.permissions?.query({name:'geolocation'}).then((result) => {
            if (result.state === 'prompt' || result.state === 'denied' ) {
                this.getLocationByTimeZone();
            }
        });


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
            });
        }
    }

    private getLocationByTimeZone(): void {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('---->' + timezoneMap, timezoneMap[timezone].latitude)
        if (timezone && timezoneMap[timezone]?.latitude && timezoneMap[timezone]?.longitude) {
            this.center = {
                lat: timezoneMap[timezone].latitude ?? this.center.lat,
                lng: timezoneMap[timezone].longitude ?? this.center.lng
            }
        }
    }

    
}
