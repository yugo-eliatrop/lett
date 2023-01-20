export type NotRequiredId<T extends { id: unknown }> = Omit<T, 'id'> & { id?: T['id'] };
