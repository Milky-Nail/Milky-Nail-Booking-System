<template>
  <section class="flex-col w-full items-start min-h-dvh md:min-h-fit">
    <div class="flex justify-center flex-wrap gap-2 mt-10 mx-3">
      <ServiceButton
        v-for="service in services"
        :key="service.id"
        :label="service.name"
        @click="onCategorySelected(service)"
      />
    </div>
    <Transition
      mode="out-in"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        :key="selectedCategory?.id"
        class="flex flex-row gap-4 justify-center flex-wrap w-full mt-10 min-w-0"
      >
        <DetailServiceCard
          v-for="service in selectedCategory?.services"
          :key="service.id"
          @button-click="chooseService(service)"
        >
          <template #header>
            <h3 class="text-xl font-bold">
              {{ service.name }}
            </h3>
          </template>

          <template #image>
            <img
              :src="service.image_url"
              class="w-full h-full object-cover rounded-3xl aspect-video"
            />
          </template>

          <template #price>
            <div v-if="service.id !== 8">
              金額： {{ service.service_prices[0]?.price }} 元
              <p
                v-if="service.id !== 6 && service.id !== 9"
                class="inline-block"
              >
                起
              </p>
            </div>
            <div v-if="service.id === 8">金額：依複雜程度單指報價</div>
          </template>

          <template #footer>
            <span class="text-sm"
              >所需時間：約 {{ service.duration_minutes }} 分鐘</span
            >
          </template>
          <template #button>
            <span>預約服務</span>
          </template>
        </DetailServiceCard>
      </div>
    </Transition>
    <el-dialog v-model="dialogVisible" @close="!selectedService">
      <template v-if="selectedService">
        <h2>{{ selectedService.name }}</h2>
        <label
          v-for="price in prices"
          :key="price.label"
          class="flex items-center gap-2 cursor-pointer mb-2"
        >
          <input type="radio" :value="price" v-model="selectedItem" required />
          <span>{{ price.label }}：{{ price.price }} 元</span>
        </label>

        <p>選項：</p>
        <label
          v-for="option in options"
          :key="option.id"
          class="flex items-center gap-2 cursor-pointer mb-2"
        >
          <input type="radio" :value="option" v-model="selectedOption" />
          <div>
            {{ option.service_addons.name
            }}{{
              option.service_addons.price == 0
                ? ""
                : `：${option.service_addons.price}元`
            }}
          </div>
        </label>
      </template>
      <div class="flex">
        <ServiceButton
          class="mt-4 w-full"
          @click="cancel"
          label="取消"
        ></ServiceButton>
        <ServiceButton
          class="mt-4 w-full"
          @click="select"
          label="確定"
        ></ServiceButton>
      </div>
    </el-dialog>
    <div class="space-y-4 p-2 bg-gray-200" v-if="childAppointmentList[0]">
      <div class="flex items-center justify-between border-b pb-2 mb-4">
        <h3 class="text-lg font-bold text-gray-700">已選預約項目</h3>
        <span
          class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium"
        >
          共 {{ childAppointmentList.length }} 項
        </span>
      </div>

      <div
        v-for="(item, index) in childAppointmentList"
        :key="index"
        class="relative group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 scroll-mt-40"
        ref="appointedList"
      >
        <div
          class="absolute -left-2 -top-2 w-6 h-6 bg-gray-800 text-white text-[10px] flex items-center justify-center rounded-full shadow-lg"
        >
          {{ index + 1 }}
        </div>

        <div class="flex justify-between items-start mb-2">
          <div class="flex flex-col">
            <span
              class="text-sm text-gray-400 font-medium tracking-wider uppercase"
              >{{ item.categoryName }}</span
            >
            <div class="flex">
              <span class="font-bold text-gray-800">{{ item.item.label }}</span>
              <span
                class="material-symbols-outlined hover:cursor-pointer"
                @click="removeFromList(index)"
              >
                delete
              </span>
            </div>
          </div>
          <span class="text-red-500 font-bold">${{ item.item.price }}</span>
        </div>

        <div
          v-if="item.addon"
          class="mt-3 pt-3 border-t border-dashed border-gray-100"
        >
          <div
            class="flex justify-between items-center bg-gray-50 rounded-lg p-2"
          >
            <div class="flex items-center">
              <span
                class="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mr-2"
              ></span>
              <span class="text-sm text-gray-600">{{ item.addon.name }}</span>
            </div>
            <span class="text-sm text-gray-500 font-medium"
              >+${{ item.addon.price || 0 }}</span
            >
          </div>
        </div>
      </div>
      <div>總金額：{{ totalAmount }}元</div>
      <div>所需時間：約{{ totalDuration }}分鐘</div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { getService, type ServiceCategory } from "../../../api/service";
import DetailServiceCard from "../../common/cards/DetailServiceCard.vue";
import ServiceButton from "../../ui/ServiceButton.vue";
import { type Services } from "../../../api/service";
import { type ServiceAddonOption } from "../../../api/service";
import { type ServicePrice } from "../../../api/service";
import { type Select } from "../../../api/service";

const services = ref<ServiceCategory[]>([]);
const loading = ref(true);
const selectedService = ref<Services | null>(null);
const selectedCategory = ref<ServiceCategory | null>(null);
const options = ref<ServiceAddonOption[] | null>([]);
const prices = ref<ServicePrice[] | null>([]);
const selectedOption = ref<ServiceAddonOption | null>(null);
const dialogVisible = ref(false);
const selectedItem = ref<ServicePrice | null>(null);
const childAppointmentList = ref<Select[]>([]);
const appointedList = ref<HTMLElement[]>([]);
const emit = defineEmits([
  "update-appointment",
  "update-duration",
  "update-amount",
]);

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

const chooseService = async (service: Services) => {
  selectedService.value = service;
  options.value =
    service.service_addon_options_service_addon_options_requires_service_idToservices;
  prices.value = service.service_prices;
  selectedItem.value = prices.value?.[0] ?? null;
  dialogVisible.value = true;
};
const cancel = () => {
  dialogVisible.value = false;
};
const select = async () => {
  if (!selectedItem.value || !selectedCategory.value) return;
  const newSelection: Select = {
    categoryName: selectedCategory.value.name,
    categoryTime: selectedCategory.value.duration_minutes,
    category: selectedCategory.value,
    item: selectedItem.value,
    addon: selectedOption.value?.service_addons ?? null,
  };
  childAppointmentList.value.push(newSelection);
  selectedItem.value = null;
  selectedOption.value = null;
  dialogVisible.value = false;
  await nextTick();
  if (Array.isArray(appointedList.value) && appointedList.value.length > 0) {
    const lastIndex = appointedList.value.length - 1;
    const lastItem = appointedList.value[lastIndex];
    if (lastItem) {
      lastItem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  emit("update-appointment", childAppointmentList.value);
};

const removeFromList = (index: number) => {
  childAppointmentList.value.splice(index, 1);
  emit("update-appointment", childAppointmentList.value);
};

const totalAmount = computed(() => {
  return childAppointmentList.value.reduce((sum, cur) => {
    const itemPrice = cur.item.price || 0;
    const addonPrice = cur.addon?.price || 0;
    return sum + itemPrice + addonPrice;
  }, 0);
});

const totalDuration = computed(() => {
  const actualSum = childAppointmentList.value.reduce((sum, cur) => {
    const itemDuration = cur.categoryTime || 0;
    const addonDuration = cur.addon?.duration_minutes || 0;
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
</script>
