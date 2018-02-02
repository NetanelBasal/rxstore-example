import { Observable } from 'rxjs/Observable';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    mapWorker: typeof mapWorker;
  }
}

/**
 *
 * @param cb
 * @returns {Observable<any>}
 */
function mapWorker(cb) {
  return new Observable(observer => {
    const worker = _createWorker(cb);

    worker.onmessage = function(e) {
      observer.next(e.data);
      observer.complete();
      worker.terminate();
    };

    worker.onerror = function(error) {
      observer.error(error);
      worker.terminate();
    };

    this.subscribe(value => {
      worker.postMessage(value);
    });
  });
}

/**
 *
 * @param fn
 * @returns {Worker}
 * @private
 */
function _createWorker(fn) {
  const blob = new Blob(
    ['self.cb = ', fn, ';', 'self.onmessage = function (e) { self.postMessage(self.cb(e.data)) }'],
    {
      type: 'text/javascript'
    }
  );

  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

Observable.prototype.mapWorker = mapWorker;
