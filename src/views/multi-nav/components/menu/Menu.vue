<template>
  <div ref="Menu" class="menu">
    <ul class="list">
      <li
        v-for="item of activityList"
        :key="item['ID']"
        :class="['item', activeMenu === item['ID'] ? 'active' : 'inactive']"
        @click="activeMenu = item['ID']"
      >
        <MenuTag :tag="item['tag']" />
        <div class="title">
          <span>{{ item['title'] }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import activityList from '../../composables/config-menu';
import BScroll from '@better-scroll/core';
import { activeMenu } from '../../composables/active-menu';

import MenuTag from './MenuTag.vue';

export default defineComponent({
  components: {
    MenuTag,
  },

  setup() {
    const { menuID } = activeMenu();

    return {
      activityList: activityList(),
      activeMenu: menuID,
    };
  },

  watch: {
    activityList: {
      immediate: true,
      handler(value) {
        if (value.length !== 0) {
          this.$nextTick(() => {
            setTimeout(() => {
              new BScroll(this.$refs.Menu as HTMLDivElement, { click: true });
            }, 300);
          });
        }
      },
    },
  },

  mounted() {
    //
  },

  methods: {},
});
</script>

<style lang="scss" scoped>
.menu {
  height: 780px;
  width: 360px;
  overflow: hidden;
  cursor: default;
  user-select: none;

  .list {
    list-style: none;
    margin: 0;
    padding: 20px 0;
    text-align: center;

    .item {
      position: relative;
      height: 113px;
      margin-top: 20px;
      background-repeat: no-repeat;
      background-size: contain;
      display: inline-block;

      &:first-child {
        margin-top: 0;
      }

      .title {
        height: 100px;
        line-height: 100px;
        width: 280px;
        margin-top: 4px;
        font-size: 34px;
      }
    }

    .active {
      width: 339px;
      color: white;
      background-image: url('../../image/btn_1.png');

      & > img.tag {
        left: -9px;
      }

      .title {
        margin-left: 5px;
      }
    }

    .inactive {
      width: 299px;
      margin-right: 30px;
      color: #3a6ca8;
      background-image: url('../../image/btn_2.png');
    }
  }
}
</style>
