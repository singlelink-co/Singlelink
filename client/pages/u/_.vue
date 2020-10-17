<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <section v-if="profile.visibility=='published-18+' && age_verification"
             class="fixed top-0 left-0 right-0 z-10 flex flex-col items-center justify-center w-screen h-screen"
             style="box-shadow: rgba(0, 0, 0, .65) 0  0 10px 5px inset;">
      <div class="flex flex-col w-full h-full text-center items-center justify-center p-8"
           style="background:rgba(0,0,0,.65);backdrop-filter:saturate(180%) blur(5px)">
        <span class="text-white text-2xl mb-2">Warning: 18+ only</span>
        <span class="text-gray-200 text-lg mb-4">To continue, please confirm your age below.</span>
        <div class="flex flex-col">
          <button @click="accept_age_verification"
                  class="w-full mb-4 uppercase rounded p-4 pl-4 pr-4 bg-indigo-600 hover:bg-indigo-500 cursor-pointer font-medium text-sm tracking-wide shadow text-white">
            Continue, I am 18+
          </button>
          <button @click="reject_age_verification" style="background:#e74c3c;"
                  class="w-full uppercase rounded p-4 pl-4 pr-4 cursor-pointer font-medium text-sm tracking-wide shadow text-white mr-2">
            Go back, I'm under 18
          </button>
        </div>
      </div>
    </section>
    <section class="flex flex-col p-6 pt-8 pb-8 items-center text-center max-w-sm w-full">
      <img class="nc-avatar mb-2" v-if="profile.image_url || user.avatar_url || user.hash"
           :src="profile.image_url || user.avatar_url || 'https://www.gravatar.com/avatar/' + user.hash"/>
      <h1 class="text-black font-semibold text-2xl sl-headline">{{ profile.headline || user.name }}</h1>
      <h3 class="text-gray-600 mb-4 sl-subtitle">{{ profile.subtitle }}</h3>
      <a :href="'https://api.singlelink.co/analytics/link/' + link._id" v-for="link in links" class="w-full">
        <div
          class="rounded shadow bg-white p-4 w-full font-medium mb-3 nc-link sl-item flex items-center justify-center flex-col"
          :style="link.custom_css">
          <span class="font-medium text-gray-900 sl-label">{{ link.label }}</span>
          <span v-if="link.subtitle" class="text-sm text-gray-700 sl-link-subtitle mt-1">{{ link.subtitle }}</span>
        </div>
      </a>
      <div v-html="profile.custom_html"></div>
      <component is="style" v-if="theme">
        .sl-headline {
        color: {{ theme.colors.text.primary }};
        }
        .sl-subtitle {
        opacity: .85;
        color: {{ theme.colors.text.primary }};
        }
        .sl-bg {
        background: {{ theme.colors.fill.primary }};
        }
        .sl-item {
        background: {{ theme.colors.fill.secondary }};
        }
        .sl-label {
        color: {{ theme.colors.text.secondary }};
        }
        .sl-link-subtitle {
        opacity: .85;
        color: {{ theme.colors.text.secondary }};
        }
      </component>
      <component is="style">{{ profile.custom_css || null }}</component>
      <component is="style">
        .nc-avatar {
        width: 60px;
        height: 60px;
        border-radius: 1000px;
        }
        .nc-link {
        @apply rounded shadow bg-white p-4 w-full font-medium mb-3;
        cursor: pointer;
        transition: .15s ease-in-out;
        }
        .nc-link:hover {
        transform: scale(1.02);
        }
        .nc-link:active {
        transform: scale(1);
        }
      </component>
    </section>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      profile: {
        custom_html: null,
        custom_css: null,
        image_url: null,
        headline: null,
        subtitle: null,
        visibility: null,
        parent: {
          name: null,
          hash: null
        }
      },
      user: {
        name: null,
        hash: null,
        avatar_url: null
      },
      thumbnail: null,
      theme: null,
      links: null,
      failed: false,
      age_verification: true
    };
  },
  methods: {
    accept_age_verification: function () {
      return this.age_verification = false;
    },
    reject_age_verification: function () {
      return window.location.href = "https://singlelink.co";
    },
  },
  head: function() {
    return {
      title: this.profile.headline || '',
      meta: [
        {
          hid: 'title',
          name: 'title',
          content: this.profile.headline || ''
        },
        {
          hid: 'og:title',
          name: 'title',
          content: this.profile.headline || ''
        },
        {
          hid: 'description',
          name: 'description',
          content: this.profile.subtitle || ''
        },
        {
          hid: 'og:description',
          name: 'description',
          content: this.profile.subtitle || ''
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: 'https://api.singlelink.co/profile/thumbnail/' + this.$route.path.replace('/u/', '')
        }
      ],
    };
  },
      asyncData(ctx) {
    return ctx.$axios.$post('/profile/fetch', {
      handle: ctx.route.path.replace('/u/', '')
    })
      .then((response) => {
        if(response.data) {
          return {
            profile: response.data.profile,
            links: response.data.links.sort(function (a, b) {
              return a.order - b.order;
            }),
            user: response.data.user,
            theme: response.data.theme || null,
          };
        } else {
          return {
            profile: response.profile,
            links: response.links.sort(function (a, b) {
              return a.order - b.order;
            }),
            user: response.user,
            theme: response.theme || null,
          };
        }
      })
      .catch((error) => {
        console.log('Error fetching profile');
        console.log(error);
        return {failed:true};
      });
  },
  /*mounted: function () {
    this.$axios.$post('/profile/fetch', {
      handle: window.location.pathname.replace('/u/', '')
    })
      .then((response) => {
        //console.log('Profile fetched successfully');
        //console.log(response);
        this.profile = response.profile;
        this.links = response.links.sort(function (a, b) {
          return a.order - b.order;
        });
        this.user = response.user;
        this.theme = response.theme || null;
        //console.log(response.theme);

        document.title = this.profile.headline + ' | Singlelink';
        document.description = this.profile.subtitle;
        document.querySelector('meta[name="og:title"]').setAttribute("content", this.profile.headline + ' | Singlelink');
        document.querySelector('meta[name="og:description"]').setAttribute("content", this.profile.subtitle);
        document.querySelector('meta[name="description"]').setAttribute("content", this.profile.subtitle);
        //document.querySelector('meta[name="og:image"]').setAttribute("content", 'https://api.singlelink.co/profile/thumbnail/' + window.location.pathname.replace('/u/', ''));
      })
      .catch((error) => {
        console.log('Error fetching profile');
        console.log(error);
        this.failed = true;
      });
  },*/
};
</script>

<style lang="sass" scoped>
.nc-avatar
  width: 60px
  height: 60px
  border-radius: 1000px

.nc-link
  cursor: pointer
  transition: .15s ease-in-out
  overflow: hidden

  &:hover
    transform: scale(1.02)

  &:active
    transform: scale(1)

</style>
