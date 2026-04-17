<template>
  <section class="bg-secondary">
    <div class="md:ml-5 flex flex-col gap-4 pt-15">
      <h3
        class="mx-auto ml-5 font-serif font-black text-[#D95F76] text-xl sm:text-3xl md:text-4xl lg:text-5xl"
      >
        我們的服務
      </h3>
      <p
        class="mx-auto ml-5 font-serif font-black text-primary text-xl sm:text-3xl md:text-4xl lg:text-5xl"
      >
        給你的指尖最細緻的呵護
      </p>
      <p class="mx-auto ml-5 mr-5">
        從經典基礎美甲到精緻客製設計， 我們選用高品質產品，結合專業技術，
        為你打造持久又美麗的指尖風格。
      </p>
    </div>
    <div class="mt-10 flex flex-col lg:flex-row justify-around">
      <ServiceCard v-for="service in randomServices" :key="service.id">
        <template #header>
          <span class="font-serif text-xl font-bold">
            {{ service.name }}
          </span>
        </template>

        <template #image>
          <RouterLink :to="service.path">
            <img
              :src="service.icon_url"
              alt="示意圖"
              class="w-full aspect-4/3 object-cover transition-all duration-1000 ease-out hover:scale-105"
            />
          </RouterLink>
        </template>
        {{ service.description }}
        <template #footer>
          <div class="flex justify-between items-center">
            <p class="font-serif text-sm">
              所需時間：約 {{ service.duration_minutes }} 分鐘
            </p>
          </div>
        </template>
      </ServiceCard>
    </div>
    <div class="flex justify-center mt-5 pb-5">
      <RouterLink
        to="/service-and-fee"
        class="text-primary hover:bg-[#D95F76] hover:text-white transition-bg duration-500 w-fit px-4 py-2 rounded-2xl"
        >所有服務項目
        <span class="material-symbols-outlined text-primary align-bottom">
          arrow_forward
        </span></RouterLink
      >
    </div>
  </section>
</template>
<script setup lang="ts">
import ServiceCard from "../../common/cards/ServiceCard.vue";
import { computed, onMounted, ref } from "vue";
import { getService, type ServiceCategory } from "../../../api/service";

const services = ref<ServiceCategory[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await getService();
    services.value = data;
  } finally {
    loading.value = false;
  }
});

const randomServices = computed(() => {
  return [...services.value].sort(() => Math.random() - 0.5).slice(0, 3);
});
</script>
