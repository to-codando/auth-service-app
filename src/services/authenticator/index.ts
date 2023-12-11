type LoginData = {
  password: string;
  username: string;
};

type Payload = {
  data: LoginData;
  success: <T = void, U = void>(data: T) => U;
  error: <T = void, U = void>(data: T) => U;
};

export const authenticatorFactory = () => {
  const autheticate = async (data: Payload) => {
    console.log(data);
  };

  return {
    authenticate,
  };
};
