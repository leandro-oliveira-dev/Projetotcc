"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 8000;
// eslint-disable-next-line quotes
app.get("/", (request, response) => {
  return response.send({ message: "Hello Word" });
});
app.listen(PORT, () => {
  // eslint-disable-next-line quotes
  console.log(`Server is running ${PORT}`);
});
