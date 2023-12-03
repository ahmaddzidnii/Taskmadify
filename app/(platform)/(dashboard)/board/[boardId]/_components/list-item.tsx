"use client";

import { ElementRef, useRef, useState } from "react";

import { ListWithCard } from "@/types";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

interface LIstItemProps {
  data: ListWithCard;
  index: number;
}
export const ListItem = ({ data, index }: LIstItemProps) => {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditting, setIsEditting] = useState<boolean>(false);

  const enableEditting = () => {
    setIsEditting(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    }, 0);
  };

  const disableEditting = () => {
    setIsEditting(false);
  };

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader onAddCard={enableEditting} data={data} />
        <ol className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2", data.cards.length > 0 ? "mt-2" : "mt-0")}>
          {
            data.cards.map((card,index) => (
              <CardItem 
              index={index}
              key={card.id}
              data={card}
              />
            ))
          }
        </ol>
        <CardForm listId={data.id} ref={textAreaRef} isEditting={isEditting} enableEditing={enableEditting} disableEditting={disableEditting} />
      </div>
    </li>
  );
};
