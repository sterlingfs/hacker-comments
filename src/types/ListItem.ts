import { HNItem } from './HNItem';
import { HNUser } from './HNUser';

export type ListItem = HNItem &
  Partial<{
    parentPost: HNItem & Partial<{ user: HNUser }>;
    user: HNUser;
    decoration: string;
  }>;
