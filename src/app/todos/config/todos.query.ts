import { Injectable } from '@angular/core';
import { TodosStore } from './todos.store';
import { FilterQuery } from '../filter/filter.query';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Query } from '../../core/akita-query';
import { Todo } from './todo.model';
import { State } from './todos.store';

@Injectable()
export class TodosQuery extends Query<State, Todo> {
  selectVisibleTodos$ = combineLatest(
    this.filterQuery.visibilityFilter$,
    this.selectAll(),
    this.getVisibleTodos
  );

  constructor(protected store: TodosStore, private filterQuery: FilterQuery) {
    super(store);
  }

  private getVisibleTodos(filter, todos): Todo[] {
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
