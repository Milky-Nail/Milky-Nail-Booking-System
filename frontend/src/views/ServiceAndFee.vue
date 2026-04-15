<template>
  <div>
    <Teleport to="body">
      <!-- Teleport用來將子元素送入目標DOM位置，解決彈窗、下拉選單、側邊nav被父層css影響的問題 -->
      <nav
        class="fixed right-6 top-1/2 -translate-y-1/2 z-999 flex-col gap-3 hidden md:flex"
      >
        <div
          v-for="(_category, index) in categoryList"
          :key="index"
          class="w-2 h-2 rounded-full cursor-pointer transition-all duration-300"
          :class="
            activeIndex === index ? 'bg-primary scale-150' : 'bg-secondary/20'
          "
          @click="scrollToSection(index)"
        ></div>
      </nav>
    </Teleport>
    <div
      class="bg-primary font-sans text-secondary min-h-screen overflow-x-hidden"
    >
      <div
        class="fixed left-0 right-0 z-50 flex justify-between items-center px-8 md:px-10 py-5"
        style="
          background: linear-gradient(
            to bottom,
            rgba(42, 13, 22, 0.78) 0%,
            transparent 100%
          );
        "
      >
        <span class="font-serif text-secondary tracking-[.2em] text-sm"
          >Milky Nail 美甲工作室服務價目表</span
        >
        <span class="text-xs tracking-[.25em] text-third/50 uppercase"
          >Price List 2026</span
        >
      </div>

      <section
        v-for="(category, index) in categoryList"
        :key="category.id"
        :ref="(el) => { if (el) sectionRefs[index] = el as HTMLElement }"
        class="relative overflow-hidden flex items-center min-h-screen"
      >
        <div
          class="bg-el absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
          :style="{ backgroundImage: `url(${category.icon_url})` }"
        ></div>

        <div
          class="absolute inset-0"
          :class="
            index % 2 === 1
              ? 'bg-linear-to-tl from-[#2a0d16]/90 via-primary/10 to-black/5'
              : 'bg-linear-to-tr from-[#2a0d16]/92 via-primary/10 to-black/5'
          "
        ></div>

        <div
          class="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-28 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
        >
          <div
            class="info-panel flex flex-col gap-5"
            :class="
              index % 2 === 1
                ? 'order-1 md:order-2 text-right md:text-left'
                : 'order-1'
            "
          >
            <div>
              <div
                class="flex items-center gap-3 mb-2"
                :class="index % 2 === 1 ? 'flex-row-reverse md:flex-row' : ''"
              >
                <span
                  class="font-serif text-xs tracking-[.2em] text-primary border border-primary px-2 py-0.5"
                >
                  {{ String(index + 1).padStart(2, "0") }}
                </span>
                <div
                  class="flex-1 h-px bg-linear-to-r from-primary/40 to-transparent"
                ></div>
              </div>
              <p class="text-xs tracking-[.16em] text-third uppercase mb-1">
                {{ enMap[category.name] }}
              </p>
              <h2
                class="font-serif text-4xl md:text-5xl font-bold leading-tight tracking-wide text-secondary"
              >
                {{ category.name }}
              </h2>
            </div>
            <p
              class="text-xs leading-relaxed text-secondary max-w-62.5"
              :class="index % 2 === 1 ? 'ml-auto md:ml-0' : ''"
            >
              專業美甲師一對一服務，依個人需求量身打造最適合的美甲方案。
            </p>
          </div>

          <div
            class="price-panel bg-[#2a0d16]/60 backdrop-blur-xl border border-third/20 p-6 md:p-7"
            :class="index % 2 === 1 ? 'order-2 md:order-1' : 'order-2'"
          >
            <p
              class="text-md tracking-[.3em] text-primary uppercase pb-3 mb-2 border-b border-third/20"
            >
              服務項目 & 費用
            </p>
            <div class="overflow-y-auto pr-1 max-h-[60vh] custom-scrollbar">
              <div
                v-for="(service, index) in category.services"
                :key="service.id"
              >
                <p
                  v-if="category.services.length > 1"
                  class="text-sm text-primary uppercase mb-2"
                  :class="index > 0 ? 'mt-5 pt-4 border-t border-third/12' : ''"
                >
                  {{ service.name }}
                </p>

                <div
                  v-for="item in service.service_prices"
                  :key="item.service_id"
                >
                  <div
                    class="service-row flex justify-between items-baseline py-2 gap-3"
                  >
                    <p class="text-xs leading-snug">
                      {{ item.label }}
                    </p>
                    <p
                      class="font-serif text-third text-[.92rem] whitespace-nowrap shrink-0"
                    >
                      {{
                        item.price === 0
                          ? "—"
                          : "$" + item.price.toLocaleString()
                      }}
                    </p>
                  </div>
                  <div class="h-px bg-third/15"></div>
                </div>

                <div
                  v-if="hasAddons(service)"
                  class="mt-4 pt-3 border-t border-primary/20"
                >
                  <p class="text-xs text-primary uppercase mb-2.5">加購服務</p>
                  <div class="flex flex-wrap gap-1.5">
                    <template
                      v-for="addon in service.service_addon_options_service_addon_options_requires_service_idToservices"
                    >
                      <span
                        v-if="addon.service_addons.price > 0"
                        class="addon-tag text-[.68rem] px-2.5 py-1 bg-primary/10 border border-primary/20 text-third leading-none"
                      >
                        {{ addon.service_addons.name }}&nbsp;<span
                          class="text-secondary/40"
                          >+${{
                            addon.service_addons.price.toLocaleString()
                          }}</span
                        >
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  getService,
  type ServiceCategory,
  type Services,
} from "../api/service";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const categoryList = ref<ServiceCategory[]>([]);
const sectionRefs = ref<HTMLElement[]>([]);
const activeIndex = ref(0);

gsap.registerPlugin(ScrollTrigger);

const enMap: Record<string, string> = {
  保養服務: "Care & Treatment",
  足部凝膠: "Foot Gel",
  手部凝膠: "Hand Gel",
  款式設計: "Style Design",
  卸甲服務: "Removal Service",
  傳圖報價: "Custom Quote",
};

const initAnimations = () => {
  const validSections = sectionRefs.value.filter((el) => el !== null);

  if (validSections.length === 0) return;

  ScrollTrigger.getAll().forEach((t) => t.kill());

  validSections.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive) {
          activeIndex.value = i;
        }
      },
    });

    const info = sec.querySelector(".info-panel");
    const card = sec.querySelector(".price-panel");
    const bg = sec.querySelector(".bg-el");
    const isEvenIndex = i % 2 === 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top 72%",
          toggleActions: "play reverse play reverse",
        },
      })
      .fromTo(
        info,
        { x: isEvenIndex ? 80 : -80, opacity: 0, y: isEvenIndex ? 80 : -80 },
        { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(
        card,
        { x: isEvenIndex ? -80 : 80, opacity: 0, y: isEvenIndex ? 80 : -80 },
        { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );

    if (bg) {
      gsap.fromTo(
        bg,
        { yPercent: 0 },
        {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    const rows = Array.from(sec.querySelectorAll(".service-row"));
    const tags = Array.from(sec.querySelectorAll(".addon-tag"));
    const tl = gsap.timeline({
      trigger: sec,
      start: "top 75%",
      toggleActions: "play reverse play reverse",
    });

    if (rows.length > 0) {
      tl.fromTo(
        rows,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1 }
      );
    }

    if (tags.length > 0) {
      tl.fromTo(
        tags,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05 },
        "-=0.3"
      );
    }
  });

  ScrollTrigger.refresh();
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
};

const hasAddons = (service: Services) =>
  service.service_addon_options_service_addon_options_requires_service_idToservices.some(
    (addon) => addon.service_addons.price > 0
  );

const scrollToSection = (index: number) => {
  if (sectionRefs.value[index]) {
    sectionRefs.value[index].scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(async () => {
  const res = await getService();
  categoryList.value = res;

  await nextTick(); //確認DOM就緒

  const images = document.querySelectorAll("img");
  if (images.length > 0) {
    const promises = Array.from(images).map((img) => {
      img.complete
        ? Promise.resolve() // 如果圖片已經快取好了，直接通過
        : new Promise((resolve) => (img.onload = resolve)); // 否則，等它下載完觸發 onload
    });
    await Promise.all(promises); // 等到「所有」圖片都下載完成
  }

  initAnimations();
  ScrollTrigger.refresh();
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
@keyframes dropDown {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleY(0.5);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(232, 48, 110, 0.35);
  border-radius: 2px;
}
</style>
