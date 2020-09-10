import { configureStore } from "@reduxjs/toolkit";
import content from "./ContentModule";

export default configureStore({
  reducer: {
    content,
  },
});
