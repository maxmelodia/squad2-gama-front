import axios from "axios";

function getTokenLocalStorage(){
  const s = localStorage.getItem('squad2UserToken') ? JSON.parse(localStorage.getItem('squad2UserToken')) : { username: 'O' };
  return s;
}

const api = function () {
 const token = getTokenLocalStorage(); 
  const req = axios.create({
    //baseURL: `http://localhost:3000/api/v1/public`,
    baseURL: `https://qje8wp1oc0.execute-api.us-east-1.amazonaws.com/Dev`,
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
