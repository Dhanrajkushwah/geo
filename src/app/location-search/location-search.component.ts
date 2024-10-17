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
  private openCageApiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  private openCageApiKey = '5a80c453852c4ca1a423dcba76379c46';

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Initialize the Leaflet map
  private initMap(): void {
    this.map = L.map('map', { center: [18.5204, 73.8567], zoom: 13 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const defaultIcon = this.createMarkerIcon();
    const marker = L.marker([18.5204, 73.8567], { icon: defaultIcon }).addTo(this.map);
    marker.bindPopup('Pune, Maharashtra').openPopup();
  }

  // Create a Leaflet marker icon
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

  // Handle search input changes for autocomplete suggestions
  onSearchChange(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    if (searchQuery.length > 0) {
      const url = `${this.openCageApiUrl}?q=${searchQuery}&key=${this.openCageApiKey}`;
      this.http.get<any>(url).subscribe(data => {
        this.suggestions = data.results || [];
      });
    } else {
      this.suggestions = [];
    }
  }

  // Handle suggestion click to update the map and query
  selectSuggestion(suggestion: any): void {
    const lat = suggestion.geometry.lat;
    const lon = suggestion.geometry.lng;
    this.map.setView([lat, lon], 13);

    if (!this.marker) {
      this.marker = L.marker([lat, lon], { icon: this.createMarkerIcon() }).addTo(this.map);
    } else {
      this.marker.setLatLng([lat, lon]);
    }

    this.query = suggestion.formatted;
    this.suggestions = [];
  }

  // Search for location based on query and update the map
  searchLocation(): void {
    if (this.query.trim() === '') return;

    const url = `${this.openCageApiUrl}?q=${this.query}&key=${this.openCageApiKey}`;
    this.http.get<any>(url).subscribe(data => {
      if (data.results && data.results.length > 0) {
        const lat = data.results[0].geometry.lat;
        const lon = data.results[0].geometry.lng;

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
