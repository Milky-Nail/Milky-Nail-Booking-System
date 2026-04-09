import { ref, type Ref } from "vue";
import {
  type Select,
  type ServicePrice,
  type ServiceAddonOption,
  type ServiceCategory,
  type SelectedAddon,
} from "../../api/service";

interface AppointmentCartEvents {
  (event: "update-appointment", list: Select[]): void;
}

export function useAppointmentCart(emit: AppointmentCartEvents) {
  const childAppointmentList = ref<Select[]>([]);

  const addToCart = (
    category: ServiceCategory,
    item: ServicePrice,
    addons: SelectedAddon[]
  ) => {
    const newSelection: Select = {
      categoryName: category.name,
      categoryTime: category.duration_minutes,
      category: category,
      item,
      addons,
    };

    childAppointmentList.value.push(newSelection);
    emit("update-appointment", [...childAppointmentList.value]);

    return newSelection;
  };

  const removeFromCart = (index: number) => {
    childAppointmentList.value.splice(index, 1);
    emit("update-appointment", [...childAppointmentList.value]);
  };

  return {
    childAppointmentList: childAppointmentList as Ref<Select[]>,
    addToCart,
    removeFromCart,
  };
}
