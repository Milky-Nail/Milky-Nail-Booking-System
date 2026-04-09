import { type Ref, computed, watch } from "vue";
import { type Select } from "../../api/service";

interface ServiceCalculatorEvents {
  (event: "update-duration", duration: number): void;
  (event: "update-amount", amount: number): void;
}

export function useServiceCalculator(
  childAppointmentList: Ref<Select[]>,
  emit: ServiceCalculatorEvents
) {
  const totalAmount = computed(() => {
    return childAppointmentList.value.reduce((sum, cur) => {
      const itemPrice = cur.item.price || 0;
      const addonPrice =
        cur.addons?.reduce((a, b) => a + b.price * b.quantity, 0) || 0;
      return sum + itemPrice + addonPrice;
    }, 0);
  });

  const totalDuration = computed(() => {
    const actualSum = childAppointmentList.value.reduce((sum, cur) => {
      const itemDuration = cur.categoryTime || 0;
      const addonDuration =
        cur.addons?.reduce((a, b) => a + b.duration_minutes, 0) || 0;
      return sum + itemDuration + addonDuration < 300
        ? sum + itemDuration + addonDuration
        : 300;
    }, 0);
    return Math.min(actualSum, 300);
  });
  watch(
    totalDuration,
    (newVal) => {
      emit("update-duration", newVal);
    },
    { immediate: true }
  );
  watch(
    totalAmount,
    (newVal) => {
      emit("update-amount", newVal);
    },
    { immediate: true }
  );
  return { totalAmount, totalDuration };
}
