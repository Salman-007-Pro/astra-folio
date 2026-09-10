import type { Access } from "payload";
export const adminOnly: Access = ({ req }) => Boolean(req.user);
export const publishedOrAdmin: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };
