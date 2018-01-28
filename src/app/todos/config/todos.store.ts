import {Entityable, Store} from "../../core/store";
import {Todo} from "./todo.model";

export interface State extends Entityable<Todo> {
}

const initialState: State = {
  entities: {
    1: new Todo(1, "one")
  },
  ids: [1]
};

export class TodosStore extends Store<State, Todo> {
  constructor() {
    super(initialState);
  }
}
