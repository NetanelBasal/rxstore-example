import { TodosStore } from './todos.store';
import { TodosDataService } from './todos-data.service';
import { TodosService } from './todos.service';
import { TodosQuery } from './todos.query';
import { STORES } from '../../core/akita-config';

export const todosProviders = [
  TodosStore,
  TodosDataService,
  TodosService,
  TodosQuery,
  {
    provide: STORES,
    useExisting: TodosStore,
    multi: true
  }
];
