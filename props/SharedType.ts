export type SharedBag = {
  name: string;
};

export type SharedKey = keyof SharedBag;
export type SharedType = Partial<SharedBag>;
