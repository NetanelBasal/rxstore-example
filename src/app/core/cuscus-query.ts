import { Store } from './cuscus-store';
import { ActiveState, EntityState, HashMap, ID } from './cuscus-config';
import { Observable } from 'rxjs/Observable';

export class Query<S extends EntityState, E> {
  constructor(protected store: Store<S, E>) {}

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

    const selectIds$ = this.store.select(state => state.ids);
    const selectEntities$ = this.store.select(state => state.entities);

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
    if (asMap) return this.store.value().entities as HashMap<E>;

    const ids = this.store.value().ids;
    const entities = this.store.value().entities;
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
  selectEntity<R>(id: ID): Observable<E>;
  selectEntity<R>(id: ID, project: (entity: E) => R): Observable<R>;
  selectEntity<R>(id: ID, project?: (entity: E) => R): Observable<R | E> {
    if (!project) {
      return this._byId(id);
    }
    return this.store.select(state => {
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
    return this.store.value().entities[id];
  }

  /**
   * Select the active id
   * @returns {Observable<number | string>}
   */
  selectActive(): Observable<ID> {
    return this.store.select(state => (state as S & ActiveState).active);
  }

  /**
   * Get the active id
   * @returns {ID}
   */
  getActive(): ID {
    return (this.store.value() as S & ActiveState).active;
  }

  /**
   * Select an selectEntity by id
   *
   * @param {number} id
   * @returns {Observable<any>}
   */
  private _byId(id: ID): Observable<E> {
    return this.store.select(state => state.entities[id]).filter(Boolean);
  }

  /**
   *
   * Get the entities as observable
   *
   * @returns {Observable<HashMap<E>>}
   */
  private _entitiesAsMap(): Observable<HashMap<E>> {
    return this.store.select(state => state.entities);
  }
}
