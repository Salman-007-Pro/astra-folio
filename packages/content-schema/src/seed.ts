import content from "../../../content/portfolio.json";
import { portfolioSchema } from "./index";

// The editable source of truth for static mode and intentional CMS seeding.
export const seed = portfolioSchema.parse(content);
