import * as service from "./auth.service.js";

export const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const data = await service.login({
      email,
      password,
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const completePasswordSetup = async (req, res, next) => {
  try {
    const id = req?.user?.id;
    const { currentPassword, newPassword } = req.body;
    const data = await service.completePasswordSetup({
      id,
      currentPassword,
      newPassword,
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const id = req?.user?.id;
    const { currentPassword, newPassword } = req.body;
    const data = await service.changePassword({
      id,
      currentPassword,
      newPassword,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
