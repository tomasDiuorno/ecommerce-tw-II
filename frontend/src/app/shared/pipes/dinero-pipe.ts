import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dinero',
})
export class DineroPipe implements PipeTransform {
  transform(value: number) {
    return '$' + value;
  }
}
