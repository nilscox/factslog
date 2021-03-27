import { useCallback, useEffect, useState } from 'react';

type Id = string | number;

export type DatasetItem<T extends { id: Id }> = T & {
  update: (item: Partial<Omit<T, 'id'>>) => void;
  remove: () => void;
};

export type Dataset<T extends { id: Id }> = [
  DatasetItem<T>[],
  {
    append: (item: T) => void;
    prepend: (item: T) => void;
    update: (id: Id, item: Partial<Omit<T, 'id'>>) => void;
    remove: (id: Id) => void;
  },
];

const useDataset = <T extends { id: Id }>(initialItems: T[] = []): Dataset<T> => {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const append = useCallback((item: T) => {
    setItems((items) => [...items, item]);
  }, []);

  const prepend = useCallback((item: T) => {
    setItems((items) => [item, ...items]);
  }, []);

  const update = useCallback((id: Id, item: Partial<Omit<T, 'id'>>) => {
    setItems((items) => {
      const idx = items.findIndex((item) => item.id === id);

      if (idx < 0) {
        return items;
      }

      return [...items.slice(0, idx), { ...items[idx], ...item }, ...items.slice(idx + 1)];
    });
  }, []);

  const remove = useCallback((id: Id) => {
    setItems((items) => items.filter(item => item.id !== id));
  }, []);

  const datasetItem = (item: T): DatasetItem<T> => ({
    ...item,
    update: (partial: Partial<Omit<T, 'id'>>) => update(item.id, partial),
    remove: () => remove(item.id),
  });

  return [
    items.map(datasetItem),
    {
      append,
      prepend,
      update,
      remove,
    },
  ];
};

export default useDataset;
