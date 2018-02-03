import { TodosStore } from './todos.store';
import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { VisibilityFilterStore } from '../filter/filter.store';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { of } from 'rxjs/observable/of';

@Injectable()
export class TodosService {
  constructor(private todosStore: TodosStore, private filterStore: VisibilityFilterStore) {
    const mockTodos = Array.from({ length: 10000 }, (_, x) => ({ id: x }));

    of(mockTodos)
      .workerMap(todos => {
        return todos.map(todo => ({
          id: todo.id,
          title: `Todo - ${todo.id}`,
          completed: false
        }));
      })
      .do(console.log)
      .subscribe();
  }

  updateFilter(filter: VISIBILITY_FILTER) {
    this.filterStore.setState(state => {
      return {
        active: filter
      };
    });
  }

  complete({ id, completed }: Todo) {
    this.todosStore.update(id, { completed });
  }

  add(title: string) {
    const id = Math.random();
    this.todosStore.add(new Todo(id, title));
  }

  delete(id) {
    this.todosStore.remove(id);
  }
}
