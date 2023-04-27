import { HNItem } from './HNItem';

export type HNComment = Pick<
  HNItem,
  | 'by'
  | 'descendants'
  | 'id'
  | 'kids'
  | 'score'
  | 'time'
  | 'title'
  | 'type'
  | 'url'
>;
