import { isDevMode } from '@angular/core';
import { createActionGroup, props, createReducer, on } from '@ngrx/store';
import { Endpoint } from 'src/enums/Endpoint';
import { HNComment } from 'src/types/HNComment';
import { HNItem } from 'src/types/HNItem';
import { HNUser } from 'src/types/HNUser';
import { NetworkState } from '../../../types/NetworkState';

export type NetworkStateRecord = {
  meta: {
    maxitem: number | null;
    maxItemLocal: number | null;
  };
  request: Partial<Record<Endpoint, NetworkState>>;
  user: Record<string, NetworkState<HNUser>>;
  item: Record<string, NetworkState<HNItem>>;
};

export const NetworkActions = createActionGroup({
  source: 'Network',
  events: {
    [Endpoint.maxitem]: props<NetworkState>(),
    [Endpoint.beststories]: props<NetworkState>(),

    mergeUser: props<{ id: string; networkState: NetworkState<HNUser> }>(),
    mergeItem: props<{ id: number; networkState: NetworkState<HNComment> }>(),
  },
});

const initState: NetworkStateRecord = {
  meta: {
    maxitem: null,
    maxItemLocal: null,
  },
  request: {},
  user: {},
  item: {},
};

export const networkReducers = createReducer<NetworkStateRecord>(
  initState,
  on(NetworkActions.mergeuser, (state, { type, ...payload }) => {
    const newState: NetworkStateRecord = {
      ...state,
      user: {
        ...state.user,
        [payload.id]: payload.networkState,
      },
    };
    return newState;
  }),
  on(NetworkActions.mergeitem, (state, { type, ...payload }) => {
    const newState: NetworkStateRecord = {
      ...state,
      item: {
        ...state.item,
        [payload.id]: payload.networkState,
      },
    };
    return newState;
  }),
  on(NetworkActions.mergeitem, (state, { type, ...payload }) => {
    const newState: NetworkStateRecord = {
      ...state,
      item: {
        ...state.item,
        [payload.id]: payload.networkState,
      },
    };
    return newState;
  }),
  on(NetworkActions.maxitem, (state, { type, ...networkState }) => {
    const newState: NetworkStateRecord = {
      ...state,
      meta: {
        ...state.meta,
        maxitem: networkState.response,
        maxItemLocal: state.meta.maxitem,
      },
      request: {
        ...state.request,
        [Endpoint.maxitem]: networkState,
      },
    };
    return newState;
  }),
  on(NetworkActions.beststories, (state, { type, ...networkState }) => {
    const newState: NetworkStateRecord = {
      ...state,
      request: {
        ...state.request,
        [Endpoint.beststories]: networkState,
      },
    };
    return newState;
  })
);

export const reducers = {
  network: networkReducers,
};
