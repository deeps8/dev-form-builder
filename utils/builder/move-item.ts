import { EditorField } from "./fields";
import { EditorConfig } from "./types";

export type MoveItemPropType = {
  items: EditorField[];
  insertItem: EditorField;
  itemId: string;
  idx: number;
  secIdx?: number;
};

export function InsertMoveItem({ items, insertItem, itemId, idx, secIdx = 0 }: MoveItemPropType) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      if (idx === -1) {
        items[i].child[secIdx] = [insertItem];
      } else {
        items = [...items.slice(0, idx), insertItem, ...items.slice(idx)];
      }
      return items;
    } else {
      for (let j = 0; j < items[i].child.length; j++) {
        items[i].child[j] = InsertMoveItem({
          items: items[i].child[j],
          insertItem,
          itemId,
          idx,
          secIdx,
        });
      }
    }
  }
  return items;
}

export function RemoveItem({
  items,
  itemId,
  delItem,
}: Pick<MoveItemPropType, "items" | "itemId"> & { delItem: EditorField }) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      delItem = items.splice(i, 1)[0];
      return { items, delItem };
    } else {
      for (let j = 0; j < items[i].child.length; j++) {
        const { items: newItems, delItem: di } = RemoveItem({
          items: items[i].child[j],
          itemId,
          delItem,
        });
        items[i].child[j] = newItems;
        delItem = di;
      }
    }
  }
  return { items, delItem };
}

export function MoveItem({ items, insertItem, itemId, idx }: MoveItemPropType) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      items = arrayMove(items, i, idx);
      return items;
    } else {
      for (let j = 0; j < items[i].child.length; j++) {
        items[i].child[j] = MoveItem({ items: items[i].child[j], insertItem, itemId, idx });
      }
    }
  }
  return items;
}

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  from = from || 0;
  to = to === -1 ? array.length - 1 : to || 0;
  if (from >= to) {
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  } else {
    const removed = newArray.splice(from, 1)[0];
    newArray.splice(to - 1, 0, removed);
  }
  return newArray;
}

type RemoveConfigType = {
  config: EditorConfig;
  item: EditorField[];
};

export function RemoveConfig({ config, item }: RemoveConfigType) {
  for (let i = 0; i < item.length; i++) {
    delete config[item[i].id];
    for (let j = 0; j < item[i].child.length; j++) {
      config = RemoveConfig({ config, item: item[i].child[j] });
    }
  }
  return config;
}
