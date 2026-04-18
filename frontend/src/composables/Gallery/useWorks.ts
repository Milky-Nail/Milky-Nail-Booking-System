import { ref } from "vue";
import { getWorks, type WorkData, type WorkResponse } from "../../api/gallery";

export const useWorks = () => {
  const workList = ref<WorkResponse | null>(null);
  const selectedTag = ref<string | undefined>(undefined);
  const selectedPrice = ref<number | undefined>(undefined);
  const selectedPage = ref<number | undefined>(undefined);
  const selsetdlimit = ref<number | undefined>(undefined);

  const fetchWorks = async (isFiltered: boolean) => {
    const res = await getWorks({
      tag: selectedTag.value,
      price: selectedPrice.value,
      pagination: {
        page: selectedPage.value,
        limit: selsetdlimit.value,
      },
    });
    if (isFiltered) {
      const filterData = res.data.filter(
        (work: WorkData) => work.is_showed === true
      );
      workList.value = { ...res, data: filterData };
    } else {
      workList.value = res;
    }
    return res;
  };

  return {
    workList,
    selectedTag,
    selectedPrice,
    fetchWorks,
  };
};
