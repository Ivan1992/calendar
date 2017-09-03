import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitResults'
})
export class LimitResultsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.slice(0,5);
  }

}
