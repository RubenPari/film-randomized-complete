import type { AppIconName } from './AppIcon.js';

export type CollectionFilter = 'all' | 'movies' | 'tv';

export interface CollectionCopy {
  totalItemsKey: string;
  inListKey: string;
  emptyIcon: AppIconName;
  emptyTitleKeys: {
    all: string;
    movies: string;
    tv: string;
  };
  emptyDescriptionAllKey: string;
  emptyDescriptionFilterKey: string;
  ctaLabelKey: string;
  ctaTo?: string;
  singleItemLabelKey: string;
  multipleItemsLabelKey: string;
  removeErrorKey: string;
  dismissErrorKey: string;
}
