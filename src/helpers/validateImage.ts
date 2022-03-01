//FUNCION PARA EVITAR QUE UNA IMAGEN PESE MAS DE 10 MB
export const validateImage = (file: any) => {
  if (file.size / 1048576 < 10) return 0;
  else return 1;
};
