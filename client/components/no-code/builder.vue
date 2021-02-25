<template>
    <div class="flex flex-col justify-start items-start">
        <div class="flex flex-col flex-grow bg-gray-50 rounded-lg w-full">
          <div class="flex flex-col justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center">
            <div class="w-full flex flex-col lg:flex-row justify-start lg:justify-between items-start space-y-2 lg:space-y-0 lg:items-center">
              <div class="flex flex-col">
                <span class="text-gray-800 font-semibold">Page styles</span>
                <span class="text-sm text-gray-500 font-medium">Customize your page styles such as avatar size and page background.</span>
              </div>
              <div @click="drawer.page_styles = !drawer.page_styles" class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"><span v-if="!drawer.page_styles">Expand</span><span v-if="drawer.page_styles">Collapse</span></div>
            </div>
            <!-- Drawer -->
            <div v-if="drawer.page_styles" class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200">
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Avatar</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full mb-2">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Size (px)</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.page_styles.avatar_size" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Border radius (px)</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.page_styles.avatar_radius" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="35px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Border style</label>
                      <select v-model="meta.page_styles.avatar_border_type" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="none">No border</option>
                        <option value="solid">Solid border</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Border width (px)</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.page_styles.avatar_border_width" class="p-3 bg-white text-sm text-gray-700" placeholder="4px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Border color</label>
                      <div class="relative">
                        <input v-model="meta.page_styles.avatar_border_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.page_styles.avatar_border_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Box shadow</label>
                      <select v-model="meta.page_styles.avatar_shadow" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="none">None</option>
                        <option value="0 1px 3px 0 rgba(0,0,0,.15)">Small</option>
                        <option value="0 2px 5px 0 rgba(0,0,0,.2)">Medium</option>
                        <option value="0 2px 15px 0 rgba(0,0,0,.12), 0 2px 5px 0 rgba(0,0,0,.25)">Large</option>
                      </select>
                </div>
              </div>
              <!--<span class="text-gray-800 font-semibold py-3 my-3 border border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Background</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background type</label>
                      <select v-model="meta.page_styles.background_type" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="none">No background</option>
                        <option value="solid">Solid color</option>
                        <option value="image">Image</option>
                        <option value="gradient">Gradient</option>
                      </select>
                </div>
                <div v-if="meta.page_styles.background_type=='solid'" class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background color</label>
                      <input type="text" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FCFCFC"/>
                </div>
                <div v-if="meta.page_styles.background_type=='image'" class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background image URL</label>
                      <input type="text" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. https://singlelink.co/og-image.png"/>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full" v-if="meta.page_styles.background_type=='gradient'">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Start color</label>
                      <input type="text" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FCFCFC"/>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">End color</label>
                      <input type="text" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FCFCFC"/>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Direction</label>
                      <select class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="to top">To top</option>
                        <option value="to right">To right</option>
                        <option value="to bottom">To bottom</option>
                        <option value="to left">To left</option>
                      </select>
                </div>
              </div>-->
            </div>
            <!-- End Drawer -->
          </div>
          <div class="flex flex-col lg:flex-row justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center">
            <div class="w-full flex flex-col lg:flex-row justify-start lg:justify-between items-start space-y-2 lg:space-y-0 lg:items-center">
              <div class="flex flex-col">
              <span class="text-gray-800 font-semibold">Typography</span>
              <span class="text-sm text-gray-500 font-medium">Customize your fonts, font size, font weight, and more.</span>
              </div>
              <div @click="drawer.typography = !drawer.typography" class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"><span v-if="!drawer.typography">Expand</span><span v-if="drawer.typography">Collapse</span></div>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row justify-center w-full p-6 border-t-0 border-l-0 border-r-0 border-gray-200 items-center">
            <div class="w-full flex flex-col lg:flex-row justify-start lg:justify-between items-start space-y-2 lg:space-y-0 lg:items-center">
              <div class="flex flex-col">
              <span class="text-gray-800 font-semibold">Link styles</span>
              <span class="text-sm text-gray-500 font-medium">Customize your default styles for link items.</span>
              </div>
              <div @click="drawer.link_styles = !drawer.link_styles" class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"><span v-if="!drawer.link_styles">Expand</span><span v-if="drawer.link_styles">Collapse</span></div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: String,
        scope: {
            type: String,
            default: 'Profile'
        },
    },
    data() {
        return {
          imported_css: this.value,
          JSON_pkg: {
            children: {
              "img.nc-avatar": {
                attributes: {
                  width: null,
                  height: null,
                  border: null,
                  'box-shadow': null,
                  'border-radius': null
                }
              },
            }
          },
          drawer: {
            page_styles: false,
            typography: false,
            link_styles: false
          },
          meta: {
            page_styles: {
              avatar_size: null,
              avatar_radius: null,
              avatar_shadow: null,
              avatar_border_type: null,
              avatar_border_color: null,
              avatar_border_width: null,
              background_type: 'none'
            }
          }
        }
    },
    computed: {
      /*exported_css() {
        if(this.meta.page_styles.avatar_size) {
          this.JSON_pkg.children["img.nc-avatar"].attributes.width = this.meta.page_styles.avatar_size + 'px';
          this.JSON_pkg.children["img.nc-avatar"].attributes.height = this.meta.page_styles.avatar_size + 'px';
        }
        if(this.meta.page_styles.avatar_radius) this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius'] = this.meta.page_styles.avatar_radius + 'px';
        if(this.meta.page_styles.avatar_shadow) this.JSON_pkg.children["img.nc-avatar"].attributes['box-shadow'] = this.meta.page_styles.avatar_shadow;
        if(this.meta.page_styles.avatar_border_type != 'none' && this.meta.page_styles.avatar_border_color && this.meta.page_styles.avatar_border_width) {
          this.JSON_pkg.children["img.nc-avatar"].attributes['border'] = this.meta.page_styles.avatar_border_type + ' ' + this.meta.page_styles.avatar_border_width + ' ' + this.meta.page_styles.avatar_border_color;
        }
        return this.$transform.toCSS(this.JSON_pkg);
      }*/
    },
    mounted() {
      /*setInterval(()=>{
        console.log(this.exported_css);
      }, 3500);*/
      console.log('Input');
      console.log(this.imported_css);
      console.log('to JSON');
      console.log(this.$transform.toJSON(this.imported_css));
      if(this.imported_css) {
        this.JSON_pkg = this.$transform.toJSON(this.imported_css);
        // Avatar height
        if(this.JSON_pkg.children["img.nc-avatar"].attributes.width) this.meta.page_styles.avatar_size = this.JSON_pkg.children["img.nc-avatar"].attributes.width.split('px')[0];
        // Avatar border radius
        if(this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius']) this.meta.page_styles.avatar_radius = this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius'].split('px')[0];
        // Avatar border
        if(this.JSON_pkg.children["img.nc-avatar"].attributes.border && this.JSON_pkg.children["img.nc-avatar"].attributes.border != 'none') {
          let border = this.JSON_pkg.children["img.nc-avatar"].attributes.border.split(' ');
          // Avatar border style
          this.meta.page_styles.avatar_border_type = border[0];
          // Avatar border width
          this.meta.page_styles.avatar_border_width = border[1].split('px')[0];
          // Avatar border color
          this.meta.page_styles.avatar_border_color = border[2];
        } else if(this.JSON_pkg.children["img.nc-avatar"].attributes.border == 'none') {
          this.meta.page_styles.avatar_border_type = 'none';
        }
        // Avatar box-shadow
        if(this.JSON_pkg.children["img.nc-avatar"].attributes['box-shadow']) this.meta.page_styles.avatar_shadow = this.JSON_pkg.children["img.nc-avatar"].attributes['box-shadow'];
        
      }
    },
    watch: {
      meta: {
        handler() {
          console.log('Changes');
          console.log
          if(this.meta.page_styles.avatar_size) {
            this.JSON_pkg.children["img.nc-avatar"].attributes.width = this.meta.page_styles.avatar_size + 'px';
            this.JSON_pkg.children["img.nc-avatar"].attributes.height = this.meta.page_styles.avatar_size + 'px';
          } else {
            delete this.JSON_pkg.children["img.nc-avatar"].attributes.width;
            delete this.JSON_pkg.children["img.nc-avatar"].attributes.height;
          }
          if(this.meta.page_styles.avatar_radius) {
            this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius'] = this.meta.page_styles.avatar_radius + 'px';
          } else {
            delete this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius'];
          }
          if(this.meta.page_styles.avatar_shadow) this.JSON_pkg.children["img.nc-avatar"].attributes['box-shadow'] = this.meta.page_styles.avatar_shadow;
          if(this.meta.page_styles.avatar_border_type != 'none' && this.meta.page_styles.avatar_border_color && this.meta.page_styles.avatar_border_width) {
            this.JSON_pkg.children["img.nc-avatar"].attributes['border'] = this.meta.page_styles.avatar_border_type + ' ' + this.meta.page_styles.avatar_border_width + 'px ' + this.meta.page_styles.avatar_border_color;
          } else if(this.meta.page_styles.avatar_border_type == 'none') {
            this.JSON_pkg.children["img.nc-avatar"].attributes['border'] = 'none'
          }
          return this.$emit('input', this.$transform.toCSS(this.JSON_pkg));
        },
        deep: true
      }
    }

}
</script>