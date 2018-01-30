// import {assocPath, dissocPath, lensPath, merge, omit} from "ramda";
import { Entityable } from './store';

// import produce from "immer";

export class CRUD {
  // private readonly ENTITIES_KEY = "entities";

  /**
   *
   * @param {T} state
   * @param {any[]} entities
   * @returns {T}
   * @private
   */
  _set<T extends Entityable>(state: T, entities: any[]): T {
    const toHashMap = this.keyBy(entities);
    return {
      ...(state as any),
      entities: toHashMap,
      ids: entities.map(entity => entity.id)
    };
    // return produce(state, draftState => {
    //   draftState.entities = toHashMap;
    //   draftState.ids = entities.map(entity => entity.id);
    // });
    // return assocPath([this.ENTITIES_KEY], toHashMap, state);
  }

  /**
   *
   * @param {T} state
   * @param entity
   * @returns {T}
   * @private
   */
  _add<T extends Entityable>(state: T, id, entity): T {
    return {
      ...(state as any),
      ids: [...state.ids, ...id],
      entities: {
        ...state.entities,
        [id]: entity
      }
    };
    // return produce(state, draftState => {
    //   draftState.entities[id] = entity;
    //   draftState.ids.push(id);
    // });
    // return assocPath([this.ENTITIES_KEY, id], entity, state);
  }

  /**
   *
   * @param {T} state
   * @param {any[]} entities
   * @returns {T}
   * @private
   */
  _addMany<T extends Entityable>(state: T, entities: any[]): T {
    let addedEntities = {};
    let addedIds = [];
    entities.forEach(entity => {
      addedEntities[entity.id] = entity;
      addedIds.push(entity.id);
    });
    return {
      ...(state as any),
      entities: {
        ...state.entities,
        ...addedEntities
      },
      ids: [...state.ids, ...addedIds]
    };
    // return produce(state, draftState => {
    //   entities.forEach(entity => {
    //     draftState.entities[entity.id] = entity;
    //     draftState.ids.push(entity.id);
    //   });
    // });
    // return assocPath([this.ENTITIES_KEY], merge(state.entities, toHashMap), state);
  }

  /**
   *
   * @param {T} state
   * @param {string | number} id
   * @param newState
   * @returns {T}
   * @private
   */
  _put<T extends Entityable>(state: T, id: string | number, newState): T {
    const newEntity = state.entities[id].assign(newState);
    return {
      ...(state as any),
      entities: {
        ...state.entities,
        [id]: newEntity
      }
    };
    // return produce(state, draftState => {
    //   draftState.entities[id] = {...state.entities[id], ...newState};
    // });
    // return assocPath([this.ENTITIES_KEY, id], merge(state.entities[id], newState), state);
  }

  /**
   *
   * @param {T} state
   * @param {number | string} id
   * @returns {T}
   * @private
   */
  _delete<T extends Entityable>(state: T, id: number | string): T {
    const { [id]: entity, ...rest } = state.entities;

    return {
      ...(state as any),
      entities: rest,
      ids: state.ids.filter(current => current !== id)
    };

    // return produce(state, draftState => {
    //   delete draftState.entities[id];
    //   draftState.ids = draftState.ids.filter(current => current !== id);
    // });
    // return dissocPath([this.ENTITIES_KEY, id], state);
  }

  /**
   *
   * @param {T} state
   * @returns {T}
   * @private
   */
  _clear<T extends Entityable>(state: T, resetActive?: boolean): T {
    return {
      ...(state as any),
      entities: {},
      ids: []
    };

    // return produce(state, draftState => {
    //   draftState.entities = {};
    // });
    // return assocPath([this.ENTITIES_KEY], {}, state);
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
