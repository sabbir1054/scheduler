import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const signUp = async (body: any) => {
  const result = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: body.password,
    },
    select: {
      email: true,
      name: true,
    },
  });
  if (!result) throw new ApiError(401, 'Fail to signup');

  return result;
};

export const AuthServices = {
  signUp,
};
