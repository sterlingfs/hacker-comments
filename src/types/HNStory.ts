import { HNItem } from './HNItem';

export type HNStory = Pick<
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
