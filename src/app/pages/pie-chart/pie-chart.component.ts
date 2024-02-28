import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables, ChartTypeRegistry, ChartConfiguration } from 'chart.js';
import { OlympicService } from '../../core/services/olympic.service'; // Ajustez le chemin selon la structure de votre projet
import { Router } from '@angular/router';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'] // Assurez-vous que l'extension est correcte
})
export class PieChartComponent implements OnInit, OnDestroy {
  chart: Chart | null = null;

  constructor(private olympicService: OlympicService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.olympicService.getTotalMedalsByCountry().subscribe(data => {
      const canvas = document.getElementById('medalsChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (this.chart) {
        this.chart.destroy();
      }
      const config: ChartConfiguration = {
        type: 'pie',
        data: {
          labels: data.map(d => d.country),
          datasets: [{
            label: '',
            data: data.map(d => d.totalMedals),
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, elements) => {
            if (elements.length > 0 && this.chart && this.chart.data && this.chart.data.labels) {
              const chartElement = elements[0];
              const index = chartElement.index;
              const labels = this.chart.data.labels as string[];
              const label = labels[index];
              if (label) {
                this.router.navigate(['/country-details/', label]);
              }
            }
          }
        }
      }
      this.chart = new Chart(ctx, config);
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
