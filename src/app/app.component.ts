import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { TodosQuery } from './todos/config/todos.query';
import { Observable } from 'rxjs/Observable';
import { Todo } from './todos/config/todo.model';
import { TodosService } from './todos/config/todos.service';
import 'rxjs/add/operator/do';
import { VISIBILITY_FILTER } from './todos/filter/filter.model';
import { FilterQuery } from './todos/filter/filter.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]>;
  active$: Observable<VISIBILITY_FILTER>;
  filters = [
    { label: 'All', value: 'SHOW_ALL' },
    { label: 'Completed', value: 'SHOW_COMPLETED' },
    { label: 'Active', value: 'SHOW_ACTIVE' }
  ];

  constructor(
    private todosQuery: TodosQuery,
    private filterQuery: FilterQuery,
    private _differs: KeyValueDiffers,
    private todosService: TodosService
  ) {}

  ngOnInit() {
    this.todos$ = this.todosQuery.selectVisibleTodos$.do(res => {
      console.log('getVisibleTodos$', res);
    });
    this.active$ = this.filterQuery.visibilityFilter$;
  }

  add(input) {
    this.todosService.add(input.value);
    input.value = '';
  }

  complete(todo: Todo) {
    this.todosService.complete(todo);
  }

  delete(id) {
    this.todosService.delete(id);
  }

  changeFilter(filter: VISIBILITY_FILTER) {
    this.todosService.updateFilter(filter);
  }
}
