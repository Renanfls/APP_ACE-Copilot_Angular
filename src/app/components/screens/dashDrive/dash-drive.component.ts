import { Component } from '@angular/core';
import { InsuficentesLinhaComponent } from './insuficientes/components/insuficientes-linha/insuficientes-linha.component';
import { HeaderComponent } from "./insuficientes/components/header/header.component";

@Component({
  selector: 'app-dash-drive',
  imports: [
    InsuficentesLinhaComponent,
    HeaderComponent
],
  templateUrl: './dash-drive.component.html',
  styleUrl: './dash-drive.component.css',
})
export class DashDriveComponent {}
