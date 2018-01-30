import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { values } from 'ramda';
import { CRUD as _CRUD } from './crud';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';

function logger({ storeName, currentState, newState }) {
  console.group(storeName);
  console.log(`%c prev state `, 'font-weight: bold; color: darkgrey', currentState);
  console.log(`%c next state `, 'font-weight: bold; color: hotpink', newState);
  console.groupEnd();
  return newState;
}

const PRE_MIDDLEWARES = [logger];

/**
 * Interface for objects
 *
 * const object: HashMap<Dashboard> = {
 *   1: Dashboard
 * }
 */
export interface HashMap<T> {
  [id: string]: T;
}

/**
 * Interface that forces the entities key
 */
export interface Entityable<T = any> {
  entities?: HashMap<T>;
  ids?: (number | string)[];

  /** This for stores that does not implement the Entityable interface */
  [key: string]: any;
}

/**
 * Interface that forces the active type
 */
export interface Activable {
  activeId: number;
}

export type ID = number | string;

/** Don't extend the CRUD class beacuse each store will recreate the class.
 * Inject the class once to the store to save memory.
 */
const CRUD = new _CRUD();

/**
 * The Root Store that every sub store needs to inherit and
 * invoke `super` with the initial state.
 */
export class Store<S extends Entityable<E>, E> {
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
  constructor(initialState) {
    this._store = new BehaviorSubject(initialState);
    this._addMiddlewares(initialState);
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
    return this._store$.map(project).distinctUntilChanged();
  }

  /**
   * Select the entities as an array instead of HashMap
   *
   * Observable[Entity, Entity, Entity, Entity]
   *
   * @returns {Observable<E[]>}
   */
  asArray(): Observable<E[]> {
    const selectIds$ = this.select(state => state.ids);
    const selectEntities$ = this.select(state => state.entities);

    return selectEntities$.withLatestFrom(selectIds$, (entities, ids) => {
      console.log('asArray');
      return ids.map(id => entities[id]);
    });
  }

  /**
   * Get the raw entities as array
   *
   * []
   * @returns {E[]}
   */
  asValueArray(): E[] {
    return values(this.value().entities);
  }

  /**
   * Select an entity by id
   *
   * @param {number} id
   * @returns {Observable<any>}
   */
  byId(id: ID): Observable<E> {
    return this.select(state => state.entities[id]).filter(Boolean);
  }

  /**
   * Return a slice from entity
   *
   * this.pagesStore.fromEntity(1, entity => entity.config.date)
   *
   * @param {ID} id
   * @param {(entity: E) => R} project
   * @returns {Observable<R>}
   */
  fromEntity<R>(id: ID, project: (entity: E) => R): Observable<R> {
    return this.select(state => {
      const entity = state.entities[id];
      if (entity) {
        return project(entity);
      }
      return null;
    }).distinctUntilChanged();
  }

  /**
   *
   * Get the entities directly as observable
   *
   * @returns {Observable<HashMap<E>>}
   */
  entities(): Observable<HashMap<E>> {
    return this.select(state => state.entities);
  }

  /**
   * Get the raw entity by id
   *
   * this.store.entity(1);
   *
   * @param id
   * @returns {any}
   */
  entity(id: ID): E {
    return this.value().entities[id];
  }

  /**
   * Get the active id
   * @returns {Observable<number | string>}
   */
  active(): Observable<ID> {
    return this.select(state => (state as S & Activable).activeId);
  }

  /**
   * Get the active raw id
   * @returns {ID}
   */
  asValueActive(): ID {
    return (this.value() as S & Activable).activeId;
  }

  /**
   *
   * Select the raw state value
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
  update(newStateFn: (state: S) => S) {
    const newState = newStateFn(this.value());
    this._addMiddlewares(newState);
    this.dispatch(newState);
  }

  /**
   * create or update an entity
   * @param id
   * @param entity
   */
  createOrUpdate(id: ID, entity: Partial<E> | E) {
    if (this.value().entities[id]) {
      this.put(id, entity);
    } else {
      this.add(id, entity as E);
    }
  }

  /**
   * Set new entities, pay attention that this will override the entities keys.
   * Useful for initial set or replacing the whole key.
   *
   * this.store.set({
   *   1: Entity,
   *   2: Entity
   * });
   *
   * @param {E[]} entities
   */
  set(entities: E[]) {
    this.update(state => this._crud._set(state, entities));
  }

  /**
   *
   * Add multiple entities as batch to trigger only one change
   *
   * this.store.addMany(
   *   1: Entity,
   *   2: Entity
   * );
   *
   * @param {E[]} entities
   */
  addMany(entities: E[]) {
    this.update(state => this._crud._addMany(state, entities));
  }

  /**
   *
   * Add new entity
   *
   * this.store.add({
   *   5: Entity
   * })
   *
   * @param entity
   * @param id
   */
  add(id: ID, entity: E) {
    this.update(state => this._crud._add(state, id, entity));
  }

  /**
   *
   * Update an entity
   *
   * this.store.put(3, {
   *   name: 'New Name'
   * });
   *
   * @param id
   * @param newState
   */
  put(id: ID, newState: Partial<E>) {
    this.update(state => this._crud._put(state, id, newState));
  }

  /**
   *
   * Delete an entity
   *
   * this.store.delete(5);
   *
   * @param id
   */
  delete(id: ID) {
    this.update(state => this._crud._delete(state, id));
  }

  /**
   * Clear store entities
   */
  clear(resetActive = false) {
    this.update(state => this._crud._clear(state, resetActive));
  }

  /**
   *
   * Set the entity id as active
   *
   * @param {number} id
   */
  setActive(id: ID) {
    this.update(state => {
      return {
        ...(state as any),
        activeId: id
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
 * @returns {Entityable}
 */
export const getInitialState = () =>
  ({
    entities: {},
    ids: []
  } as Entityable);
