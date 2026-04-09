<template>
  <section class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="text-2xl font-bold font-serif">會員列表</div>

      <div class="flex items-center gap-2">
        <el-input
          v-model="searchQuery"
          placeholder="搜尋會員姓名、email、電話..."
          clearable
          class="w-64!"
        >
          <template #prefix>
            <span class="material-symbols-outlined text-gray-400">search</span>
          </template>
        </el-input>

        <el-button @click="clearQuery" circle>
          <span class="material-symbols-outlined text-base">refresh</span>
        </el-button>
      </div>
    </div>
  </section>
  <section>
    <div class="font-serif text-2xl font-bold">
      <el-table :data="userList">
        <el-table-column label="會員 ID" prop="id" sortable />
        <el-table-column label="會員姓名" prop="name" sortable />
        <el-table-column label="電子郵件" prop="email" sortable />
        <el-table-column label="電話" prop="phone" sortable />
        <el-table-column label="會員權限" sortable :sort-method="sortByRole">
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span
                class="material-symbols-outlined text-base"
                :class="rolesMap[row.role]?.color"
                >{{ rolesMap[row.role]?.icon }}
              </span>
              <el-select
                :id="'role-select-' + row.id"
                v-model="row.role"
                placeholder="請選擇身分"
                size="small"
                @change="(newRole:string) => handleRoleChange(row.id, newRole)"
                :class="rolesMap[row.role]?.color"
              >
                <el-option
                  v-for="(config, key) in rolesMap"
                  :key="key"
                  :label="config.label"
                  :value="key"
                >
                  <span
                    class="material-symbols-outlined align-middle"
                    :class="config.color"
                    >{{ config.icon }}
                  </span>
                  <span :class="config.color">{{ config.label }}</span>
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="停用狀態" sortable>
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span
                class="material-symbols-outlined text-base"
                :class="statusMap[String(row.is_blocked)]?.color"
              >
                {{ statusMap[String(row.is_blocked)]?.icon }}
              </span>
              <!-- :id="'block-select-' + row.id"讓每個下拉選單在 DOM 中都有唯一的識別碼 -->
              <!-- 加上aria-label直接告訴瀏覽器這個選擇器的用途 -->
              <!-- boolean包String()字串化，卻保有抓到正確的值 -->
              <el-select
                :id="'block-select-' + row.id"
                v-model="row.is_blocked"
                size="small"
                placeholder="選擇狀態"
                aria-label="更改帳號停用狀態"
                @change="(newStatus: boolean) => handleStatusChange(row.id, newStatus)"
                :class="statusMap[String(row.is_blocked)]?.color"
              >
                <el-option
                  v-for="(config, key) in statusMap"
                  :key="key"
                  :label="config.label"
                  :value="key === 'true'"
                >
                  <span
                    class="material-symbols-outlined align-middle"
                    :class="config.color"
                  >
                    {{ config.icon }}
                  </span>
                  <span :class="config.color">{{ config.label }}</span>
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      class="mt-5"
    />
  </section>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  changeUserBlockStatus,
  changeUserRole,
  getAllUsersProfile,
  type UserInfo,
} from "../../../api/user";
import { ElMessage } from "element-plus";
const userList = ref<UserInfo[] | []>([]);
const searchQuery = ref("");
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const fetchData = async () => {
  try {
    const res = await getAllUsersProfile(currentPage.value, pageSize.value);
    if (res) {
      userList.value = res.data;
      totalCount.value = res.pagination.total;
    }
  } catch (err) {
    ElMessage.error("載入資料失敗");
  }
};
onMounted(async () => {
  await fetchData();
});

const clearQuery = () => {
  searchQuery.value = "";
};

const sortByRole = (a: UserInfo, b: UserInfo) => {
  const rolePriority = {
    admin: 1,
    technician: 2,
    user: 3,
  };
  return rolePriority[a.role] - rolePriority[b.role];
};

const rolesMap: Record<string, { label: string; color: string; icon: string }> =
  {
    admin: { label: "管理者", color: "text-orange-500", icon: "shield_person" },
    technician: {
      label: "美甲師",
      color: "text-blue-500",
      icon: "health_and_beauty",
    },
    user: {
      label: "使用者",
      color: "text-green-500",
      icon: "account_circle",
    },
  };

const handleRoleChange = async (userId: string, newRole: string) => {
  try {
    await changeUserRole(userId, newRole);
    ElMessage.success({
      message: `角色已成功更新為：${rolesMap[newRole]?.label}`,
      type: "success",
    });
    await fetchData();
  } catch (err) {
    ElMessage.error("更新失敗，請稍後再試");
    await fetchData();
  }
};

const statusMap: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  false: { label: "啟用中", color: "text-green-500", icon: "check_circle" },
  true: {
    label: "停用中",
    color: "text-red-500",
    icon: "block",
  },
};
const handleStatusChange = async (userId: string, newStatus: boolean) => {
  try {
    await changeUserBlockStatus(userId, newStatus);
    ElMessage.success({
      message: `停用狀態已成功更新為：${statusMap[String(newStatus)]?.label}`,
      type: "success",
    });
    await fetchData();
  } catch (err) {
    ElMessage.error("更新失敗，請稍後再試");
    await fetchData();
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchData();
};
</script>
