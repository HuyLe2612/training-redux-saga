import axiosService from "./../commons/axiosService";
import { API_ENDPOINT } from "./../constants";
import qs from "query-string";
// http://
const url = "tasks";

export const getList = (params = {}) => {
  let  queryParams = '';
  if (Object.keys(params).length > 0) {
    queryParams = `?${qs.stringify(params)}`;
  }
  return axiosService.get(`${API_ENDPOINT}/${url}${queryParams}`);
};
// http://localhost
export const addTask = data => {
  return axiosService.post(`${API_ENDPOINT}/${url}`, data);
};

// http://localhost:3000/tasks/:id METHOD: PUT
export const updateTask = (data, taskId) => {
  return axiosService.put(`${API_ENDPOINT}/${url}/${taskId}`, data);
};


// http://localhost:3000/tasks/:id METHOD: DELETE
export const deleteTask = taskId => {
  return axiosService.delete(`${API_ENDPOINT}/${url}/${taskId}`);
};
