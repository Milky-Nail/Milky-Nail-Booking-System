import { ref, onMounted } from "vue";
import { getService, type ServiceCategory } from "../../api/service";

export function useServiceData() {
  const services = ref<ServiceCategory[]>([]);
  const loading = ref(true);
  const selectedCategory = ref<ServiceCategory | null>(null);

  onMounted(async () => {
    try {
      const data = await getService();
      services.value = data;

      selectedCategory.value = data[0] ?? null;
    } finally {
      loading.value = false;
    }
  });

  const onCategorySelected = (category: ServiceCategory) => {
    selectedCategory.value = category;
  };

  return {
    services,
    loading,
    selectedCategory,
    onCategorySelected,
  };
}
