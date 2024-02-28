import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { OlympicService } from '../../core/services/olympic.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnDestroy {
  chart: Chart | null = null;
  countryName!: string;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.countryName = params['country'];
      this.olympicService.getMedalsByParticipation(this.countryName).subscribe(data => {
        const canvas = document.getElementById('lineChartCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (this.chart) {
          this.chart.destroy();
        }
        const config: ChartConfiguration = {
          type: 'line',
          data: {
            labels: data.map(d => d.year.toString()),
            datasets: [{
              label: `Total Medals for ${this.countryName}`,
              data: data.map(d => d.medalsCount),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        };
        this.chart = new Chart(ctx, config);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
