import { DatasetItem } from '../hooks/useDataset';

export type TagData = {
  id: string;
  text: string,
  color: string;
  textColor: 'dark' | 'light',
};

export type Tag = DatasetItem<TagData>;
