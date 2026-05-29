import { useState } from 'react';
import { uid } from '@/components/admin/types';

export function useCrud<T extends { id: string }>(seed: T[]) {
    const [items, setItems] = useState<T[]>(seed);

    const create = (data: Omit<T, 'id'>) => setItems((prev) => [...prev, { ...(data as T), id: uid() }]);

    const update = (id: string, data: Partial<T>) =>
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));

    const remove = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

    return { items, create, update, remove };
}