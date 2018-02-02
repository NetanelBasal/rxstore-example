import { Todo } from '../../todos/config/todo.model';
import { getInitialState, Store } from '../cuscus-store';
import { EntityState, HashMap } from '../cuscus-config';

export interface State extends EntityState<Todo> {}

const initialState: State = {
  ...getInitialState(),
  active: 1
};

export class TodosStore extends Store<State, Todo> {
  constructor() {
    super(initialState);
  }
}

let store = new TodosStore();

describe('Store', () => {
  let todo;
  it('should set the initial value', () => {
    expect(store.value()).toEqual({ active: 1, ...getInitialState() });
  });

  it('should select select slice from the store', () => {
    const s = store.select(state => state.ids).subscribe(ids => {
      expect(ids).toEqual(store.value().ids);
    });
    s.unsubscribe();

    const v = store.select(state => state.entities).subscribe(entities => {
      expect(entities).toEqual(store.value().entities);
    });
    v.unsubscribe();
  });

  it('should fire when we update the state', () => {
    const spy = jasmine.createSpy('select');

    const s = store.select(state => state.ids).subscribe(spy);
    todo = new Todo(1, '1');
    store.addOne(todo);
    expect(store.value().entities[1]).toBe(todo);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.calls.argsFor(0)[0]).toEqual([]);
    expect(spy.calls.argsFor(1)[0]).toEqual([1]);
    s.unsubscribe();
  });

  it('should select all as array', () => {
    const s = store.selectAll().subscribe((todos: Todo[]) => {
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBe(1);
      expect(todos[0]).toBe(todo);
    });
    s.unsubscribe();
  });

  it('should select all as map', () => {
    const s = store.selectAll(true).subscribe((todos: HashMap<Todo>) => {
      expect(Array.isArray(todos)).toBe(false);
      expect(Object.keys(todos).length).toBe(1);
      expect(todos[1]).toBe(todo);
    });
    s.unsubscribe();
  });

  it('should get all as array', () => {
    const todosStore = store.getAll() as Todo[];
    expect(Array.isArray(todosStore)).toBe(true);
    expect(todosStore.length).toBe(1);
    expect(todosStore[0]).toBe(todo);
  });

  it('should select entity', () => {
    const s = store.selectEntity(1).subscribe((current: Todo) => {
      expect(current).toEqual(todo);
    });
    s.unsubscribe();
  });

  it('should select slice from entity', () => {
    const s = store.selectEntity(1, entity => entity.title).subscribe(title => {
      expect(title).toBe(todo.title);
    });
    s.unsubscribe();
  });

  it('should not fire when the selected value does not changed', () => {
    const spy = jasmine.createSpy('spy');
    const s = store.selectEntity(1, entity => entity.title).subscribe(spy);
    store.updateOne(1, { completed: true });
    expect(spy).toHaveBeenCalledTimes(1);

    s.unsubscribe();
  });

  it('should fire when the selected value changed', () => {
    const spy = jasmine.createSpy('spy');
    const s = store.selectEntity(1, entity => entity.title).subscribe(spy);
    store.updateOne(1, { title: 'changed' });
    expect(spy).toHaveBeenCalledTimes(2);

    s.unsubscribe();
  });

  it('should not throw when the entity does not exists', () => {
    const s = store.selectEntity(2, entity => entity.title).subscribe(entity => {
      expect(entity).toBe(null);
    });

    s.unsubscribe();
  });

  it('should get the entity', () => {
    expect(store.getEntity(1)).toEqual(new Todo(1, 'changed', true));
  });

  it('should select the active', () => {
    const v = store.selectActive().subscribe(active => expect(active).toBe(1));
    v.unsubscribe();
  });

  it('should get the active', () => {
    expect(store.getActive()).toBe(1);
  });

  it('should update the state', () => {
    const spy = jasmine.createSpy('spy');
    const todo = new Todo(2, '2');
    const v = store.selectAll().subscribe(spy);

    store.setState(state => {
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo
        },
        ids: state.ids.concat([2])
      };
    });

    expect(store.value().entities[2]).toBe(todo);
    expect(spy).toHaveBeenCalledTimes(2);

    expect(spy.calls.argsFor(0)[0]).toEqual([store.getEntity(1)]);

    expect(spy.calls.argsFor(1)[0]).toEqual([store.getEntity(1), todo]);

    v.unsubscribe();
  });

  it('should get the initial state', () => {
    expect(getInitialState()).toEqual({
      entities: {},
      ids: []
    });
  });
});

class Filter {
  constructor(public filterId, public active) {}
}

export interface FilterState extends EntityState<Filter> {}

const state: State = {
  ...getInitialState()
};

export class FilterStore extends Store<FilterState, Filter> {
  constructor() {
    super(initialState, 'filterId');
  }
}

const filterStore = new FilterStore();

describe('Store - custom id key', () => {
  it('should support custom ids', () => {
    const filter = new Filter(1, true);
    filterStore.addOne(filter);
    expect(filterStore.getEntity(1)).toBe(filter);
    expect(filterStore.getAll(true)[1]).toBe(filter);
  });

  it('should support add many', () => {
    const filter1 = new Filter(2, true);
    const filter2 = new Filter(3, true);
    const filter3 = new Filter(4, true);
    filterStore.addMany([filter1, filter2, filter3]);
    expect(filterStore.getAll(true)[2]).toBe(filter1);
    expect(filterStore.getAll(true)[3]).toBe(filter2);
    expect(filterStore.getAll(true)[4]).toBe(filter3);
  });
});
