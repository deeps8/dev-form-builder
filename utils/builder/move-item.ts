import { EditorField } from "./fields";

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

export function RemoveItem({ items, itemId }: Pick<MoveItemPropType, "items" | "itemId">) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      items.splice(i, 1);
      return items;
    } else {
      for (let j = 0; j < items[i].child.length; j++) {
        items[i].child[j] = RemoveItem({ items: items[i].child[j], itemId });
      }
    }
  }
  return items;
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
