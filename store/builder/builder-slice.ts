import { EditorField } from "@/utils/builder/fields";
import {
  InsertMoveItem,
  MoveItemPropType,
  RemoveConfig,
  RemoveItem,
} from "@/utils/builder/move-item";
import { NewFieldConfig } from "@/utils/builder/schema-gen";
import { BuilderDataType } from "@/utils/builder/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const BuilderData: BuilderDataType = {
  editorConfig: {},
  editorStruct: [],
};

export const BuilderSlice = createSlice({
  initialState: BuilderData,
  name: "builder",
  reducers: {
    // reducers for handling builder / editor state;
    addStructItem: (state, action: PayloadAction<EditorField>) => {
      const item = action.payload;
      state.editorStruct.push(item);

      state.editorConfig[item.id] = NewFieldConfig(item);

      return state;
    },
    insertNewItem: (state, action: PayloadAction<Omit<MoveItemPropType, "items">>) => {
      const { idx, insertItem, itemId, secIdx } = action.payload;
      const items = [...state.editorStruct];
      state.editorStruct = InsertMoveItem({ items, idx, insertItem, itemId, secIdx });
      const isPresent = state.editorConfig[insertItem.id];
      if (isPresent) return state;

      // TODO temp config generator
      state.editorConfig[insertItem.id] = NewFieldConfig(insertItem);
    },
    moveToBaseEditor: (
      state,
      action: PayloadAction<Pick<MoveItemPropType, "itemId" | "insertItem">>
    ) => {
      const { insertItem, itemId: prevId } = action.payload;
      const items = [...state.editorStruct];
      const { items: newItems } = RemoveItem({ items, itemId: prevId, delItem: {} as EditorField });
      state.editorStruct = [...newItems, insertItem];

      const prevData = state.editorConfig[prevId];
      if (prevData) {
        state.editorConfig[insertItem.id] = prevData;
        delete state.editorConfig[prevId];
      }
      return state;
    },
    moveEditorItems: (
      state,
      action: PayloadAction<Omit<MoveItemPropType & { prevId: string }, "items">>
    ) => {
      const { prevId, idx, insertItem, itemId, secIdx } = action.payload;
      const items = [...state.editorStruct];
      try {
        let newItems = InsertMoveItem({ items, idx, insertItem, itemId, secIdx });

        const { items: nits } = RemoveItem({
          items: newItems,
          itemId: prevId,
          delItem: {} as EditorField,
        });
        newItems = nits;
        state.editorStruct = [...newItems];
        const prevData = state.editorConfig[prevId];
        const newId = insertItem.id;
        if (prevData) {
          state.editorConfig[newId] = { ...prevData, id: newId };
          delete state.editorConfig[prevId];
        }
        return state;
      } catch (error) {
        console.error(error);
      }
    },
    removeEditorItem: (state, action: PayloadAction<{ id: string }>) => {
      const id = action.payload.id;
      const items = [...state.editorStruct];
      const { items: nits, delItem } = RemoveItem({
        items,
        itemId: id,
        delItem: {} as EditorField,
      });
      state.editorStruct = nits;
      if (delItem) {
        const config = RemoveConfig({ config: state.editorConfig, item: [delItem] });
        state.editorConfig = config;
      }
      return state;
    },
  },
});

export const { addStructItem, insertNewItem, moveEditorItems, moveToBaseEditor, removeEditorItem } =
  BuilderSlice.actions;
const builderReducer = BuilderSlice.reducer;
export default builderReducer;
