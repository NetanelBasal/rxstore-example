import { CRUD } from '../cuscus-crud';
import { ID } from '../cuscus-config';
import { Entity } from '../cuscus-entity';
import { coerceArray } from '../cuscus-utils';

class Todo extends Entity<Todo> {
  constructor(public id: ID, public title: string, public dummy = []) {
    super();
  }
}

function getEntitiesCount(store) {
  return Object.keys(store.entities).length;
}

describe('CRUD', () => {
  const crud = new CRUD();
  let store = {
    entities: {},
    ids: []
  };

  describe('addAll', () => {
    it('should set entities', () => {
      const todoOne = new Todo(1, '1');
      const todoTwo = new Todo(2, '2');

      store = crud._add(store, [todoOne, todoTwo], 'id');

      expect(getEntitiesCount(store)).toEqual(2);
      expect(store.ids.length).toBe(2);
      expect(store.entities[1]).toBe(todoOne);
      expect(store.entities[2]).toBe(todoTwo);
    });
  });

  describe('addOne', () => {
    it('should add one', () => {
      const todo = new Todo(3, '3');
      store = crud._add(store, coerceArray(todo), 'id');

      expect(getEntitiesCount(store)).toBe(3);
      expect(store.ids.length).toBe(3);
      expect(store.entities[3]).toBe(todo);
    });
  });

  describe('addMany', () => {
    it('should add many', () => {
      const one = new Todo(4, '4');
      const two = new Todo(5, '5');
      const three = new Todo(6, '6');

      store = crud._add(store, [one, two, three], 'id');

      expect(getEntitiesCount(store)).toBe(6);
      expect(store.ids.length).toBe(6);
      expect(store.entities[4]).toBe(one);
      expect(store.entities[5]).toBe(two);
      expect(store.entities[6]).toBe(three);
    });
  });

  describe('updateOne', () => {
    it('should update one', () => {
      const old = store.entities[3];
      store = crud._update(store, [3], { title: 'changed' });

      expect(store.entities[3].title).toBe('changed');
      expect(store.entities[3].id).toBe(3);
      expect(old).not.toBe(store.entities[3]);
      expect(old.dummy).toBe(store.entities[3].dummy);
      expect(getEntitiesCount(store)).toBe(6);
      expect(store.ids.length).toBe(6);
    });
  });

  describe('updateMany', () => {
    it('should update many', () => {
      const oldOne = store.entities[4];
      const oldTwo = store.entities[5];
      const oldThree = store.entities[6];

      store = crud._update(store, [4, 5, 6], { title: 'changed many' });

      expect(store.entities[4].title).toBe('changed many');
      expect(store.entities[5].title).toBe('changed many');
      expect(store.entities[6].title).toBe('changed many');

      expect(oldOne).not.toBe(store.entities[4]);
      expect(oldTwo).not.toBe(store.entities[5]);
      expect(oldThree).not.toBe(store.entities[6]);

      expect(oldOne.dummy).toBe(store.entities[4].dummy);
      expect(oldTwo.dummy).toBe(store.entities[5].dummy);
      expect(oldThree.dummy).toBe(store.entities[6].dummy);

      expect(store.entities[4] instanceof Todo).toBe(true);
      expect(store.entities[5] instanceof Todo).toBe(true);
      expect(store.entities[6] instanceof Todo).toBe(true);

      expect(getEntitiesCount(store)).toBe(6);
      expect(store.ids.length).toBe(6);
    });
  });
  describe('removeOne', () => {
    it('should remove one', () => {
      store = crud._remove(store, [3]);

      expect(getEntitiesCount(store)).toBe(5);
      expect(store.ids.length).toBe(5);
      expect(store.entities[3]).toBe(undefined);
    });
  });

  describe('removeMany', () => {
    it('should remove many', () => {
      store = crud._remove(store, [4, 5]);

      expect(getEntitiesCount(store)).toBe(3);
      expect(store.ids.length).toBe(3);
      expect(store.ids).toEqual([1, 2, 6]);
      expect(store.entities[4]).toBe(undefined);
      expect(store.entities[5]).toBe(undefined);
      expect(store.entities[1]).toBeDefined();
      expect(store.entities[2]).toBeDefined();
      expect(store.entities[6]).toBeDefined();
    });
  });

  describe('removeAll', () => {
    it('should remove all', () => {
      store = crud._remove(store, null);

      expect(getEntitiesCount(store)).toBe(0);
      expect(store.ids.length).toBe(0);
      expect(store.ids).toEqual([]);
    });
  });

  describe('utils', () => {
    it('should convert an array to hashmap', () => {
      const todoOne = new Todo(1, '1');
      const todoTwo = new Todo(2, '2');
      const arr = [todoOne, todoTwo];

      expect(crud['keyBy'](arr)).toEqual({
        1: todoOne,
        2: todoTwo
      });
    });
  });
});
