"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
/**
 * Observables
 *  - steam of data
 *  - lazy - will not start until someone subcribe.
 *  - emit value (next), error and complete
 * Observers
 *  - object to define callback methods to handle events/notifications by Observables
 *      - next
 *      - error
 *      - complete
 * Subscription
 *  - subsribe to an Obserables to start function, and provding call with Observers inside
 */
const observable = new rxjs_1.Observable(subcriber => {
    subcriber.next(1);
    subcriber.next(2);
    subcriber.next(3);
    // setTimeout(() => {
    //     subcriber.next(4);
    //     subcriber.complete();
    // }, 1000);
});
observable.subscribe({
    next(x) { console.log('got value' + x); },
    error(err) { console.error('something wrong occured: ' + err); },
    complete() { console.log('done'); }
});
/**
 * Operators
 *  - transformation
 *      - map, flatMap
 *  - filtering
 *      - filter
 *      - take
 *  - combination
 *      - merge
 *      - concat
 */
// Operators: filter - filtering
console.log('--------------- Operators: filter  -----------------');
(0, rxjs_1.of)(1, 2, 3, 4, 5)
    .pipe((0, rxjs_1.filter)(x => x % 2 === 0))
    .subscribe(value => console.log(value));
// Operators: map - transformation
console.log('--------------- Operators: map  -----------------');
(0, rxjs_1.of)(1, 2, 3)
    .pipe((0, rxjs_1.map)(x => x * x))
    .subscribe(value => console.log(value));
// Operators: combination
console.log('--------------- Operators: combination  -----------------');
const first = (0, rxjs_1.of)(1, 2, 3);
const second = (0, rxjs_1.of)(4, 5, 6);
(0, rxjs_1.merge)(first, second)
    .subscribe(value => console.log(value));
// Operators: error handlings
console.log('--------------- Operators: Error handling  -----------------');
(0, rxjs_1.throwError)('Error occured')
    .pipe((0, rxjs_1.catchError)(err => (0, rxjs_1.of)(err)))
    .subscribe({
    next: value => console.log(value),
    error: err => console.log('Error:', err),
    complete: () => console.log('Completed Error occured')
});
// Operators: Utility 
console.log('--------------- Operators: Utility  -----------------');
(0, rxjs_1.of)(1, 2, 3)
    .pipe((0, rxjs_1.tap)(value => console.log('Before: ', value)), (0, rxjs_1.map)(value => value * 10), (0, rxjs_1.tap)(value => console.log('After: ', value)))
    .subscribe(value => console.log('Output: ', value));
/**
 * Higher-Order Observables
 *  - nested Observable
 *  - Handling nested subscriptions
 *  - dynamtic data fetching
 *  - mergeMap, switchMap, concatMap, exhaustMap
 */
function fetchUserData(userId) {
    const delay = Math.floor(Math.random() * 2000); // Random delay between 0 and 2000 ms    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ userId, userName: `User-${userId}`, delay });
        }, delay);
    });
}
const userIds$ = (0, rxjs_1.of)(1, 2, 3, 4, 5);
/**
 * mergeMap - flatMap - concurrent
 *  - use when work on concurrently handle all iner Observables.
 *  - each inner Observable is subscribed to as soon as it is emitted.
 * Usage: It's ideal in scenarios where the order of emissions is not important,
 * or you need to start all observable sequences immediately and run them in parallel.
 * For example, triggering multiple asynchronous tasks like API calls without waiting for each to complete before starting the next.
 */
// console.log('--------------- Higher-Order Observables: mergeMap  -----------------')    
// userIds$.pipe(
//     mergeMap(userId => from(fetchUserData(userId)))
// ).subscribe(userDetails => {
//     console.log(`mergeMap: Fetched User Details: ${userDetails.userName} (after ${userDetails.delay}ms)`)
// });
/**
 * concatMap - waterfall
 *  - Use when you want to handle inner Observables one after another, in the extact order they were emitted
 *  - Waits for the current inner Observable to complete before subscribing to the next
 * Useage: Ideal for handling tasks that need to be performed in order and where each task must complete before the next one starts, such as queued tasks.
 */
// console.log('--------------- Higher-Order Observables: concatMap  -----------------')    
// userIds$.pipe(
//     concatMap(userId => from(fetchUserData(userId)))
// ).subscribe(userDetails => {
//     console.log(`concatMap: Fetched User Details: ${userDetails.userName} (after ${userDetails.delay}ms)`)
// });
// function performTask(taskId: number): Promise<string> {
//     return new Promise(resolve => {
//       const delay = Math.floor(Math.random() * 2000); // Random delay
//       setTimeout(() => {
//         resolve(`Completed Task ${taskId}`);
//       }, delay);
//     });
//   }
//   const taskIds$ = of(1, 2, 3, 4, 5);
//   taskIds$.pipe(
//     concatMap(taskId => from(performTask(taskId)))
//   ).subscribe(result => {
//     console.log(`concatMap: performTask: ${result}`); // Outputs tasks in order: 1, 2, 3, 4, 5, regardless of individual completion time
// });
/**
 * switchMap - latest
 *  - Use when you only care about the latest inner Observable
 *  - It unsubscribes from the previous inner Observable as soon as a new one is emitted.
 * Usage: Useful for scenarios like search inputs where you only care about the result of the latest emission.
 */
// console.log('--------------- Higher-Order Observables: switchMap  -----------------')    
// userIds$.pipe(
//     switchMap(userId => from(fetchUserData(userId)))
// ).subscribe(userDetails => {
//     console.log(`switchMap: Fetched User Details: ${userDetails.userName} (after ${userDetails.delay}ms)`)
// });
// Example of search when user enter into input fields 
// we will debounce and get last value change and switchMap
// function searchApi(query: string): Promise<string[]> {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve([`Result for "${query}"`]);
//       }, 1000); 
//     });
//   }
//   const searchInput = document.getElementById('search') as HTMLInputElement;
//   const input$ = fromEvent(searchInput, 'input');
//   input$.pipe(
//     debounceTime(300),
//     distinctUntilChanged(),
//     switchMap(event => searchApi(event.target.value))
//   ).subscribe(results => {
//     console.log(results); // Only shows results for the latest input value
// });
/**
 * exhaustMap
 *  - it ignores new emissions from the source Observable while the current inner Observable is still executing.
 * usage: Ideal for scenarios where you want to prevent new emissions until the current one has fully completed.
 * A common use case is to prevent multiple submissions in form submission scenarios,
 * where you don't want to start a new submission process until the current one has completed.
 */
console.log('--------------- exhaustMap  -----------------');
const userAction$ = (0, rxjs_1.interval)(300); // Simulates an action every 1 second
userAction$.pipe((0, rxjs_1.take)(5), // Limit to 5 actions
(0, rxjs_1.exhaustMap)((_, index) => {
    const userId = index + 1;
    return (0, rxjs_1.from)(fetchUserData(userId));
})).subscribe({
    next: data => console.log(`exhaustMap: Fetched User Data: ${data.userName}, Fetching Time: ${data.delay}ms`),
    complete: () => console.log('exhaustMap: Completed processing all user data')
});
/**
 * Subjects
 * - a special type of Observable
 *  - allow values to be multicasted to many Observers
 * Usage: broadcasting values to multiple subscribers, like in event emitters
 */
// console.log('--------------- Subjects  -----------------')    
// const subject = new Subject<number>();
// subject.subscribe({
//     next: (x) => console.log(`observerA: ${x}`)
// });
// subject.subscribe({
//     next: (x) => console.log(`observerB: ${x}`)
// });
// subject.next(1);
// subject.next(2);
/**
 * BehaviourSubject
 * - A variant of Subject
 *  - requires an initial value
 *  - emit its current value to new subscribers
 * Usage: Useful for representing "values over time".
 * For instance, in UI elements where you want to hold the latest value (like the current user or theme).
 */
// console.log('--------------- BehaviourSubject  -----------------')    
// const behaviourSubject = new BehaviorSubject(0);
// behaviourSubject.subscribe({
//     next: (x) => console.log(`observerA: ${x}`)
// });
// behaviourSubject.next(1);
// behaviourSubject.next(2);
// behaviourSubject.subscribe({
//     next: (x) => console.log(`observerB: ${x}`)
// });
// behaviourSubject.next(3);
/**
 * ReplaySubject
 * - A Subject
 *  - emit to any observer all of the items that were emitted by the source Observables(s)
 * Usage: Useful when you need to catch up with previous values emitted by the Subject.
 */
// console.log('--------------- ReplaySubject  -----------------')    
// const replaySubject = new ReplaySubject(3);
// replaySubject.next(1);
// replaySubject.next(2);
// replaySubject.next(3);
// replaySubject.next(4);
// replaySubject.subscribe({
//     next: (x) => console.log(`observerA: ${x}`)
// })
/**
 * AsyncSubject
 * - A variant of Subject that only emits the last value of the sequence only when the sequenece is completed
 * Usage: Useful in scenarious when you only care about the final result and not the intermediate values
 */
// console.log('--------------- AsyncSubject  -----------------')    
// const asyncSubject = new AsyncSubject();
// asyncSubject.subscribe({
//     next: (x) => console.log(`observerA: ${x}`)
// });
// asyncSubject.next(1);
// asyncSubject.next(2);
// asyncSubject.complete();
// asyncSubject.subscribe({
//     next: (x) => console.log(`observerB: ${x}`)
// })
