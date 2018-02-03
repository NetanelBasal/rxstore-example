import { Inject, Injectable } from '@angular/core';
import { STORES } from './core/cuscus-config';
import { Store } from './core/cuscus-store';

@Injectable()
export class AppStores {
  constructor(@Inject(STORES) private stores: Store<any, any>[]) {
    const genState = this.generateState.bind(this);

    this.stores.forEach(store => {
      const original = store.setState;
      store.setState = function(newStateFn) {
        console.log(`%c prev state `, 'font-weight: bold; color: darkgrey', genState());
        original.call(this, newStateFn);
        console.log(`%c next state `, 'font-weight: bold; color: hotpink', genState());
      };
    });
  }

  generateState() {
    return this.stores.reduce((acc, store) => {
      acc[store.constructor.name] = store.value();
      return acc;
    }, {});
  }
}
