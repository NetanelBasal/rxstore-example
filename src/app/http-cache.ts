import { Observable } from 'rxjs/Observable';
import { ID } from './core/cuscus-config';

export class HTTPCache<T = any> {
  protected _cache = new Map<ID, Observable<T>>();

  /**
   *
   * @param {ID} id
   * @param {Observable<any>} observable
   */
  protected addToCache(id: ID, observable: Observable<T>) {
    this._cache.set(id, observable);
  }

  /**
   *
   * @param {ID} id
   * @returns {boolean}
   */
  protected inCache(id: ID): boolean {
    return this._cache.has(id);
  }

  /**
   *
   * @param {ID} id
   * @returns {boolean}
   */
  protected getFromCache(id: ID): Observable<T> {
    return this._cache.get(id);
  }

  /**
   * Clear cache
   */
  protected clearCache() {
    this._cache.clear();
  }
}
