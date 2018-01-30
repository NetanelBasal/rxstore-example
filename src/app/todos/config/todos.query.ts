import { Injectable } from '@angular/core';
import { TodosStore } from './todos.store';
import { FilterQuery } from '../filter/filter.query';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class TodosQuery {
  selectTodos$ = this.store.asArray();

  selectVisibleTodos$ = combineLatest(
    this.filterQuery.visibilityFilter$,
    this.selectTodos$,
    this.getVisibleTodos
  );

  constructor(private store: TodosStore, private filterQuery: FilterQuery) {}

  private getVisibleTodos(filter, todos) {
    switch (filter) {
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
      case 'SHOW_ALL':
      default:
        return todos;
    }
  }
}
