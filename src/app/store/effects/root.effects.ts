import { inject, isDevMode } from '@angular/core';
import {
  Observable,
  combineLatestWith,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NetworkActions, NetworkStateRecord } from '../reducers';
import { State } from '../../../types/State';
import { NetworkStatus } from '../../../enums/NetworkStatus';
import { NetworkState } from '../../../types/NetworkState';
import { getDatabase, onValue, query, ref } from 'firebase/database';
import { Endpoint } from 'src/enums/Endpoint';
import { Action, Store } from '@ngrx/store';
import { HNItem } from 'src/types/HNItem';

export const initEffect = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType('@ngrx/effects/init'),
      map((action) => {})
    );
  },
  { functional: true, dispatch: false }
);

export const devtoolsEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType('@ngrx/effects/init'),
      filter(() => isDevMode()),
      combineLatestWith([store, actions$]),
      tap((stream) => {
        const [_action, state] = stream;
        const action = stream.at(2);
        const { type, ...payload } = action;
        const ext = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
        ext?.send({ type, payload }, state);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const maxItemEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType('@ngrx/effects/init'),
      mergeMap((_action) => {
        const database = getDatabase();
        const r = ref(database, `/v0/${Endpoint.maxitem}`);
        const s: Observable<Action> = new Observable((subscriber) => {
          onValue(query(r), (d) => {
            subscriber.next(
              NetworkActions.maxitem({
                status: NetworkStatus.streaming,
                response: d.val(),
              })
            );
          });
        });
        return s;
      })
    );
  },
  { functional: true }
);

export const fetchCommentsEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(NetworkActions.maxitem),
      withLatestFrom(store),
      mergeMap(([action, state]) => {
        return new Observable<any>((s) => {
          const network: NetworkStateRecord = state.network;
          const maxitem = action.response;

          const maxLocalItem = network.meta.maxItemLocal;
          const maxFetched = maxLocalItem ?? maxitem - 10;

          const database = getDatabase();
          const getRef = (id: number | string) =>
            ref(database, `/v0/${Endpoint.item}/${id}`);

          if (maxFetched && maxFetched < maxitem) {
            for (let i = maxFetched; i < maxitem; i++) {
              if (network.item[i]?.status === undefined) {
                const dispatch = (id: number, networkState: NetworkState) =>
                  s.next(NetworkActions.mergeitem({ id, networkState }));

                dispatch(i, { status: NetworkStatus.awaiting });

                const unsub = onValue(getRef(i), (doc) => {
                  const val = doc.val();

                  if (val) {
                    unsub();
                    dispatch(i, {
                      status: NetworkStatus.resolved,
                      response: val,
                    });
                  } else {
                    dispatch(i, {
                      status: NetworkStatus.streaming,
                    });
                  }
                });
              } // else pass
            }
          }
        });
      })
    );
  },
  { functional: true }
);

export const fetchUserEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(NetworkActions.mergeitem),
      withLatestFrom(store),
      mergeMap(([action, state]) => {
        return new Observable<any>((s) => {
          state as State;
          const item = action.networkState.response as HNItem;

          const dispatch = (id: string, networkState: NetworkState) =>
            s.next(NetworkActions.mergeuser({ id, networkState }));

          const userBy = item?.by;
          const users = state.network.user;
          const userRequestStatus = users[userBy]?.status;

          if (userBy && userRequestStatus === undefined) {
            dispatch(userBy, { status: NetworkStatus.awaiting });

            const database = getDatabase();
            const getRef = (id: number | string) =>
              ref(database, `/v0/${Endpoint.user}/${id}`);

            const unsub = onValue(
              getRef(userBy),
              (doc) => {
                const val = doc.val();

                if (val) {
                  unsub();
                  dispatch(userBy, {
                    status: NetworkStatus.resolved,
                    response: val,
                  });
                } else {
                  dispatch(userBy, {
                    status: NetworkStatus.streaming,
                  });
                }
              },
              (error) => {
                dispatch(userBy, {
                  status: NetworkStatus.rejected,
                  error,
                });
              }
            );
          }
        });
      })
    );
  },
  { functional: true }
);

export const propagateEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(NetworkActions.mergeitem),
      withLatestFrom(store),
      mergeMap(([action, state]) => {
        return new Observable<any>((s) => {
          state as State;

          const item = action.networkState.response;
          const items = state.network.item;

          const dispatch = (networkState: NetworkState) =>
            s.next(NetworkActions.mergeitem({ id: item.parent, networkState }));

          if (item?.parent && items[item.parent]?.status === undefined) {
            dispatch({ status: NetworkStatus.awaiting });

            const database = getDatabase();
            const getRef = (id: number | string) =>
              ref(database, `/v0/${Endpoint.item}/${id}`);

            const unsub = onValue(getRef(item.parent), (doc) => {
              const val = doc.val();

              if (val) {
                unsub();
                dispatch({
                  status: NetworkStatus.resolved,
                  response: val,
                });
              } else {
                dispatch({
                  status: NetworkStatus.streaming,
                });
              }
            });
          }
        });
      })
    );
  },
  { functional: true }
);

export const effect = createEffect(
  () => {
    return inject(Actions).pipe(
      tap(({ type, payload }) => {
        // pass
      })
    );
  },
  { functional: true, dispatch: false }
);
