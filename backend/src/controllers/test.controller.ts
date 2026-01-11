import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveTest = async (req: Request, res: Response) => {
  try {
    const { score, total, results } = req.body;

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (score === undefined || !results) {
      return res.status(400).json({ error: "Score and results are required" });
    }

    const totalQuestions = total || 10;
    const percentage = (score / totalQuestions) * 100;

    const testResult = await prisma.testResult.create({
      data: {
        userId: userId,
        score,
        total: totalQuestions,
        percentage,
        results: results,
      },
    });

    res.status(201).json(testResult);
  } catch (error) {
    console.error("Save test error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTestHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const testResults = await prisma.testResult.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(testResults);
  } catch (error) {
    console.error("Get test history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTestResult = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;

    const testResult = await prisma.testResult.findFirst({
      where: {
        id: parseInt(id),
        userId: userId,
      },
    });

    if (!testResult) {
      return res.status(404).json({ error: "Test result not found" });
    }

    res.json(testResult);
  } catch (error) {
    console.error("Get test result error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

