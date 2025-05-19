import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Verifica se é celular (9 dígitos) ou telefone fixo (8 dígitos)
    if (numbers.length === 11) {
      // Formato: (XX) XXXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      // Formato: (XX) XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }

    // Retorna o número original se não corresponder aos formatos esperados
    return value;
  }
} 