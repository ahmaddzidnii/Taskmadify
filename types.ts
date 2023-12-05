import { Card, List } from "@prisma/client";

export type ListWithCard = List & { cards: Card[] };
export type CardWithList = Card & { list: List };
