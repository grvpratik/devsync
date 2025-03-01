"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRequestSchema = void 0;
const zod_1 = require("zod");
exports.SearchRequestSchema = zod_1.z.object({
    value: zod_1.z
        .string()
        .min(10, "Search value must be at least 10 characters")
        .max(1000, "Search value must not exceed 1000 characters"),
    project: zod_1.z
        .string()
        .min(1, "Project is required")
        .max(100, "Project name too long"),
    model: zod_1.z.string().min(1, "Model is required"),
    // .refine((val) => ["gpt-4", "gpt-3.5-turbo", "claude"].includes(val), {
    // 	message: "Invalid model specified",
    // }),
});
