import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CarouselStateService } from 'src/app/services/carousel-state.service';
import { ComponentRegistryService } from 'src/app/services/component-registry.service';
import { FooterDashVeiculosComponent } from '../footer/footer.component';
import { HeaderDashVeiculosComponent } from '../header/header.component';
import { ModalComponent } from '../modal/modal.component';
import { CardVeiculoPTurbinaComponent } from './card-veiculo.component';

describe('CardVeiculoPTurbinaComponent', () => {
  let component: CardVeiculoPTurbinaComponent;
  let fixture: ComponentFixture<CardVeiculoPTurbinaComponent>;
  let carouselStateService: CarouselStateService;
  let componentRegistryService: ComponentRegistryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ModalComponent,
        HeaderDashVeiculosComponent,
        FooterDashVeiculosComponent
      ],
      declarations: [CardVeiculoPTurbinaComponent],
      providers: [CarouselStateService, ComponentRegistryService]
    }).compileComponents();

    carouselStateService = TestBed.inject(CarouselStateService);
    componentRegistryService = TestBed.inject(ComponentRegistryService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardVeiculoPTurbinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.veiculos).toEqual([]);
    expect(component.selectedVehicle).toBeNull();
    expect(component.isHelpDialogOpen).toBeFalse();
    expect(component.showComments).toBeFalse();
    expect(component.showOilChangeForm).toBeFalse();
    expect(component.showOilChangeRecords).toBeFalse();
    expect(component.currentSlide).toBe(0);
  });

  it('should register component on init', () => {
    const spy = jest.spyOn(componentRegistryService, 'registerComponent');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(component);
  });

  it('should unregister component on destroy', () => {
    const spy = jest.spyOn(componentRegistryService, 'unregisterComponent');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(component);
  });

  it('should get correct color priority', () => {
    expect(component.getColorPriority('#6224AE')).toBe(1); // Roxo
    expect(component.getColorPriority('#AE2724')).toBe(2); // Vermelho
    expect(component.getColorPriority('#F56B15')).toBe(3); // Laranja
    expect(component.getColorPriority('#387E38')).toBe(4); // Verde
    expect(component.getColorPriority('#242427')).toBe(5); // Inativo
    expect(component.getColorPriority('#000000')).toBe(6); // Outros
  });

  it('should get correct attribute priority for turbine pressure', () => {
    const veiculo = {
      id: '1',
      atributos: [
        { cor: '#387E38' }, // Temperatura
        { cor: '#387E38' }, // Torque
        { cor: '#6224AE' }, // Pressão Turbina
        { cor: '#387E38' }, // Pedal
        { cor: '#387E38' }, // Ar Comprimido
        { cor: '#387E38' }  // Velocidade
      ]
    };

    expect(component.getAttributePriority(veiculo)).toBe(1); // Roxo na pressão da turbina
  });

  it('should handle vehicle without attributes', () => {
    const veiculo = { id: '1' };
    expect(component.getAttributePriority(veiculo)).toBe(6);
  });

  it('should handle vehicle with empty attributes', () => {
    const veiculo = { id: '1', atributos: [] };
    expect(component.getAttributePriority(veiculo)).toBe(6);
  });

  it('should get correct color options', () => {
    const options = component.getColorOptions();
    expect(options).toHaveLength(5);
    expect(options[0]).toEqual({ label: 'Inativo', value: '#242427' });
    expect(options[1]).toEqual({ label: 'Verde', value: '#387E38' });
    expect(options[2]).toEqual({ label: 'Laranja', value: '#F56B15' });
    expect(options[3]).toEqual({ label: 'Vermelho', value: '#AE2724' });
    expect(options[4]).toEqual({ label: 'Roxo', value: '#6224AE' });
  });

  it('should get closest color match', () => {
    const allColors = component.getAllAttributeColors();
    expect(component.getClosestColorMatch('#6224AE')).toBe('#6224AE');
    expect(component.getClosestColorMatch('#387E38')).toBe('#387E38');
    expect(component.getClosestColorMatch('#000000')).toBe(allColors[0]);
  });

  it('should calculate odometer since last oil change', () => {
    const veiculo = {
      odoAtual: 15000,
      odoNaUltimaTroca: 5000
    };

    component.calcularodoDesdeUltimaTroca(veiculo);
    expect(veiculo.odoDesdeUltimaTroca).toBe(10000);
    expect(veiculo.precisaTrocaOleo).toBe(true);
  });

  it('should handle missing odometer values', () => {
    const veiculo = {};
    component.calcularodoDesdeUltimaTroca(veiculo);
    expect(veiculo.odoDesdeUltimaTroca).toBe(0);
    expect(veiculo.precisaTrocaOleo).toBe(false);
  });

  it('should initialize carousel correctly', () => {
    component.veiculos = Array(100).fill({ id: '1' });
    component.itemsPerSlide = 90;
    component.initializeCarousel();
    expect(component.vehicleGroups.length).toBe(2);
    expect(component.vehicleGroups[0].length).toBe(90);
    expect(component.vehicleGroups[1].length).toBe(90);
  });

  it('should handle next slide', () => {
    component.vehicleGroups = [[], [], []];
    component.currentSlide = 0;
    component.nextSlide();
    expect(component.currentSlide).toBe(1);
  });

  it('should not go beyond last slide', () => {
    component.vehicleGroups = [[], []];
    component.currentSlide = 1;
    component.nextSlide();
    expect(component.currentSlide).toBe(1);
  });

  it('should stop auto slide on destroy', () => {
    const spy = jest.spyOn(component, 'stopAutoSlide');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
}); 