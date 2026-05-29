export type ID = string | number;

export interface CarouselImage {
    id: ID;
    imageUrl: string;
    title?: string;
    caption?: string;
}

export interface InfoCard {
    id: ID;
    title: string;
    description?: string;
    imageUrl?: string;
}

export interface ListItem {
    id: ID;
    title: string;
    description: string;
}

export interface FAQ {
    id: ID;
    question: string;
    answer: string;
}

export const uid = () => Math.random().toString(36).slice(2, 10);