import { prisma } from "../infra/database/client.js";

export const getUsers = () => {
  return prisma.user.findMany();
};

export const getUser = (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const saveUser = (payload) => {
  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });
};

export const updateUser = (id, payload) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });
};

export const deleteUser = (id) => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};
