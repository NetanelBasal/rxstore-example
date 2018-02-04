import { Store } from '../../core/akita-store';
import { Todo } from './todo.model';
import { EntityState } from '../../core/akita-config';

export interface State extends EntityState<Todo> {}

const initialState: State = {
  entities: {
    1: new Todo(1, 'one')
  },
  ids: [1]
};

export class TodosStore extends Store<State, Todo> {
  constructor() {
    super(initialState);
  }
}
