"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const observable = new rxjs_1.Observable(subcriber => {
    subcriber.next(1);
    subcriber.next(2);
    subcriber.next(3);
    setTimeout(() => {
        subcriber.next(4);
        subcriber.complete();
    }, 1000);
});
observable.subscribe({
    next(x) { console.log('got value' + x); },
    error(err) { console.error('something wrong occured: ' + err); },
    complete() { console.log('done'); }
});
