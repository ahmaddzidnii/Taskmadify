"use client";

import { Plus, X } from "lucide-react";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react";

import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditting: () => void;
  isEditting: boolean;
}
export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({ listId, enableEditing, disableEditting, isEditting }, ref) => {
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);

  const { execute, fieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" telah dibuat!`);
      formRef.current?.reset();
      disableEditting();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditting();
    }
  };

  useOnClickOutside(formRef, () => {
    disableEditting();
  });

  useEventListener("keydown", onKeyDown);

  const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const boardId = params.boardId as string;

    execute({ title, listId, boardId });
  };

  if (isEditting) {
    return (
      <form ref={formRef} action={onSubmit} className="m-1 py-0.5 px-1 space-y-4">
        <FormTextarea id="title" onKeyDown={onTextAreaKeyDown} ref={ref} placeholder="Masukan judul card..." />
        <input hidden id="listId" value={listId} name="listId" />
        <div className="flex items-center gap-x-1 ">
          <FormSubmit>Simpan</FormSubmit>
          <Button onClick={disableEditting} size="sm" variant="ghost">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div className="pt-2 px-2">
      <Button onClick={enableEditing} className="h-auto w-full p-2 px-1.5  justify-start text-muted-foreground text-sm" size="sm" variant="ghost">
        <Plus className="h-4 w-4 mr-2" />
        Buat Card
      </Button>
    </div>
  );
});

CardForm.displayName = "CardForm";
