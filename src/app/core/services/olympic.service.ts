import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error(error);
        this.olympics$.next([]);
        throw error;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getTotalMedalsByCountry(): Observable<{ country: string; totalMedals: number }[]> {
    return this.olympics$.pipe(
      map((countries) =>
        countries.map((country) => ({
          country: country.country,
          totalMedals: country.participations.reduce((acc, participation) => acc + participation.medalsCount, 0),
        }))
      )
    );
  }

  getStats(): Observable<{ totalJOs: number; totalCountries: number }> {
    return this.olympics$.pipe(
      map((countries) => {
        const uniqueJOs = new Set(countries.flatMap(country => country.participations.map(participation => participation.year)));
        return {
          totalJOs: uniqueJOs.size,
          totalCountries: countries.length,
        };
      })
    );
  }

  getCountryStats(countryName: string): Observable<{ totalParticipations: number; totalMedals: number; totalAthletes: number }> {
    return this.olympics$.pipe(
      map((countries) => {
        const country = countries.find(c => c.country === countryName);

        if (!country) {
          return { totalParticipations: 0, totalMedals: 0, totalAthletes: 0 };
        }

        const totalParticipations = country.participations.length;
        const totalMedals = country.participations.reduce((acc, participation) => acc + participation.medalsCount, 0);
        const totalAthletes = country.participations.reduce((acc, participation) => acc + participation.athleteCount, 0);

        return { totalParticipations, totalMedals, totalAthletes };
      })
    );
  }
  getMedalsByParticipation(countryName: string): Observable<{ year: number; medalsCount: number }[]> {
    return this.olympics$.pipe(
      map((countries) => {
        const country = countries.find(c => c.country === countryName);
        if (!country) {
          return [];
        }
        return country.participations.map((participation) => ({
          year: participation.year,
          medalsCount: participation.medalsCount,
        }));
      })
    );
  }
}
