import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CRUD as _CRUD } from './cuscus-crud';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import { ActiveState, EntityState, HashMap, ID } from './cuscus-config';

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
   * Select the collection as array
   *
   * this.store.selectAll();
   * Observable[Entity, Entity, Entity, Entity]
   *
   * Or as map:
   *
   * this.store.selectAll(true);
   *
   * Observable<{1: Entity, 2: Entity}>
   *
   * @returns {Observable<E[]> | Observable<HashMap<E>>}
   */
  selectAll(asMap?: false): Observable<E[]>;
  selectAll(asMap: true): Observable<HashMap<E>>;
  selectAll(asMap?: boolean): Observable<E[] | HashMap<E>>;
  selectAll(asMap = false): Observable<E[] | HashMap<E>> {
    if (asMap) return this._entitiesAsMap();

    const selectIds$ = this.select(state => state.ids);
    const selectEntities$ = this.select(state => state.entities);

    return selectEntities$.withLatestFrom(selectIds$, (entities, ids) => {
      return ids.map(id => entities[id]);
    });
  }

  /**
   * Get the collection as array
   *
   * [Entity, Entity, Entity]
   *
   * Or as map:
   *
   * { 1: Entity, 2: Entity }
   *
   * @returns {E[] | HashMap<E>}
   */
  getAll(asMap?: false): E[];
  getAll(asMap: true): HashMap<E>;
  getAll(asMap?: boolean): E[] | HashMap<E>;
  getAll(asMap = false): E[] | HashMap<E> {
    if (asMap) return this.value().entities as HashMap<E>;

    const ids = this.value().ids;
    const entities = this.value().entities;
    return ids.map(id => entities[id]);
  }

  /**
   * Return the entity or a slice from the entity
   * this.pagesStore.selectEntity(1)
   * this.pagesStore.selectEntity(1, entity => entity.config.date)
   *
   * @param {ID} id
   * @param {(selectEntity: E) => R} project
   * @returns {Observable<R>}
   */
  selectEntity<R>(id: ID, project?: (entity: E) => R): Observable<R | E> {
    if (!project) {
      return this._byId(id) as Observable<E>;
    }
    return this.select(state => {
      const entity = state.entities[id];
      if (entity) {
        return project(entity);
      }
      return null;
    });
  }

  /**
   * Get the entity by id
   *
   * this.store.getEntity(1);
   *
   * @param id
   * @returns {any}
   */
  getEntity(id: ID): E {
    return this.value().entities[id];
  }

  /**
   * Select the active id
   * @returns {Observable<number | string>}
   */
  selectActive(): Observable<ID> {
    return this.select(state => (state as S & ActiveState).active);
  }

  /**
   * Get the active id
   * @returns {ID}
   */
  getActive(): ID {
    return (this.value() as S & ActiveState).active;
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
    this._addMiddlewares(newState);
    this.dispatch(newState);
  }

  /**
   * Create or update entity
   * @param id
   * @param entity
   */
  createOrUpdate(id: ID, entity: Partial<E> | E) {
    if (this.value().entities[id]) {
      this.updateOne(id, entity);
    } else {
      this.addOne(entity as E);
    }
  }

  /**
   * Replace current collection with provided collection
   *
   * this.store.addAll([Entity, Entity]);
   *
   * @param {E[]} entities
   */
  addAll(entities: E[]) {
    this.setState(state => this._crud._addAll(state, entities, this.idKey));
  }

  /**
   *
   * Add one selectEntity to the collection
   *
   * this.store.addOne(Entity)
   *
   * @param entity
   * @param id
   */
  addOne(entity: E) {
    this.setState(state => this._crud._addOne(state, entity, this.idKey));
  }

  /**
   *
   * Add multiple entities to the collection
   *
   * this.store.addMany([
   *  Entity, Entity, Entity
   * ]);
   *
   * @param {E[]} entities
   */
  addMany(entities: E[]) {
    this.setState(state => this._crud._addMany(state, entities, this.idKey));
  }

  /**
   *
   * Update one selectEntity in the collection
   *
   * this.store.updateOne(3, {
   *   name: 'New Name'
   * });
   *
   * @param id
   * @param newState
   */
  updateOne(id: ID, newState: Partial<E>) {
    this.setState(state => this._crud._updateOne(state, id, newState));
  }

  /**
   *
   * Update multiple entities in the collection
   *
   * this.store.updateMany([1,2,3], {
   *   name: 'New Name'
   * });
   *
   * Or all of them:
   *
   * this.store.updateMany(null, {
   *   completed: true
   * });
   * @param ids
   * @param newState
   */
  updateMany(ids: ID[] | null, newState: Partial<E>) {
    this.setState(state => this._crud._updateMany(state, ids, newState));
  }

  /**
   *
   * Remove one selectEntity from the collection
   *
   * this.store.removeOne(5);
   *
   * @param id
   */
  removeOne(id: ID) {
    this.setState(state => this._crud._removeOne(state, id));
  }

  /**
   *
   * Remove multiple entities from the collection
   *
   * this.store.removeMany([1, 6, 5]);
   *
   * @param id
   */
  removeMany(ids: ID[]) {
    this.setState(state => this._crud._removeMany(state, ids));
  }

  /**
   *   lear entity collection
   */
  removeAll(active?) {
    this.setState(state => this._crud._removeAll(state, active));
  }

  /**
   *
   * Set the selectActive selectEntity
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
   * Select an selectEntity by id
   *
   * @param {number} id
   * @returns {Observable<any>}
   */
  private _byId(id: ID): Observable<E> {
    return this.select(state => state.entities[id]).filter(Boolean);
  }

  /**
   *
   * Get the entities as observable
   *
   * @returns {Observable<HashMap<E>>}
   */
  private _entitiesAsMap(): Observable<HashMap<E>> {
    return this.select(state => state.entities);
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
