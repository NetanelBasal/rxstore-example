import { FilterQuery } from './filter.query';
import { VisibilityFilterStore } from './filter.store';
import { TodosStore } from '../config/todos.store';
import { STORES } from '../../core/akita-config';

export const filterProviders = [
  FilterQuery,
  VisibilityFilterStore,
  {
    provide: STORES,
    useExisting: VisibilityFilterStore,
    multi: true
  }
];
