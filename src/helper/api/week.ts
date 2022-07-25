import { getAxiosInstance } from ".";

export const getWeekData = async(start:string ,end:string) =>{
  const api = getAxiosInstance()
  const {data} = await api.get(`/weeks?startDate=${start}&endDate=${end}`)
  return data;
}

export const executePublishWeek = async(payload:any)=>{
  const api = getAxiosInstance();
  const {data} = await api.post(`/weeks`,payload)
  return data;
} 