import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matDirectionsBus } from '@ng-icons/material-icons/baseline';

interface Turno {
  turno: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-card-turno',
  imports: [CommonModule, NgIconComponent],
  templateUrl: './card-turno.component.html',
  styleUrl: './card-turno.component.css',
  viewProviders: [provideIcons({ matDirectionsBus })],
})
export class CardTurnoComponent {
  @Input() kmlAnterior = 0;
  @Input() kmlAtual = 0;
  @Input() giro = 0;
  @Input() freio = 0;
  @Input() pedal = 0;
  @Input() placa = '';
  @Input() linha = '';
  @Input() data = '';
  @Input() turno = '';
  // @Input() fase = '';


  turnos: Turno[] = [
    {
      turno: 'Madrugada',
      start: '00:00',
      end: "05:59",
    },
    {
      turno: 'Manhã',
      start: '06:00',
      end: "11:59",
    },
    {
      turno: 'Intervalo',
      start: '12:00',
      end: "13:59",
    },
    {
      turno: 'Tarde',
      start: '14:00',
      end: "19:59",
    },
    {
      turno: 'Noite',
      start: '20:00',
      end: "23:59",
    },
  ];

  get horaTurno(): Turno {
    const turnoEncontrado = this.turnos.find(turno => turno.turno === this.turno);
    return (
      turnoEncontrado ?? {
        turno: this.turno,
        start: '',
        end: '',
      }
    );
  }

  get kmlAnteriorClass(): string {
    if (this.kmlAnterior === this.kmlAtual) return 'bg-gray-600';
    else if ((this.kmlAnterior > this.kmlAtual)) return 'bg-red-600';
    else return 'bg-green-600';
  }

  get kmlAtualClass(): string {
    if (this.kmlAtual === 2.50) return 'bg-yellow-500';
    else if (this.kmlAtual < 2.50) return 'bg-red-600';
    else return 'bg-green-600';
  }

  // get kmlAtualClass(): string {
  //   const val = this.kmlAtual;

  //   switch (this.fase.toLowerCase()) {
  //     case 'bronze':
  //       if (val <= 1.5) return 'bg-red-600';
  //       if (val === 2.0) return 'bg-yellow-500';
  //       if (val >= 2.5) return 'bg-green-600';
  //       break;
  
  //     case 'prata':
  //       if (val <= 2.0) return 'bg-red-600';
  //       if (val <= 3.0) return 'bg-yellow-500';
  //       if (val >= 3.5) return 'bg-green-600';
  //       break;
  
  //     case 'ouro':
  //       if (val <= 3.0) return 'bg-red-600';
  //       if (val <= 4.0) return 'bg-yellow-500';
  //       if (val >= 4.5) return 'bg-green-600';
  //       break;
  //   }
  
  //   return 'bg-gray-300'; // fallback (caso fase ou valor inválido)
  // }
  

  get giroClass(): string {
    if (this.giro === 7) return 'bg-yellow-500';
    else if (this.giro > 7) return 'bg-red-600';
    else return 'bg-green-600';
  }

  get freioClass(): string {
    if (this.freio === 7) return 'bg-yellow-500';
    else if (this.freio > 7) return 'bg-red-600';
    else return 'bg-green-600';
  }

  get pedalClass(): string {
    if (this.pedal === 7) return 'bg-yellow-500';
    else if (this.pedal > 7) return 'bg-red-600';
    else return 'bg-green-600';
  }
}
