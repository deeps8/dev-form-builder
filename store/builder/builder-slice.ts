import { EditorField } from "@/utils/builder/fields";
import { InsertMoveItem, MoveItemPropType, RemoveItem } from "@/utils/builder/move-item";
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
      state.editorStruct.push(action.payload);
      return state;
    },
    insertNewItem: (state, action: PayloadAction<Omit<MoveItemPropType, "items">>) => {
      const { idx, insertItem, itemId, secIdx } = action.payload;
      const items = [...state.editorStruct];
      state.editorStruct = InsertMoveItem({ items, idx, insertItem, itemId, secIdx });
      return state;
    },
    moveToBaseEditor: (
      state,
      action: PayloadAction<Pick<MoveItemPropType, "itemId" | "insertItem">>
    ) => {
      const { insertItem, itemId: prevId } = action.payload;
      const items = [...state.editorStruct];
      const newItems = RemoveItem({ items, itemId: prevId });
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
      console.log({ action });
      const { prevId, idx, insertItem, itemId, secIdx } = action.payload;
      const items = [...state.editorStruct];
      try {
        console.log({ items });
        let newItems = InsertMoveItem({ items, idx, insertItem, itemId, secIdx });
        console.log({ newItems });
        newItems = RemoveItem({ items: newItems, itemId: prevId });
        state.editorStruct = [...newItems];
        const prevData = state.editorConfig[prevId];
        if (prevData) {
          state.editorConfig[itemId] = prevData;
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
      state.editorStruct = RemoveItem({ items, itemId: id });

      delete state.editorConfig[id];
      return state;
    },
  },
});

export const { addStructItem, insertNewItem, moveEditorItems, moveToBaseEditor, removeEditorItem } =
  BuilderSlice.actions;
const builderReducer = BuilderSlice.reducer;
export default builderReducer;
