const ReturnSuccessResponse = (message: string, data?: any) => {
  return {
    success: true,
  
    message,
    data: data ?? null,
  };
};

const ReturnErrorResponse = (message: string, error?: any) => {
  return {
    success: false,
   
    message,
    error: error ?? null,
  };
};

export const utilitys = {
  ReturnSuccessResponse,
  ReturnErrorResponse,
};
