<template>
  <div class="search-bar form-group">
    <div class="combo-box dropdown" :class="{ active: results.length > 0 }">
      <input v-model="searchQuery" placeholder="Search something..." />
      <ul class="dropdown-menu list menu">
        <li v-for="issue of results" :key="issue.id" class="menu-item">
          <router-link
            class="hide-text-overflow"
            :to="{ name: 'issue', params: { issueId: issue.id } }"
            @click="closeResults"
            >{{ issue.title }}</router-link
          >
        </li>
      </ul>
    </div>
    <button>
      <IconSearch />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { Issue } from '@/lib/models/issue.model';
import { IssueApi } from '@/lib/api/issues.api';
import { ref, watch } from 'vue';
import IconSearch from '../icons/IconSearch.vue';

const props = defineProps<{
  productId: number;
}>();

const searchQuery = ref('');
const results = ref<Issue[]>([]);
const issuesApi = new IssueApi();

watch(searchQuery, async () => {
  if (searchQuery.value.trim())
    results.value = await issuesApi.findIssues(props.productId, searchQuery.value);
  else results.value = [];
});

function closeResults() {
  results.value = [];
}
</script>

<style lang="sass" setup>
.combo-box
  width: 360px
.icon
  width: 20px
</style>
