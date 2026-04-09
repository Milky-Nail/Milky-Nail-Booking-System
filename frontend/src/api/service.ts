import apiClient from "./client";

export interface ServicePrice {
  id: number;
  service_id: number;
  label: string;
  price: number;
}

export interface ServiceAddon {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
  allow_quantity: boolean;
}

export interface ServiceAddonOption {
  id: number;
  service_id: number;
  addon_id: number;
  requires_service_id: number;
  service_addons: ServiceAddon;
}

export interface Services {
  id: number;
  category_id: number;
  name: string;
  duration_minutes: number;
  requires_quote: Boolean;
  image_url: string;
  service_prices: ServicePrice[];
  service_addon_options_service_addon_options_requires_service_idToservices: ServiceAddonOption[];
}

export interface ServiceCategory {
  id: number;
  name: string;
  icon_url: string;
  duration_minutes: number;
  description: string;
  path: string;
  services: Services[];
}

export interface SelectedAddon {
  addon_id: number;
  name: string;
  price: number;
  duration_minutes: number;
  quantity: number;
}

export interface Select {
  categoryName: string;
  categoryTime: number;
  category: ServiceCategory;
  item: ServicePrice;
  requires_quote: Boolean;
  addons: SelectedAddon[];
}

const getService = (): Promise<ServiceCategory[]> => apiClient.get("/services");

export { getService };
