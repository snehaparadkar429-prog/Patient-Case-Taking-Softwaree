import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

const patientSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  dateOfBirth: z.string().datetime(),
  sex: z.enum(["Female", "Male", "Other", "Prefer not to say"]),
  phone: z.string().trim().min(7).max(20)
});

const caseSchema = z.object({
  visitDate: z.string().datetime(),
  chiefComplaint: z.string().trim().min(2).max(2000),
  history: z.string().max(5000).default(""),
  observations: z.string().max(5000).default(""),
  assessment: z.string().max(5000).default(""),
  plan: z.string().max(5000).default("")
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/patients", async (_req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
    res.json(patients);
  } catch (error) { next(error); }
});

app.post("/api/patients", async (req, res, next) => {
  try {
    const parsed = patientSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const patient = await prisma.patient.create({
      data: { ...parsed.data, dateOfBirth: new Date(parsed.data.dateOfBirth) }
    });
    res.status(201).json(patient);
  } catch (error) { next(error); }
});

app.get("/api/patients/:id/cases", async (req, res, next) => {
  try {
    const cases = await prisma.caseNote.findMany({
      where: { patientId: req.params.id },
      orderBy: { visitDate: "desc" }
    });
    res.json(cases);
  } catch (error) { next(error); }
});

app.post("/api/patients/:id/cases", async (req, res, next) => {
  try {
    const parsed = caseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const note = await prisma.caseNote.create({
      data: { ...parsed.data, patientId: patient.id, visitDate: new Date(parsed.data.visitDate) }
    });
    res.status(201).json(note);
  } catch (error) { next(error); }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "An unexpected server error occurred" });
});

app.listen(port, () => console.log(`API listening at http://localhost:${port}`));
