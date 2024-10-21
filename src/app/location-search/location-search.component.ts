import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';


@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})

export class LocationSearchComponent implements AfterViewInit{
  private map!: L.Map;
  private routingControl: any;
  public startLocation: string = '';
  public endLocation: string = '';
  public startSuggestions: any[] = [];
  public endSuggestions: any[] = [];
  private openCageApiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  private openCageApiKey = '5a80c453852c4ca1a423dcba76379c46';
  private startCoordinates: L.LatLng | null = null;
  private endCoordinates: L.LatLng | null = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

 
  private initMap(): void {
    this.map = L.map('map', { center: [18.5204, 73.8567], zoom: 13 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  onSearchChange(event: Event, type: string): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    if (searchQuery.length > 0) {
      const url = `${this.openCageApiUrl}?q=${searchQuery}&key=${this.openCageApiKey}`;
      this.http.get<any>(url).subscribe(data => {
        const suggestions = data.results || [];
        if (type === 'start') {
          this.startSuggestions = suggestions;
        } else {
          this.endSuggestions = suggestions;
        }
      });
    } else {
      if (type === 'start') {
        this.startSuggestions = [];
      } else {
        this.endSuggestions = [];
      }
    }
  }


  selectSuggestion(suggestion: any, type: string): void {
    const lat = suggestion.geometry.lat;
    const lon = suggestion.geometry.lng;

    if (type === 'start') {
      this.startCoordinates = L.latLng(lat, lon);
      this.startLocation = suggestion.formatted;
      this.startSuggestions = [];
    } else {
      this.endCoordinates = L.latLng(lat, lon);
      this.endLocation = suggestion.formatted;
      this.endSuggestions = [];
    }
  }


  swapLocations(): void {
    [this.startLocation, this.endLocation] = [this.endLocation, this.startLocation];
    [this.startCoordinates, this.endCoordinates] = [this.endCoordinates, this.startCoordinates];
  }

  calculateRoute(): void {
    if (!this.startCoordinates || !this.endCoordinates) {
      alert('Please select both start and end locations');
      return;
    }


    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    const plan = new L.Routing.Plan([this.startCoordinates, this.endCoordinates], {
      createMarker: (i: number, waypoint: L.Routing.Waypoint) => {
        const icon = i === 0 ? this.createMarkerIcon('start') : this.createMarkerIcon('end');
        return L.marker(waypoint.latLng, { icon });
      }
    });

  
    this.routingControl = L.Routing.control({
      plan: plan,
      routeWhileDragging: true
    }).addTo(this.map);
  }

  
  private createMarkerIcon(type: string): L.Icon {
    const iconUrl = type === 'start'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'  
      : '../../assets/endpoint.png'; 

    return L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }
}