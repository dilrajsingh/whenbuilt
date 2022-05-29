import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MapMarker, MapInfoWindow, GoogleMap, MapMarkerClusterer } from "@angular/google-maps";
import { } from '@angular/google-maps';
import { catchError, map, Observable, of } from 'rxjs';
import { timezoneMap } from 'src/app/data/internationalizationZones';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked{
    @ViewChild(GoogleMap) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
    @ViewChild(MapMarker, { static: false }) mapMarkerMapMarker: MapMarker;
    @ViewChild(MapMarkerClusterer) clusters: MapMarkerClusterer;


    public apiLoaded: Observable<boolean>;


    /** Marker items */
    public markerOptions: google.maps.MarkerOptions = { //used directly by <map-marker [options]>
        draggable: false,
        animation: 4
    };
    public markers:  any[] = []; // technically google.maps.Marker[]

    /** Mark clusterer */
    public readonly markerClustererImagePath: URL = new URL('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m');



    /**Map items */
    public center: google.maps.LatLngLiteral = { 
        lat: 37.7749295,  // San francisco why not
        lng: -122.4194155 
    };

    public options: google.maps.MapOptions = {
        zoom: 9,
        mapId: '1f8473d802bbf22c',

    };


    constructor(private readonly httpClient: HttpClient) {
        this.loadApiOnly();
        this.getCurrentLocation();
    }

    ngOnInit(): void {
    }
    
    ngAfterViewInit() {
    }

    ngAfterViewChecked() {
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

    /** Code inspiration from:
     *   https://stackoverflow.com/questions/32437865/android-google-map-marker-placing marker offset
     *   https://developers.google.com/android/reference/com/google/android/gms/maps/model/MarkerOptions#MarkerOptions()
    */
    addMarker(event?: google.maps.MapMouseEvent) {


        function randomNumber(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1) + min)
            
        }

        console.log(event?.latLng?.toJSON());
        const iconBase = "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

        const icons: Record<string, { icon: string }> = {
            parking: {
                icon: iconBase + "parking_lot_maps.png",
            },
            library: {
                icon: iconBase + "library_maps.png",
            },
            info: {
                icon: iconBase + "info-i_maps.png",
            },
        };

        if (event) {
            const myMarker: google.maps.Marker = new google.maps.Marker();
            myMarker.setPosition({
                lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
                lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
            });
            myMarker.setLabel({
                color: 'red',
                text: 'Marker label ' + (this.markers.length + 1),
            })
            myMarker.setTitle('Marker title ' + (this.markers.length + 1));
            // myMarker.setOptions(this.markerOptions); // this will not work with Marker type.
            const iconImageType = ['parking', 'info', 'library'][randomNumber(0,2)];
            console.log(icons[iconImageType]);
            myMarker.setIcon(icons[iconImageType].icon);
            this.markers.push(myMarker);
        }
    }


}
