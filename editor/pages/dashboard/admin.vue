<template>
  <section class="flex flex-col p-8 items-center overflow-x-hidden overflow-y-scroll">
    <div class="flex flex-row items-center justify-start mb-4 space-x-4 mb-4">
      <img class="w-8" src="/Person.svg">
      <h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
        Admin dashboard
      </h1>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- Banned User Controls -->
    <div class="flex flex-col py-6 bg-white shadow rounded-2xl justify-center items-start w-full mb-8">
      <h2 class="text-black font-bold text-lg w-full px-6 mb-6">
        Manage Banned Users
      </h2>
      <div class="w-full bg-gray-200" style="height:1px;"/>

      <div class="flex flex-col mt-4 mb-2 w-full px-6 mt-6">
        <div class="flex flex-col items-center justify-start space-y-4 w-full">
          <input
            id="banUserId"
            v-model="banUserId"
            class="px-2 py-3 text-sm border-solid border-gray-300 rounded-2xl border w-full flex-grow"
            type="text"
            placeholder="e.g. 1273"
            aria-label="ban user id"
          >
          <input
            id="banUseReason"
            v-model="banUserReason"
            class="px-2 py-3 text-sm border-solid border-gray-300 rounded-2xl border w-full flex-grow"
            type="text"
            placeholder="e.g. Phishing"
            aria-label="ban user reason"
          >
          <button
            type="button"
            class="w-full flex py-3 px-6 text-sm text-white text-center bg-gdp hover:bg-indigo-500 rounded-2xl font-bold justify-center align-center"
            @click="banUser(banUserId, banUserReason || undefined); banUserReason = null; banUserId = null"
          >
            Ban User
          </button>
        </div>
      </div>

      <div class="w-full bg-gray-200" style="height:1px;"/>

      <div class="flex flex-row items-center justify-start">
        <h2 class="text-black font-bold text-lg px-6 mb-6 mt-6">
          Banned users {{ loadedBanned ? `(${bannedUsers.length} banned)` : '' }}
        </h2>
        <button
          type="button"
          class="py-3 px-6 text-sm text-white text-center bg-gdp hover:bg-indigo-500 rounded-2xl font-bold"
          @click="showBanned = !showBanned; refreshBannedUsersFirstTime()"
        >
          {{ showBanned ? 'Hide' : 'Show' }}
        </button>
      </div>

      <div class="w-full bg-gray-200" style="height:1px;"/>
      <div
        v-if="showBanned"
        v-for="banned in bannedUsers"
        :key="banned.ban.user_id"
        class="flex flex-col py-2 px-8 cursor-pointer w-full items-start justify-start border border-gray-200 border-t-0 border-l-0 border-r-0"
      >
        <p class="font-bold text-black text-lg mr-auto">
          Id: {{ banned.ban.user_id }}
        </p>

        <div class="flex flex-row items-center justify-start w-full">
          <div>
            <div
              class="py-1 px-2 mb-1 text-gray-600 text-sm font-extrabold leading-tight"
            >
              Email: {{ banned.userData.email }}
            </div>
            <div
              v-if="banned.ban.reason"
              class="py-1 px-2 mb-1 text-gray-600 text-sm font-extrabold leading-tight"
            >
              Reason: {{ banned.ban.reason }}
            </div>
            <div
              class="py-1 px-2 mb-1 text-gray-600 text-sm font-extrabold leading-tight"
            >
              Active Profile Id: {{ banned.userData.activeProfileId }}
            </div>
            <div
              class="py-1 px-2 mb-1 text-gray-600 text-sm font-extrabold leading-tight"
            >
              Created On: {{ new Date(banned.userData.createdOn).toUTCString() }}
            </div>
            <div
              class="py-1 px-2 mb-1 text-gray-600 text-sm font-extrabold leading-tight"
            >
              Banned on: {{ new Date(banned.ban.created_on).toUTCString() }}
            </div>
          </div>

          <button
            type="button"
            class="ml-auto py-3 px-6 text-sm text-white text-center bg-red-500 hover:bg-red-700 rounded-2xl font-bold"
            @click="unbanUser(banned.ban.user_id)"
          >
            Unban User
          </button>

        </div>

      </div>
    </div>

  </section>
</template>

<script lang="ts">
import Vue from "vue";

type ThemeModalIntent = "create" | "edit";

export default Vue.extend({
  name: 'DashboardAdmin',
  layout: 'dashboard',
  middleware: 'authenticated',
  head() {
    return {
      title: 'Admin - ' + process.env.APP_NAME,
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex'}
      ]
    };
  },
  data() {
    return {
      loadedBanned: false,
      showBanned: false,
      bannedUsers: [] as { ban: DbBanned, userData: SensitiveUser | undefined }[],
      banUserId: null as null | string,
      banUserReason: null as null | string,

      error: null as null | string,
      errorIntervalHandler: undefined as any,

      isAdmin: false
    };
  },

  async beforeMount() {
    const permGroup = await this.$axios.$post("/admin/perm-group", {
      token: this.$store.getters['auth/getToken']
    });

    this.isAdmin = permGroup["groupName"] === 'admin';
  },

  async mounted() {
  },

  methods: {
    async refreshBannedUsersFirstTime() {
      if (!this.loadedBanned) {
        await this.refreshBannedUsers();
        this.loadedBanned = true;
      }
    },

    async refreshBannedUsers() {
      let token = this.$store.getters['auth/getToken'];

      this.bannedUsers = (await this.$axios.post('/admin/bans', {
        token
      })).data as { ban: DbBanned, userData: SensitiveUser | undefined }[];
    },

    async banUser(id: string, reason?: string) {
      let token = this.$store.getters['auth/getToken'];

      try {
        await this.$axios.post('/admin/set-banned', {
          token,
          userId: id,
          reason: reason,
          banned: true
        });

        await this.refreshBannedUsers();

        console.log(`Banned user: ${id}${reason ? " for reason: " + reason : ""}`);
      } catch (err) {
        this.error = err.response.data.error;

        if (this.errorIntervalHandler !== undefined)
          clearInterval(this.errorIntervalHandler);

        this.errorIntervalHandler = setInterval(() => this.error = '', 2000);
      }
    },

    async unbanUser(id: string) {
      let token = this.$store.getters['auth/getToken'];

      await this.$axios.post('/admin/set-banned', {
        token,
        userId: id,
        banned: false
      });

      await this.refreshBannedUsers();

      console.log(`Unbanned user: ${id}`);
    }
  }
});
</script>

<style lang="scss">
.nc-theme {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-right: 10px;
  cursor: pointer;

  &.active {
    box-shadow: inset 0 0 2px 2px #5353EC;
  }

  .nc-inner {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .edit-icon {
    position: absolute;
    top: 2px;
    right: 5px;
    color: #3e39ab;
  }

  .nc-bottom-inner {
    width: 100%;
    height: 15px;
    margin-top: auto;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1);
  }

}

/**
  Animations
 */

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.error {
  @apply bottom-0 rounded-lg shadow border border-gray-200;
  color: mintcream;
  background-color: #ff4a4a;
  padding: 7px;
  z-index: 25;
}
</style>
