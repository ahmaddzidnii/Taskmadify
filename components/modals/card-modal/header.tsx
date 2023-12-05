"use client";

import { ElementRef, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";

import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface HeaderProps {
  data: CardWithList;
}
export const Header = ({ data }: HeaderProps) => {
  const queryCLient = useQueryClient();
  const params = useParams();

  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);

  const { execute } = useAction(updateCard, {
    onSuccess(data) {
      queryCLient.invalidateQueries({
        queryKey: ["cards", data.id],
      });
      toast.success(`Berhasil mengubah title menjadi "${data.title}"`);
    },

    onError(error) {
      toast.error(error);
    },
  });

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (title === data.title) {
      return;
    }

    execute({ title, boardId, id: data.id });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
            ref={inputRef}
            onBlur={onBlur}
          />
        </form>
        <p className="text-sm text-muted-foreground">
          di dalam list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="h-6 w-24 mb-1 bg-neutral-200" />
        <Skeleton className="h-4 w-24 bg-neutral-200" />
      </div>
    </div>
  );
};
