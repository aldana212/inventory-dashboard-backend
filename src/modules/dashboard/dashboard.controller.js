import * as services from './dashboard.service.js'


export const getSummary = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;

    const data = await services.getSummary(companyId);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
 
export const getMovementsBar = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;

    const data = await services.getMovementsBar(companyId);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getPopularCategories = async (req, res, next) => {
  try {
    const companyId = req?.user?.companyId;

    const data = await services.getPopularCategories(companyId);
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};