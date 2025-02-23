"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormPreview from "./preview/form-preview";
import { useAppSelector } from "@/store/store";

export default function PreviewCode() {
  const { editorStruct } = useAppSelector((s) => s.builder);
  return (
    <div>
      <Tabs defaultValue="preview">
        <TabsList className="flex justify-center w-fit mx-auto">
          <TabsTrigger className="min-w-24" value="preview">
            Preview
          </TabsTrigger>
          <TabsTrigger className="min-w-24" value="code">
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          {editorStruct.length !== 0 ? <FormPreview /> : null}
        </TabsContent>
        <TabsContent value="code">Change your code here.</TabsContent>
      </Tabs>
    </div>
  );
}
