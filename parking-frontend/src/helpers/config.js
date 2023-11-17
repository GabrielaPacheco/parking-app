//Funcion que envia el header que ocuparemos
export const getConfig = (token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  };
  return config;
};
