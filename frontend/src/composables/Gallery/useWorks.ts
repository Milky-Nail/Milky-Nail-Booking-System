import { ref } from "vue";
import { getWorks, type WorkData, type WorkResponse } from "../../api/gallery";

export const useWorks = () => {
  const workList = ref<WorkResponse | null>(null);
  const selectedTag = ref<string | undefined>(undefined);
  const selectedPrice = ref<number | undefined>(undefined);
  const selectedPage = ref<number | undefined>(undefined);
  const selsetdlimit = ref<number | undefined>(undefined);

  const fetchWorks = async () => {
    const res = await getWorks({
      tag: selectedTag.value,
      price: selectedPrice.value,
      pagination: {
        page: selectedPage.value,
        limit: selsetdlimit.value,
      },
    });

    const filterData = res.data.filter(
      (work: WorkData) => work.is_showed === true
    );
    workList.value = { ...res, data: filterData };
    return res;
  };

  return {
    workList,
    selectedTag,
    selectedPrice,
    fetchWorks,
  };
};
