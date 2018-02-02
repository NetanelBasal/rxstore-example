import { EntityState, ID } from './cuscus-config';

export class CRUD {
  /**
   *
   * @param {T} state
   * @param {any[]} entities
   * @returns {T}
   * @private
   */
  _addAll<T extends EntityState>(state: T, entities: any[], idKey): T {
    const toHashMap = this.keyBy(entities, idKey);
    return {
      ...(state as any),
      entities: toHashMap,
      ids: entities.map(entity => entity[idKey])
    };
  }

  /**
   *
   * @param {T} state
   * @param entity
   * @param idKey
   * @returns {T}
   * @private
   */
  _addOne<T extends EntityState>(state: T, entity, idKey): T {
    return {
      ...(state as any),
      ids: [...state.ids, ...entity[idKey]],
      entities: {
        ...state.entities,
        [entity[idKey]]: entity
      }
    };
  }

  /**
   *
   * @param {T} state
   * @param {any[]} entities
   * @returns {T}
   * @private
   */
  _addMany<T extends EntityState>(state: T, entities: any[], idKey): T {
    let addedEntities = {};
    let addedIds = [];
    entities.forEach(entity => {
      addedEntities[entity[idKey]] = entity;
      addedIds.push(entity[idKey]);
    });
    return {
      ...(state as any),
      entities: {
        ...state.entities,
        ...addedEntities
      },
      ids: [...state.ids, ...addedIds]
    };
  }

  /**
   *
   * @param {T} state
   * @param {string | number} id
   * @param newState
   * @returns {T}
   * @private
   */
  _updateOne<T extends EntityState>(state: T, id: ID, newState): T {
    const newEntity = state.entities[id].assign(newState);
    return {
      ...(state as any),
      entities: {
        ...state.entities,
        [id]: newEntity
      }
    };
  }

  /**
   *
   * @param {T} state
   * @param {ID[]} ids
   * @param newState
   * @returns {T}
   * @private
   */
  _updateMany<T extends EntityState>(state: T, ids: ID[] | null, newState): T {
    const updatedEntities = (ids ? ids : state.ids).reduce((acc, id) => {
      const newEntity = state.entities[id].assign(newState);
      acc[id] = newEntity;
      return acc;
    }, {});

    return {
      ...(state as any),
      entities: {
        ...state.entities,
        ...updatedEntities
      }
    };
  }

  /**
   *
   * @param {T} state
   * @param {number | string} id
   * @returns {T}
   * @private
   */
  _removeOne<T extends EntityState>(state: T, id: ID): T {
    const { [id]: entity, ...rest } = state.entities;

    return {
      ...(state as any),
      entities: rest,
      ids: state.ids.filter(current => current !== id)
    };
  }

  /**
   *
   * @param {T} state
   * @param {ID[]} ids
   * @returns {T}
   * @private
   */
  _removeMany<T extends EntityState>(state: T, ids: ID[]): T {
    const removed = ids.reduce((acc, id) => {
      const { [id]: entity, ...rest } = acc;
      return rest;
    }, state.entities);

    return {
      ...(state as any),
      entities: removed,
      ids: state.ids.filter(current => ids.indexOf(current) === -1)
    };
  }

  /**
   *
   * @param {T} state
   * @returns {T}
   * @private
   */
  _removeAll<T extends EntityState>(state: T, active?: ID): T {
    const newState = {
      ...(state as any),
      entities: {},
      ids: []
    };
    if (active) {
      newState.active = active;
    }

    return newState;
  }

  /**
   *
   * @param {any[]} entities
   * @param {string} id
   * @returns {any}
   */
  private keyBy(entities: any[], id = 'id') {
    return entities.reduce((acc, entity) => {
      acc[entity[id]] = entity;
      return acc;
    }, {});
  }
}
