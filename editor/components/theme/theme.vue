<template>
  <div :class="'w-full flex flex-col items-center justify-center ' + active_styles">
    <div class="relative rounded" style="width: 201px;height:217px;overflow:hidden;">
      <iframe
        v-if="!theme"
        scrolling="no"
        style="pointer-events: none;width: 375px;height: 406px;transform: scale(.536) translate(-163px, -175px);top:0;left:0;position:absolute;"
        :src="'/dashboard/marketplace/preview/' + id"
      />
      <iframe
        v-if="theme"
        scrolling="no"
        style="pointer-events: none;width: 375px;height: 406px;transform: scale(.536) translate(-163px, -175px);top:0;left:0;position:absolute;"
        :src="'/dashboard/appearance/preview/' + id"
      />
      <a
        v-if="theme"
        :href="'/dashboard/appearance/theme/' + id"
        style="position:absolute;top:10px;right:10px;z-index:5;width:10px;height:10px;"
        @click.stop
      >
        <i
          class="fas fa-pencil-alt absolute"
          style="color: #FFF;font-size:10px;text-shadow: 0 1px 2px #000;"
        />
      </a>
    </div>
    <!--<div class="shadow w-full h-32 rounded-xl mb-2 relative overflow-hidden flex items-center justify-center" :style="'background:' + colors.fill.primary + ';'">
        <a
            :href="'/dashboard/marketplace/addon/' + id"
            style="position:absolute;top:10px;right:10px;z-index:5;width:10px;height:10px;"
            v-if="icon"
            @click.stop
        >
            <i
                v-if="icon == 'edit'"
                class="fas fa-pencil-alt absolute"
                style="color: #FFF;font-size:10px;text-shadow: 0 1px 2px #000;"
            />
            <i
                v-if="icon == 'view'"
                class="fas fa-eye absolute"
                style="color: #FFF;font-size:10px;text-shadow: 0 1px 2px #000;"
            />
        </a>
        <div :style="'top:50%;height:50%;left:0;right:0;z-index:2;width:100%;position:absolute;background:' + colors.fill.secondary + ';'"></div>
        <div class="shadow-lg overflow-hidden flex flex-col items-center justify-center" :style="'width:60px;height:60px;position;relative;z-index:3;border-radius:40px;background:'+colors.text.primary">
            <div class="mt-auto w-full" :style="'height:30px;background:' + colors.text.secondary + ';'"></div>
        </div>
    </div>-->
    <div class="font-bold text-black mb-1 mt-2">
      {{ label }}
    </div>
    <!--<span class="text-sm text-gray-500">Author: {{ userId }}</span>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'Theme',

  props: {
    id: String,
    colors: Object,
    label: String,
    icon: String,
    active: Boolean,
    theme: {
      type: Boolean,
      default: false
    },
    profileData: {
      type: Object,
      default: null
    }
  },

  computed: {
    active_styles() {
      if (!this.active) {
        return '';
      }
      return ' bg-indigo-200 border-indigo-600 border hover:bg-indigo-300';
    },

    profile() {
      const profileData: any = this.profileData;

      return {
        customHtml: profileData.customHtml,
        customCss: profileData.customCss,
        imageUrl: null,
        headline: 'Lorem ipsum',
        subtitle: 'Example subtitle',
        showWatermark: true,
        metadata: {
          privacyMode: false
        }
      };
    }
  },

  mounted() {
    if (this.profileData) {
      // something here eventually?
    }
  }
});
</script>
