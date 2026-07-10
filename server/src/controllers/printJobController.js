import * as printJobService from "../services/printJob.js";

export const createPrintJob = async (req, res, next) => {
  try {
    const printJob = await printJobService.createPrintJob(req.body);
    res.status(201).json(printJob);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const printJobs = await printJobService.getAll(req.user.id);
    res.json(printJobs);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const printJob = await printJobService.getById(req.params.id);
    res.json(printJob);
  } catch (error) {
    next(error);
  }
};

export const updatePrintJob = async (req, res, next) => {
  try {
    const printJob = await printJobService.updatePrintJob(req.params.id, req.body);
    res.json(printJob);
  } catch (error) {
    next(error);
  }
};

export const deletePrintJob = async (req, res, next) => {
  try {
    await printJobService.deletePrintJob(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
