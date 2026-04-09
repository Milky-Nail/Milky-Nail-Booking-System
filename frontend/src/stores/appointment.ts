import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { type Select } from "../api/service";
import { type Staff } from "../api/staff";
import { type TimeSlot } from "../api/schedule";
import {
  getAppointmentByUser,
  type UserAppointmentList,
} from "../api/appointment";

export const useAppointmentStore = defineStore(
  "appointment",
  () => {
    const parentAppointmentList = ref<Select[]>([]);
    const parentStylist = ref<Staff | null>(null);
    const parentTime = ref<TimeSlot | null>(null);
    const userAppointments = ref<UserAppointmentList[]>([]);
    const isLoading = ref(false);

    const parenTotalAmount = computed(() => {
      return parentAppointmentList.value.reduce((acc, cur) => {
        const itemPrice = cur.item?.price || 0;
        const addonsPrice =
          cur.addons?.reduce((a, b) => a + b.price * b.quantity, 0) || 0;
        return acc + itemPrice + addonsPrice;
      }, 0);
    });

    const parentTotalTime = computed(() => {
      return parentAppointmentList.value.reduce((acc, cur) => {
        const itemTime = cur.categoryTime || 0;
        const addonsTime =
          cur.addons?.reduce((a, b) => a + b.duration_minutes, 0) || 0;
        return acc + itemTime + addonsTime;
      }, 0);
    });

    const clearAll = () => {
      parentAppointmentList.value = [];
      parentStylist.value = null;
      parentTime.value = null;
    };
    const fetchUserAppointments = async (userId: string | number) => {
      isLoading.value = true;
      try {
        userAppointments.value = await getAppointmentByUser(userId);
      } finally {
        isLoading.value = false;
      }
    };
    return {
      parentAppointmentList,
      parentStylist,
      parentTime,
      parentTotalTime,
      parenTotalAmount,
      fetchUserAppointments,
      userAppointments,
      isLoading,
      clearAll,
    };
  },
  {
    persist: false,
  }
);
