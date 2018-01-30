import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    mapWorker: any;
  }
}

function mapWorker(cb) {
  var subject = new Subject();
  var worker = _createWorker(cb);

  worker.onmessage = function(e) {
    subject.next(e.data);
  };

  this.subscribe(function(value) {
    worker.postMessage(value);
  });

  return subject;
}

function _createWorker(fn) {
  const blob = new Blob(
    ['self.cb = ', fn, ';', 'self.onmessage = function (e) { self.postMessage(self.cb(e.data)) }'],
    {
      type: 'text/javascript'
    }
  );

  var url = URL.createObjectURL(blob);

  return new Worker(url);
}

Observable.prototype.mapWorker = mapWorker;
