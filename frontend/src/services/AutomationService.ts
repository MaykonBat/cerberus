import {Automation} from "commons";
import axios from "./BaseService";
import ConfigService from "./ConfigService";

const BACKEND_URL = `${ConfigService.BACKEND_URL}/automations`;

export async function getAutomation(id: string): Promise<Automation> {
  const response = await axios.get(`${BACKEND_URL}/${id}`);
  return response.data as Automation;
}

export async function getAutomations(page: number = 1, pageSize: number = 10): Promise<Automation[]> {
  const response = await axios.get(`${BACKEND_URL}/?page=${page}&pageSize=${pageSize}`);
  return response.data as Automation[];
}

export async function getActiveAutomations(): Promise<Automation[]> {
  const response = await axios.get(`${BACKEND_URL}/active`);
  return response.data as Automation[];
}

export async function addAutomation(automation: Automation): Promise<Automation> {
  const response = await axios.post(`${BACKEND_URL}/`, automation);
  return response.data as Automation;
}

export async function startAutomation(id: string): Promise<Automation> {
  const response = await axios.post(`${BACKEND_URL}/${id}/start`);
  return response.data as Automation;
}

export async function stopAutomation(id: string): Promise<Automation> {
  const response = await axios.post(`${BACKEND_URL}/${id}/stop`);
  return response.data as Automation;
}

export async function updateAutomation(id: string, automation: Automation): Promise<Automation> {
  const response = await axios.patch(`${BACKEND_URL}/${id}`, automation);
  return response.data as Automation;
}

export async function deleteAutomation(id: string): Promise<Automation> {
  const response = await axios.delete(`${BACKEND_URL}/${id}`);
  return response.data as Automation;
}