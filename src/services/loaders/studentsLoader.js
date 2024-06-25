import { getStudents } from "../apiServices";
import axios from "axios";
import { URL } from "../../constants";

/**
 * Loads students data from the server.
 * @param {Object} options - The options for the students loader.
 * @param {Object} options.axiosInstance - The axios instance to use for making HTTP requests. Defaults to axios.
 * @param {Object} options.storage - The storage object to use for retrieving the token. Defaults to localStorage.
 * @returns {Array} - An array of student data.
 */
export async function studentsLoader({
  axiosInstance = axios,
  storage = localStorage,
}) {
  const token = storage.getItem("token");
  if (!token) {
    return [];
  }
  try {
    const response = await axiosInstance.post(
      `${URL}/auth/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { status } = response.data;
    if (status) {
      return getStudents();
    }
  } catch (error) {
    console.error("Error verifying token:", error);
  }
  return [];
}
