import {TodosStore} from "./todos.store";
import {TodosDataService} from "./todos-data.service";
import {TodosService} from "./todos.service";
import {TodosQuery} from "./todos.query";

export const todosProviders = [
  TodosStore,
  TodosDataService,
  TodosService,
  TodosQuery
];
