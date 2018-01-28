import {TodosStore} from "./todos.store";
import {Todo} from "./todo.model";
import {Injectable} from "@angular/core";
import {VisibilityFilterStore} from "../filter/filter.store";
import {VISIBILITY_FILTER} from "../filter/filter.model";

@Injectable()
export class TodosService {

  constructor(private todosStore: TodosStore, private filterStore: VisibilityFilterStore) {
  }

  updateFilter(filter: VISIBILITY_FILTER) {
    this.filterStore.update(state => {
      return {
        active: filter
      };
    });
  }

  complete({id, completed}: Todo) {
    this.todosStore.createOrUpdate(id, {completed});
  }

  add(title: string) {
    const id = Math.random();
    this.todosStore.add(id, new Todo(id, title));
  }

  delete(id) {
    this.todosStore.delete(id);
  }
}
