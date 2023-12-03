"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { ListWithCard } from "@/types";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCard[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess() {
      toast.success(`List reordered!`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess() {
      toast.success(`Card reordered!`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same postion
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // user moved a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map((item, index) => ({
        ...item,
        order: index,
      }));

      setOrderedData(items);

      executeUpdateListOrder({
        items,
        boardId,
      });
    }

    // user moved a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // source and destination list
      const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
      const destinationList = newOrderedData.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destinationList) {
        return;
      }

      // check if card  exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if card  exists on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          items: reorderedCards,
          boardId,
        });

        //user moved card to another list
      } else {
        // remove card to src list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // assign the new list id to the moved card
        movedCard.listId = destination.droppableId;

        // add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // update the order for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          items: destinationList.cards,
          boardId,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided) => (
          <ol {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1 " />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
