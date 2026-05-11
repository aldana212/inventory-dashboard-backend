import * as repo from "./dashboard.repository.js";

export const getSummary = async (companyId) => {
  return await repo.getSummary(companyId);
};

export const getMovementsBar = async (companyId) => {
  const response = await repo.getMovementsBar(companyId);

  const namesWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const formatted = response.map((r) => ({
    dia: namesWeek[r.dia_semana],
    input: r.entradas,
    output: r.salidas,
  }));

  return formatted;
};

export const getPopularCategories = async (companyId) => {
  const response = await repo.getPopularCategories(companyId);
  const total = response.reduce((acc, item) => acc + Number(item.total), 0);

  let data = response.map((item) => {
    const value = Number(item.total);

    return {
      name: item.name,
      value,
      percent: total > 0 ? Math.round((value / total) * 100) : 0,
    };
  });

  // top 3 + otros
  const top = data.slice(0, 3);
  const others = data.slice(3);

  if (others.length > 0) {
    const othersValue = others.reduce((acc, item) => acc + item.value, 0);

    top.push({
      name: "Otros",
      value: othersValue,
      percent: Math.round((othersValue / total) * 100),
    });
  }

  return {
    total,
    data: top,
  };

};
