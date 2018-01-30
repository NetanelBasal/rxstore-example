import { Injectable } from '@angular/core';
import { VisibilityFilterStore } from './filter.store';

@Injectable()
export class FilterQuery {
  visibilityFilter$ = this.store.select(s => s.active);

  constructor(private store: VisibilityFilterStore) {}
}
