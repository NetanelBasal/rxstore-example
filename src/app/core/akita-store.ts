import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CRUD as _CRUD } from './akita-crud';
import { EntityState, ID } from './akita-config';
import { coerceArray } from './akita-utils';
import { distinctUntilChanged, map } from 'rxjs/operators';

function logger({ storeName, currentState, newState }) {
  console.group(storeName);
  console.log(`%c prev state `, 'font-weight: bold; color: darkgrey', currentState);
  console.log(`%c next state `, 'font-weight: bold; color: hotpink', newState);
  console.groupEnd();
  return newState;
}

const PRE_MIDDLEWARES = [logger];

/**
 * Inject the class once to the store, so we can leverage the same instance
 */
const CRUD = new _CRUD();

/**
 * The Root Store that every sub store needs to inherit and
 * invoke `super` with the initial state.
 */
export class Store<S extends EntityState<E>, E> {
  /** Manage the store with BehaviorSubject */
  private _store: BehaviorSubject<S>;

  /** CRUD operations */
  private _crud = CRUD;

  /**
   *
   * Initial the store with the state
   *
   * @param initialState
   */
  constructor(initialState, private idKey = 'id') {
    this._store = new BehaviorSubject(initialState);
    // // this._addMiddlewares(initialState);
  }

  /**
   * Select a slice from the store
   *
   * this.store.select(state => state.entities)
   *
   * @param {(store: T) => R} project
   * @returns {Observable<R>}
   */
  select<R>(project: (store: S) => R): Observable<R> {
    return this._store$.pipe(map(project), distinctUntilChanged());
  }

  /**
   *
   * Get the raw state value
   *
   * @returns {S}
   */
  value(): S {
    return this._store.getValue();
  }

  /**
   *
   * Update the store with a new value
   *
   * @param {(state: S) => S} newStateFn
   */
  setState(newStateFn: (state: S) => S) {
    const newState = newStateFn(this.value());
    // this._addMiddlewares(newState);
    this.dispatch(newState);
    return newState;
  }

  /**
   * Replace current collection with provided collection
   *
   * this.store.set([Entity, Entity]);
   * this.store.set(Entity);
   *
   * @param {E[] | E} entities
   */
  set(entities: E[] | E) {
    this.setState(state => this._crud._set(state, coerceArray(entities), this.idKey));
  }

  /**
   * Add an entitiy/s to the collection
   *
   * this.store.add([Entity, Entity]);
   * this.store.add(Entity);
   *
   * @param {E[]} entities
   */
  add(entities: E[] | E) {
    this.setState(state => this._crud._add(state, coerceArray(entities), this.idKey));
  }

  /**
   *
   * Update entity/entities in the collection
   *
   * this.store.update(3, {
   *   name: 'New Name'
   * });
   *
   * this.store.update([1,2,3], {
   *   name: 'New Name'
   * });
   *
   *
   * this.store.update(null, {
   *   name: 'New Name'
   * });
   *
   * @param id
   * @param newState
   */
  update(id: ID | ID[] | null, newState: Partial<E>) {
    const ids = id == null ? this.value().ids : coerceArray(id as any);
    this.setState(state => this._crud._update(state, ids, newState));
  }

  /**
   *
   * Remove one/multi entities from the collection
   *
   * this.store.remove(5);
   *
   * this.store.remove([1,2,3]);
   *
   * this.store.remove();
   *
   * @param id
   */
  remove(id?: ID | ID[]) {
    const ids = id ? coerceArray(id) : null;
    this.setState(state => this._crud._remove(state, ids));
  }

  /**
   *
   * Set the active entity
   *
   * @param {number} id
   */
  setActive(id: ID) {
    this.setState(state => {
      return {
        ...(state as any),
        active: id
      };
    });
  }

  /**
   *
   * @param {S} state
   */
  private dispatch(state: S) {
    this._store.next(state);
  }

  /**
   *
   *
   * @returns {Observable<S>}
   * @private
   */
  private get _store$() {
    return this._store.asObservable();
  }

  /**
   *
   * @param newState
   * @private
   */
  private _addMiddlewares(newState) {
    PRE_MIDDLEWARES.forEach(middleware =>
      middleware({
        newState,
        currentState: this.value(),
        storeName: this.constructor.name
      })
    );
  }
}

/**
 *
 * @returns {EntityState}
 */
export const getInitialState = () =>
  ({
    entities: {},
    ids: []
  } as EntityState);
