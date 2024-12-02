export type Message = Record<"date" | "message", string>;

export const input: Message[] = [
  { date: "2021-06-21", message: "message D" },
  { date: "2020-06-18", message: "message A" },
  { date: "2021-06-20", message: "message C" },
  { date: "2020-06-19", message: "message B" }
];
