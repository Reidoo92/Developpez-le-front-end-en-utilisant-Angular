import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss'],
})
export class CountryDetailsComponent implements OnInit {
  countryName!: string;
  countryStats: { totalParticipations: number; totalMedals: number; totalAthletes: number } | null = null;

  constructor(private route: ActivatedRoute,
              private olympicService: OlympicService,
              private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.countryName = params['country'];
      this.olympicService.getCountryStats(this.countryName).subscribe(stats => {
        this.countryStats = stats;
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
