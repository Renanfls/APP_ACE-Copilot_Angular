import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matPerson } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-card-turno',
  imports: [CommonModule, NgIconComponent],
  templateUrl: './card-turno.component.html',
  styleUrl: './card-turno.component.css',
  viewProviders: [provideIcons({ matPerson })],
})
export class CardTurnoComponent {}
