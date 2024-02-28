import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { tap, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public medalsData: Observable<{ country: string; totalMedals: number }[]> = of([]);
  public stats?: { totalJOs: number; totalCountries: number };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {

    this.olympicService.loadInitialData().subscribe();

    this.medalsData = this.olympicService.getTotalMedalsByCountry().pipe(
      startWith([]))
    this.olympicService.getStats().pipe(
      tap(stats => this.stats = stats)
    ).subscribe();
  }
}
