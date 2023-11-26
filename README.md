# RxJs

RxJS (Reactive Extensions for JavaScript) is a powerful library for reactive programming. It provides an efficient, flexible, and composable way to handle asynchronous and event-based data flows in your Angular applications.

## Content Overview
This guide covers the following key concepts and usage patterns in RxJS:

1. Observables
2. Observers
3. Subscription
4. Operators
5. Higher-Order Observables
6. Subjects and their Variants


## 1. Observables

Definition and Characteristics:
- Streams of Data: Observables represent streams of data. They can emit multiple values over time.
- Lazy Execution: Observables are lazy. They won't start emitting data until there is at least one Subscriber.
- Emissions: An Observable can emit three types of values:
  - next: Regular data values.
  - error: An error notification.
  - complete: A signal that the Observable has finished emitting values.

Basic Usage:

``` typescript
const observable = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  // Uncomment to see async behavior
  // setTimeout(() => {
  //   subscriber.next(4);
  //   subscriber.complete();
  // }, 1000);
});

observable.subscribe({  
  next(x) { console.log('got value ' + x); },
  error(err) { console.error('something wrong occurred: ' + err); },
  complete() { console.log('done'); }
});
```

## 2. Observers

Definition:
Handlers for Notifications: Observers are objects with callback methods to handle different types of notifications sent by Observables: next, error, and complete.

## 3. Subscription

Definition and Usage:
- Starting Observables: Subscribing to an Observable starts its execution. A Subscription has a subscribe method that takes an Observer.
- Unsubscribing: To prevent memory leaks, it's important to unsubscribe from Observables that have a long life or are not self-terminating.

## 4. Operators
Operators in RxJS are functions that enable manipulating the items emitted by Observables. Here are some key categories and examples:

Transformation Operators:
- `map`: Transforms each value emitted by the source Observable.
- `flatMap` / `mergeMap`: Projects each source value to an Observable and merges the emissions.

Filtering Operators:
- `filter`: Emits only those values from source Observable that meet a specific condition.
- `take`: Takes the first n values from the source Observable and then completes.

Combination Operators:
- `merge`: Turns multiple Observables into a single Observable.
- `concat`: Concatenates multiple Observables together.

Error Handling:
- `catchError`: Handles errors on the Observable.

Utility Operators:
- `tap`: Transparently performs actions or side-effects, such as logging.

``` typescript
// Filtering with filter
of(1, 2, 3, 4, 5)
  .pipe(filter(x => x % 2 === 0))
  .subscribe(value => console.log(value));

// Transforming with map
of(1, 2, 3)
  .pipe(map(x => x * x))
  .subscribe(value => console.log(value));

// Combining with merge
const first = of(1, 2, 3);
const second = of(4, 5, 6);
merge(first, second)
  .subscribe(value => console.log(value));

// Error handling
throwError('Error occurred')
  .pipe(catchError(err => of(err)))
  .subscribe(value => console.log(value));

// Utility with tap
of(1, 2, 3)
  .pipe(
    tap(value => console.log('Before: ', value)),
    map(value => value * 10),
    tap(value => console.log('After: ', value))
  )
  .subscribe(value => console.log('Output: ', value));
```

## 5. Higher-Order Observables

Definition and Usage:
- Nested Observables: They handle observables of observables.
- Usage: Especially useful in scenarios like nested subscriptions, dynamic data fetching, etc.
- Key Operators:
  - `mergeMap` (flatMap): Handles inner Observables concurrently.
  - `concatMap`: Handles inner Observables one after another, maintaining order.
  - `switchMap`: On each emission, unsubscribes from the previous inner Observable and subscribes to the new one.
  - `exhaustMap`: Ignores new inner Observables while the current one is still executing.

``` typescript
// Using mergeMap
userIds$.pipe(
  mergeMap(userId => from(fetchUserData(userId)))
).subscribe(userDetails => {
  console.log(`Fetched User Details: ${userDetails.userName} (after ${userDetails.delay}ms)`);
});

// Using concatMap
userIds$.pipe(
  concatMap(userId => from(fetchUserData(userId)))
).subscribe(userDetails => {
  console.log(`Fetched User Details: ${userDetails.userName} (after ${userDetails.delay}ms)`);
});
```

## 6. Subjects and Their Variants

Subjects:
- Multicasting: Subjects allow values to be multicasted to many Observers.
- Usage: Suitable for broadcasting values to multiple subscribers.

BehaviorSubject:
- Current Value: Requires an initial value and emits its current value to new subscribers.
- Usage: Ideal for representing values over time, like UI state.

ReplaySubject:
- Replay: Emits to new subscribers all the items emitted by the source Observable.
- Usage: Useful for catching up with previous values.

AsyncSubject:
- Last Value on Complete: Emits only the last value upon completion.
- Usage: Useful for scenarios where only the final result matters.

``` typescript
// Using Subject
const subject = new Subject<number>();
subject.subscribe(x => console.log(`Observer A: ${x}`));
subject.next(1);
subject.next(2);

// Using BehaviorSubject
const behaviorSubject = new BehaviorSubject(0);
behaviorSubject.subscribe(x => console.log(`Observer A: ${x}`));
behaviorSubject.next(1);
behaviorSubject.next(2);
behaviorSubject.subscribe(x => console.log(`Observer B: ${x}`)); // Will receive the latest value

// Using ReplaySubject
const replaySubject = new ReplaySubject(3); // Buffer size of 3
replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);
replaySubject.next(4);
replaySubject.subscribe(x => console.log(`Observer A: ${x}`)); // Will receive last 3 values

// Using AsyncSubject
const asyncSubject = new AsyncSubject();
asyncSubject.subscribe(x => console.log(`Observer A: ${x}`));
asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.complete();
asyncSubject.subscribe(x => console.log(`Observer B: ${x}`)); // Will receive only the last value
```
