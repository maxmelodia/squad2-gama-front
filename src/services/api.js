import axios from "axios";

function getTokenLocalStorage(){
  const s = localStorage.getItem('tokenUser') ? JSON.parse(localStorage.getItem('tokenUser')) : { username: 'O' };
  return s.token;
}

const api = function () {
 const token = getTokenLocalStorage();
  const req = axios.create({
    baseURL: `http://api.squad2.tech:3000/api/v1/public/`,
    //baseURL: `http://localhost:3000/api/v1/public`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseSuccessHandler = (response) => {
    return response;
  };

  const responseErrorHandler = (error) => {
    if (error) {
      if (error.response.status === 401) {
        console.log(
          "Erro 401: Não autorizado. Redirect Página de login, ou renovar token automaticamente"
        );
      }
      return Promise.reject(error);
    }
  };

  req.interceptors.response.use(
    (response) => responseSuccessHandler(response),
    (error) => responseErrorHandler(error)
  );

  return req;
};

export default api;
