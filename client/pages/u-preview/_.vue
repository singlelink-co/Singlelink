<template>
  <div class="relative flex min-h-screen w-screen bg-gray-100 justify-center w-full sl-bg">
    <section class="flex flex-col p-6 pt-8 pb-8 items-center text-center max-w-sm w-full">
      <img class="nc-avatar mb-2" v-if="profile.image_url || user.avatar_url || user.hash" :src="profile.image_url || user.avatar_url || 'https://www.gravatar.com/avatar/' + user.hash"/>
      <h1 class="text-black font-semibold text-2xl sl-headline">{{ profile.headline || user.name }}</h1>
      <h3 class="text-gray-600 mb-4 sl-subtitle">{{ profile.subtitle }}</h3>
      <a :href="link.url" v-for="link in links" class="w-full">
        <div class="rounded shadow bg-white p-4 w-full font-medium mb-3 nc-link sl-item  flex items-center justify-center flex-col" :style="link.custom_css">
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
  import Cookies from "~/middleware/utils";

  export default {
    data: function() {
      return {
        profile: {
          custom_html: null,
          custom_css: null,
          image_url: null,
          headline: null,
          subtitle: null,
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
        theme: null,
        links: null,
        failed: false
      };
    },
    middleware: 'authenticated',
    asyncData(ctx) {
      return ctx.$axios.$post('/profile/fetch-preview', {
        token: Cookies.getCookieValue('singlelink_token', ctx)
      })
        .then((response) => {
          if(response.data) {
            return {
              profile: response.data.profile,
              links: response.data.links.sort(function (a, b) {
                return a.order - b.order;
              }),
              user: response.data.user,
              theme: response.data.theme
            };
          } else {
            return {
              profile: response.profile,
              links: response.links.sort(function (a, b) {
                return a.order - b.order;
              }),
              user: response.user,
              theme: response.theme
            };
          }
        }).catch((error) => {
        console.log('Error fetching profile');
        console.log(error);
        return {failed: true};
      });
    },
    /*mounted: function() {
      this.$axios.$post('/profile/fetch-preview', {
        token: this.$store.getters['auth/get_token']
      })
        .then((response) => {
          console.log('Profile fetched successfully');
          console.log(response);
          this.profile = response.profile;
          this.links = response.links.sort(function (a, b) {
            return a.order - b.order;
          });
          this.user = response.user;
          this.theme = response.theme || null;
          console.log(response.theme);

          // Search for and attempt to run javascript in Custom HTML
          var executeScripts= function(elm, html) {
            elm.innerHTML = html;
            Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
              const newScript = document.createElement("script");
              Array.from(oldScript.attributes)
                .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
              newScript.appendChild(document.createTextNode(oldScript.innerHTML));
              oldScript.parentNode.replaceChild(newScript, oldScript);
            });
          };
          setTimeout(
          executeScripts(document.getElementById('__layout'), document.getElementById('__layout').innerHTML)
          , 1000);
        })
        .catch((error) => {
          console.log('Error fetching profile');
          console.log(error);
          this.failed = true;
        });
    }*/
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

