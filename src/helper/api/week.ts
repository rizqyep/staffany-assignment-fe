import { getAxiosInstance } from ".";

export const getWeekData = async(start:string ,end:string) =>{
  const api = getAxiosInstance()
  const {data} = await api.get(`/weeks?startDate=${start}&endDate=${end}`)
  return data;
}