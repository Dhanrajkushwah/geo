import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})

export class LocationSearchComponent implements AfterViewInit{
  private map!: L.Map;
  private marker!: L.Marker;
  public query: string = '';
  public suggestions: any[] = [];
  private nominatimApiUrl = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=';

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
  
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', 
      iconSize: [25, 41], 
      iconAnchor: [12, 41],
      popupAnchor: [1, -34], 
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  
    const marker = L.marker([18.5204, 73.8567], { icon: defaultIcon }).addTo(this.map);
    marker.bindPopup("Pune, Maharashtra").openPopup();
  }
  

  private createMarkerIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],  
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34],  
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', 
      shadowSize: [41, 41]  
    });
  }

  onSearchChange(event: any): void {
    const searchQuery = event.target.value;
    if (searchQuery.length > 0) {
      const url = `${this.nominatimApiUrl}${searchQuery}`;
      this.http.get<any>(url).subscribe(data => {
        this.suggestions = data;
      });
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: any): void {
    const lat = suggestion.lat;
    const lon = suggestion.lon;
    this.map.setView([lat, lon], 13);

    if (!this.marker) {
      this.marker = L.marker([lat, lon], { icon: this.createMarkerIcon() }).addTo(this.map);
    } else {
      this.marker.setLatLng([lat, lon]);
    }

    this.query = suggestion.display_name;
    this.suggestions = [];
  }

  searchLocation(): void {
    if (this.query.trim() === '') return;

    const url = `${this.nominatimApiUrl}${this.query}`;
    this.http.get<any>(url).subscribe(data => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        this.map.setView([lat, lon], 13);

        if (!this.marker) {
          this.marker = L.marker([lat, lon], { icon: this.createMarkerIcon() }).addTo(this.map);
        } else {
          this.marker.setLatLng([lat, lon]);
        }

      } else {
        alert('Location not found');
      }
    });
  }
}