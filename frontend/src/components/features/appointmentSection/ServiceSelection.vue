<template>
  <section class="flex-col w-full items-start min-h-dvh md:min-h-fit">
    <div class="flex justify-center flex-wrap gap-2 mx-3 pt-10">
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
    <el-dialog
      append-to-body
      lock-scroll
      v-model="dialogVisible"
      width="70%"
      @close="!selectedService"
      teleported
    >
      <template v-if="selectedService">
        <div class="overflow-y-auto max-h-[50vh] pr-1">
          <h2>{{ selectedService.name }}</h2>
          <label
            v-for="price in prices"
            :key="price.label"
            class="flex items-center gap-2 cursor-pointer mb-2"
          >
            <input
              type="radio"
              :value="price"
              v-model="selectedItem"
              required
            />
            <span>{{ price.label }}：{{ price.price }} 元</span>
          </label>

          <p>選項：</p>
          <label
            v-for="option in options"
            :key="option.id"
            class="flex items-center gap-2 cursor-pointer mb-2"
          >
            <input
              type="checkbox"
              :checked="isSelected(option)"
              @change="toggleOption(option)"
            />
            <span>
              {{ option.service_addons.name }}
              {{
                option.service_addons.price == 0
                  ? ""
                  : `：${option.service_addons.price}元`
              }}
            </span>
            <div
              v-if="
                isSelected(option) &&
                option.service_addons.allow_quantity &&
                limits[option.service_addons.id]
              "
              class="flex items-center bg-gray-100 rounded-full px-2 py-1 ml-auto shadow-sm border border-gray-200"
            >
              <button
                type="button"
                @click.prevent="changeQuantity(option, -1)"
                class="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all shadow-sm"
              >
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>

              <span class="w-8 text-center font-bold text-gray-700 text-sm">
                {{ getQuantity(option) }}
              </span>

              <button
                type="button"
                @click.prevent="changeQuantity(option, +1)"
                class="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all shadow-sm"
              >
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </label>
        </div>
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
                @click="removeFromCart(index)"
              >
                delete
              </span>
            </div>
          </div>
          <span class="text-red-500 font-bold">${{ item.item.price }}</span>
        </div>

        <div
          v-if="item.addons && item.addons.length > 0"
          class="mt-3 pt-3 border-t border-dashed border-gray-100 space-y-2"
        >
          <div
            v-for="(addon, addonIndex) in item.addons"
            :key="addonIndex"
            class="flex justify-between items-center bg-gray-50 rounded-lg p-2"
          >
            <div class="flex items-center">
              <span
                class="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mr-2"
              ></span>
              <span class="text-sm text-gray-600">
                {{ addon.name }}
                <span class="text-xs text-gray-400" v-if="addon.quantity > 1">
                  (x{{ addon.quantity }})
                </span>
              </span>
            </div>
            <span class="text-sm text-gray-500 font-medium">
              +${{ addon.price || 0 }}
            </span>
          </div>
        </div>
      </div>
      <div>總金額：{{ totalAmount }}元</div>
      <div>所需時間：約{{ totalDuration }}分鐘</div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import DetailServiceCard from "../../common/cards/DetailServiceCard.vue";
import ServiceButton from "../../ui/ServiceButton.vue";
import { type Services } from "../../../api/service";
import { type ServiceAddonOption } from "../../../api/service";
import { type ServicePrice } from "../../../api/service";
import { useServiceCalculator } from "../../../composables/ServiceSection/useServiceCalculator";
import { useAppointmentCart } from "../../../composables/ServiceSection/useAppointmentCart";
import { useServiceData } from "../../../composables/ServiceSection/useServiceData";
import { ElMessage } from "element-plus";

const selectedService = ref<Services | null>(null);
const options = ref<ServiceAddonOption[] | null>([]);
const prices = ref<ServicePrice[] | null>([]);
const selectedOptions = ref<{ option: ServiceAddonOption; quantity: number }[]>(
  []
);
const dialogVisible = ref(false);
const selectedItem = ref<ServicePrice | null>(null);
const appointedList = ref<HTMLElement[]>([]);
const emit = defineEmits([
  "update-appointment",
  "update-duration",
  "update-amount",
]);

const { services, selectedCategory, onCategorySelected } = useServiceData();

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

const { childAppointmentList, addToCart, removeFromCart } =
  useAppointmentCart(emit);

const isSelected = (option: ServiceAddonOption) =>
  selectedOptions.value.some((o) => o.option.id === option.id);

const getQuantity = (option: ServiceAddonOption) =>
  selectedOptions.value.find((o) => o.option.id === option.id)?.quantity ?? 1;

const noAddonId = 24;
const fullExtensionId = 21;
const singleExtensionId = 22;
const jumpOneId = 3;
const jumpTwoId = 4;
const removeThisId = 8;
const removeElseId = 9;
const stampOneId = 11;
const stampTenId = 12;

const toggleOption = (option: ServiceAddonOption) => {
  const addonId = option.service_addons.id;

  if (isSelected(option)) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.id !== option.id
    );
    return;
  }

  // 勾選「不加購」→ 清空其他全部
  if (addonId === noAddonId) {
    selectedOptions.value = [{ option, quantity: 1 }];
    return;
  }

  // 勾選其他項目時，如果有「不加購」先移除
  selectedOptions.value = selectedOptions.value.filter(
    (o) => o.option.service_addons.id !== noAddonId
  );

  // 勾選「全手延甲」→ 移除「單指延甲」
  if (addonId === fullExtensionId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== singleExtensionId
    );
  }

  // 勾選「單指延甲」→ 移除「全手延甲」
  if (addonId === singleExtensionId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== fullExtensionId
    );
  }
  // 跳一色/兩色互斥
  if (addonId === jumpOneId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== jumpTwoId
    );
  }

  if (addonId === jumpTwoId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== jumpOneId
    );
  }
  // 卸甲本店/他店互斥
  if (addonId === removeThisId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== removeElseId
    );
  }

  if (addonId === removeElseId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== removeThisId
    );
  }
  // 鋼板單指/十指互斥
  if (addonId === stampOneId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== stampTenId
    );
  }

  if (addonId === stampTenId) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.service_addons.id !== stampOneId
    );
  }

  selectedOptions.value.push({ option, quantity: 1 });
};

const limits: Record<number, number> = {
  10: 10,
  11: 6,
  12: 10,
  13: 10,
  14: 10,
  15: 10,
  22: 6,
  23: 10,
};

const changeQuantity = (option: ServiceAddonOption, delta: number) => {
  const item = selectedOptions.value.find((o) => o.option.id === option.id);
  if (!item) return;

  const addonId = option.service_addons.id;
  const maxQuantity = limits[addonId] ?? 1;

  const newQuantity = item.quantity + delta;
  if (newQuantity <= 0) {
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.option.id !== option.id
    );
  } else if (newQuantity <= maxQuantity) {
    item.quantity = newQuantity;
  } else {
    ElMessage({
      showClose: true,
      message: "超過數量上限！",
      type: "warning",
      duration: 3000,
    });
  }
};

const select = async () => {
  if (!selectedItem.value || !selectedCategory.value) return;
  const addons = selectedOptions.value.map((o) => ({
    addon_id: o.option.addon_id!,
    name: o.option.service_addons.name,
    price: o.option.service_addons.price,
    duration_minutes: o.option.service_addons.duration_minutes,
    quantity: o.quantity,
  }));

  addToCart(selectedCategory.value, selectedItem.value, addons);
  selectedItem.value = null;
  selectedOptions.value = [];
  dialogVisible.value = false;
  await nextTick();
  const lastItem = appointedList.value[appointedList.value.length - 1];
  if (lastItem) {
    lastItem.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const { totalAmount, totalDuration } = useServiceCalculator(
  childAppointmentList,
  emit
);
</script>
