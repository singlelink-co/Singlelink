<template>
  <div class="flex flex-col justify-start items-start">
    <div class="flex flex-col flex-grow bg-gray-50 rounded-lg w-full">
      <div
        class="flex flex-col justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center"
      >
        <div class="w-full flex flex-row justify-between items-start space-y-2 3xl:space-y-0 3xl:items-center">
          <div class="flex flex-col">
            <span class="text-gray-800 font-semibold">Page styles</span>
            <span class="text-sm text-gray-500 font-medium">Customize your page styles such as avatar size and page background.</span>
          </div>
          <div
            class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"
            @click="drawer.page_styles = !drawer.page_styles"
          ><span v-if="!drawer.page_styles">Expand</span><span v-if="drawer.page_styles">Collapse</span></div>
        </div>
        <!-- Drawer -->
        <div
          v-if="drawer.page_styles"
          class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200"
        >
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Page</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Max width</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.page_styles.max_width"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Padding</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.page_styles.padding"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
          </div>
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Avatar</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full mb-2">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Size (px)</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.page_styles.avatar_size"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border radius (px)</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.page_styles.avatar_radius"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="35px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border style</label>
              <select
                v-model="meta.page_styles.avatar_border_type"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="none">
                  No border
                </option>
                <option value="solid">
                  Solid border
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border width (px)</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.page_styles.avatar_border_width"
                  min="0"
                  class="p-3 bg-white text-sm text-gray-700"
                  placeholder="4px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border color</label>
              <div class="relative">
                <input
                  v-model="meta.page_styles.avatar_border_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.page_styles.avatar_border_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Box shadow</label>
              <select
                v-model="meta.page_styles.avatar_shadow"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="none">
                  None
                </option>
                <option value="0 1px 3px 0 rgba(0,0,0,.15)">
                  Small
                </option>
                <option value="0 2px 5px 0 rgba(0,0,0,.2)">
                  Medium
                </option>
                <option value="0 2px 15px 0 rgba(0,0,0,.12), 0 2px 5px 0 rgba(0,0,0,.25)">
                  Large
                </option>
              </select>
            </div>
          </div>
          <span
            class="text-gray-800 font-semibold py-3 my-3 border border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Background</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background type</label>
              <select
                v-model="meta.page_styles.background_type"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="none">
                  No background
                </option>
                <option value="solid">
                  Solid color
                </option>
                <option value="image">
                  Image
                </option>
                <option value="gradient">
                  Gradient
                </option>
              </select>
            </div>
            <div v-if="meta.page_styles.background_type==='solid'" class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background color</label>
              <div class="relative w-full">
                <input
                  v-model="meta.page_styles.background_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.page_styles.background_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
            <div v-if="meta.page_styles.background_type==='image'" class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background image URL</label>
              <input
                v-model="meta.page_styles.background_image"
                type="text"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="e.g. https://singlelink.co/og-image.png"
              >
            </div>
          </div>
          <div
            v-if="meta.page_styles.background_type==='image'"
            class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full"
          >
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background size</label>
              <select
                v-model="meta.page_styles.background_size"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="cover">
                  Cover
                </option>
                <option value="contain">
                  Contain
                </option>
                <option value="100% 100%">
                  Stretch
                </option>
                <option value="auto">
                  Auto
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background position</label>
              <select
                v-model="meta.page_styles.background_position"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="top left">
                  Top left
                </option>
                <option value="top center">
                  Top center
                </option>
                <option value="top right">
                  Top right
                </option>
                <option value="center left">
                  Center left
                </option>
                <option value="center center">
                  Center
                </option>
                <option value="center right">
                  Center right
                </option>
                <option value="bottom left">
                  Bottom left
                </option>
                <option value="bottom center">
                  Bottom center
                </option>
                <option value="bottom right">
                  Bottom right
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background repeat</label>
              <select
                v-model="meta.page_styles.background_repeat"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="no-repeat">
                  No repeat
                </option>
                <option value="repeat-x">
                  Repeat X
                </option>
                <option value="repeat-y">
                  Repeat Y
                </option>
                <option value="repeat">
                  Repeat X & Y
                </option>
              </select>
            </div>
          </div>
          <div
            v-if="meta.page_styles.background_type==='gradient'"
            class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full"
          >
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Start color</label>
              <div class="relative w-full">
                <input
                  v-model="meta.page_styles.background_gradient_start"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.page_styles.background_gradient_start"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">End color</label>
              <div class="relative w-full">
                <input
                  v-model="meta.page_styles.background_gradient_end"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.page_styles.background_gradient_end"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Direction</label>
              <select
                v-model="meta.page_styles.background_gradient_direction"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="to top">
                  To top
                </option>
                <option value="to right">
                  To right
                </option>
                <option value="to bottom">
                  To bottom
                </option>
                <option value="to left">
                  To left
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- End Drawer -->
      </div>
      <div
        class="flex flex-col justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center"
      >
        <div class="w-full flex flex-row justify-between items-start space-y-2 3xl:space-y-0 3xl:items-center">
          <div class="flex flex-col">
            <span class="text-gray-800 font-semibold">Typography</span>
            <span
              class="text-sm text-gray-500 font-medium"
            >Customize your fonts, font size, font weight, and more.</span>
          </div>
          <div
            class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"
            @click="drawer.typography = !drawer.typography"
          ><span v-if="!drawer.typography">Expand</span><span v-if="drawer.typography">Collapse</span></div>
        </div>
        <!-- Drawer -->
        <div
          v-if="drawer.typography"
          class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200"
        >
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Headline</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font size</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.typography.headline_size"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font weight</label>
              <select
                v-model="meta.typography.headline_weight"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="normal">
                  Normal
                </option>
                <option value="bold">
                  Bold
                </option>
                <option value="bolder">
                  Bolder
                </option>
                <option value="lighter">
                  lighter
                </option>
                <option value="100">
                  100
                </option>
                <option value="200">
                  200
                </option>
                <option value="300">
                  300
                </option>
                <option value="400">
                  400
                </option>
                <option value="500">
                  500
                </option>
                <option value="600">
                  600
                </option>
                <option value="700">
                  700
                </option>
                <option value="800">
                  800
                </option>
                <option value="900">
                  900
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font family</label>
              <select
                v-model="meta.typography.headline_family"
                disabled
                placeholder="Coming soon..."
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
              />
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Line height</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.typography.headline_height"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="135%"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >%</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.typography.headline_spacing"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="3px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Color</label>
              <div class="relative">
                <input
                  v-model="meta.typography.headline_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.typography.headline_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
          </div>
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Subtitle</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font size</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.typography.subtitle_size"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font weight</label>
              <select
                v-model="meta.typography.subtitle_weight"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="normal">
                  Normal
                </option>
                <option value="bold">
                  Bold
                </option>
                <option value="bolder">
                  Bolder
                </option>
                <option value="lighter">
                  lighter
                </option>
                <option value="100">
                  100
                </option>
                <option value="200">
                  200
                </option>
                <option value="300">
                  300
                </option>
                <option value="400">
                  400
                </option>
                <option value="500">
                  500
                </option>
                <option value="600">
                  600
                </option>
                <option value="700">
                  700
                </option>
                <option value="800">
                  800
                </option>
                <option value="900">
                  900
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font family</label>
              <select
                v-model="meta.typography.subtitle_family"
                disabled
                placeholder="Coming soon..."
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
              />
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Line height</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.typography.subtitle_height"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="135%"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >%</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.typography.subtitle_spacing"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="3px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Color</label>
              <div class="relative">
                <input
                  v-model="meta.typography.subtitle_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.typography.subtitle_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center"
      >
        <div class="w-full flex flex-row justify-between items-start space-y-2 3xl:space-y-0 3xl:items-center">
          <div class="flex flex-col">
            <span class="text-gray-800 font-semibold">Link styles</span>
            <span class="text-sm text-gray-500 font-medium">Customize your default styles for link items.</span>
          </div>
          <div
            class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"
            @click="drawer.link_styles = !drawer.link_styles"
          ><span v-if="!drawer.link_styles">Expand</span><span v-if="drawer.link_styles">Collapse</span></div>
        </div>
        <!-- Drawer -->
        <div
          v-if="drawer.link_styles"
          class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200"
        >
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Link block styles</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Padding</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.padding"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border radius</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.border_radius"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border style</label>
              <select
                v-model="meta.link_styles.border_type"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="none">
                  No border
                </option>
                <option value="solid">
                  Solid border
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border width (px)</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.border_width"
                  min="0"
                  class="p-3 bg-white text-sm text-gray-700"
                  placeholder="4px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Border color</label>
              <div class="relative">
                <input
                  v-model="meta.link_styles.border_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.link_styles.border_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Box shadow</label>
              <select
                v-model="meta.link_styles.box_shadow"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="none">
                  None
                </option>
                <option value="0 1px 3px 0 rgba(0,0,0,.15)">
                  Small
                </option>
                <option value="0 2px 5px 0 rgba(0,0,0,.2)">
                  Medium
                </option>
                <option value="0 2px 15px 0 rgba(0,0,0,.12), 0 2px 5px 0 rgba(0,0,0,.25)">
                  Large
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background type</label>
              <select
                v-model="meta.link_styles.background_type"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="none">
                  No background
                </option>
                <option value="solid">
                  Solid color
                </option>
                <option value="image">
                  Image
                </option>
                <option value="gradient">
                  Gradient
                </option>
              </select>
            </div>
            <div v-if="meta.link_styles.background_type==='solid'" class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background color</label>
              <div class="relative w-full">
                <input
                  v-model="meta.link_styles.background_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.link_styles.background_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
            <div v-if="meta.link_styles.background_type==='image'" class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background image URL</label>
              <input
                v-model="meta.link_styles.background_image"
                type="text"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="e.g. https://singlelink.co/og-image.png"
              >
            </div>
          </div>
          <div
            v-if="meta.link_styles.background_type==='image'"
            class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full"
          >
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background size</label>
              <select
                v-model="meta.link_styles.background_size"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="cover">
                  Cover
                </option>
                <option value="contain">
                  Contain
                </option>
                <option value="100% 100%">
                  Stretch
                </option>
                <option value="auto">
                  Auto
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background position</label>
              <select
                v-model="meta.link_styles.background_position"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="top left">
                  Top left
                </option>
                <option value="top center">
                  Top center
                </option>
                <option value="top right">
                  Top right
                </option>
                <option value="center left">
                  Center left
                </option>
                <option value="center center">
                  Center
                </option>
                <option value="center right">
                  Center right
                </option>
                <option value="bottom left">
                  Bottom left
                </option>
                <option value="bottom center">
                  Bottom center
                </option>
                <option value="bottom right">
                  Bottom right
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Background repeat</label>
              <select
                v-model="meta.link_styles.background_repeat"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="no-repeat">
                  No repeat
                </option>
                <option value="repeat-x">
                  Repeat X
                </option>
                <option value="repeat-y">
                  Repeat Y
                </option>
                <option value="repeat">
                  Repeat X & Y
                </option>
              </select>
            </div>
          </div>
          <div
            v-if="meta.link_styles.background_type==='gradient'"
            class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full"
          >
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Start color</label>
              <div class="relative w-full">
                <input
                  v-model="meta.link_styles.background_gradient_start"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.link_styles.background_gradient_start"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">End color</label>
              <div class="relative w-full">
                <input
                  v-model="meta.link_styles.background_gradient_end"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.link_styles.background_gradient_end"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Direction</label>
              <select
                v-model="meta.link_styles.background_gradient_direction"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="to top">
                  To top
                </option>
                <option value="to right">
                  To right
                </option>
                <option value="to bottom">
                  To bottom
                </option>
                <option value="to left">
                  To left
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col justify-center w-full p-6 border-t-0 border-l-0 border-r-0 border-gray-200 items-center"
      >
        <div class="w-full flex flex-row justify-between items-start space-y-2 3xl:space-y-0 3xl:items-center">
          <div class="flex flex-col">
            <span class="text-gray-800 font-semibold">Link typography</span>
            <span class="text-sm text-gray-500 font-medium">Customize the default typography for link items.</span>
          </div>
          <div
            class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"
            @click="drawer.link_typography = !drawer.link_typography"
          ><span v-if="!drawer.link_typography">Expand</span><span v-if="drawer.link_typography">Collapse</span></div>
        </div>
        <!-- Drawer -->
        <div
          v-if="drawer.link_typography"
          class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200"
        >
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Link headline</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font size</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.headline_size"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font weight</label>
              <select
                v-model="meta.link_styles.headline_weight"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="normal">
                  Normal
                </option>
                <option value="bold">
                  Bold
                </option>
                <option value="bolder">
                  Bolder
                </option>
                <option value="lighter">
                  lighter
                </option>
                <option value="100">
                  100
                </option>
                <option value="200">
                  200
                </option>
                <option value="300">
                  300
                </option>
                <option value="400">
                  400
                </option>
                <option value="500">
                  500
                </option>
                <option value="600">
                  600
                </option>
                <option value="700">
                  700
                </option>
                <option value="800">
                  800
                </option>
                <option value="900">
                  900
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font family</label>
              <select
                v-model="meta.link_styles.headline_family"
                disabled
                placeholder="Coming soon..."
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
              />
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Line height</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.headline_height"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="135%"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >%</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.headline_spacing"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="3px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Color</label>
              <div class="relative">
                <input
                  v-model="meta.link_styles.headline_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.link_styles.headline_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
          </div>
          <span
            class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row"
          >Link subtitle</span>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font size</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.subtitle_size"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="70px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font weight</label>
              <select
                v-model="meta.link_styles.subtitle_weight"
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
                placeholder="Select one..."
              >
                <option value="normal">
                  Normal
                </option>
                <option value="bold">
                  Bold
                </option>
                <option value="bolder">
                  Bolder
                </option>
                <option value="lighter">
                  lighter
                </option>
                <option value="100">
                  100
                </option>
                <option value="200">
                  200
                </option>
                <option value="300">
                  300
                </option>
                <option value="400">
                  400
                </option>
                <option value="500">
                  500
                </option>
                <option value="600">
                  600
                </option>
                <option value="700">
                  700
                </option>
                <option value="800">
                  800
                </option>
                <option value="900">
                  900
                </option>
              </select>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Font family</label>
              <select
                v-model="meta.link_styles.subtitle_family"
                disabled
                placeholder="Coming soon..."
                class="p-3 rounded-lg bg-white text-sm text-gray-700"
              />
            </div>
          </div>
          <div class="flex flex-col 3xl:flex-row space-y-4 3xl:space-y-0 3xl:space-x-4 w-full">
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Line height</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.subtitle_height"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="135%"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >%</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
              <div class="flex flex-row overflow-hidden rounded-lg items-center">
                <input
                  v-model="meta.link_styles.subtitle_spacing"
                  min="0"
                  class="flex-grow p-3 bg-white text-sm text-gray-700"
                  placeholder="3px"
                  type="number"
                >
                <span
                  style="height:46px;"
                  class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center"
                >px</span>
              </div>
            </div>
            <div class="flex flex-col mb-4 justify-start w-full">
              <label class="font-semibold text-gray-700 mb-2">Color</label>
              <div class="relative">
                <input
                  v-model="meta.link_styles.subtitle_color"
                  class="p-3 w-full rounded-lg bg-white text-sm text-gray-700"
                  placeholder="e.g. #FFF"
                  type="text"
                >
                <input
                  v-model="meta.link_styles.subtitle_color"
                  placeholder="e.g. #FFF"
                  style="position:absolute;right: 6px;z-index:3;top:12px;"
                  type="color"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Builder",

  props: {
    value: String,
    scope: {
      type: String,
      default: 'Profile'
    },
  },

  data() {
    return {
      importedCSS: this.value as string | null | undefined,
      jsonPackage: {
        children: {
          "img.nc-avatar": {
            attributes: {
              width: null as string | null | undefined,
              height: null as string | null | undefined,
              border: null as string | null | undefined,
              'box-shadow': null as string | null | undefined,
              'border-radius': null as string | null | undefined
            }
          },
          "div.sl-bg": {
            attributes: {
              background: null as string | null | undefined
            }
          },
          body: {
            attributes: {
              background: null as string | null | undefined
            }
          },
          "h1.sl-headline": {
            attributes: {
              'font-size': null as string | null | undefined,
              'font-weight': null as string | null | undefined,
              'font-family': null as string | null | undefined,
              color: null as string | null | undefined,
              'line-height': null as string | null | undefined,
              'letter-spacing': null as string | null | undefined
            }
          },
          "h3.sl-subtitle": {
            attributes: {
              'font-size': null as string | null | undefined,
              'font-weight': null as string | null | undefined,
              'font-family': null as string | null | undefined,
              color: null as string | null | undefined,
              'line-height': null as string | null | undefined,
              'letter-spacing': null as string | null | undefined
            }
          },
          "span.sl-label": {
            attributes: {
              'font-size': null as string | null | undefined,
              'font-weight': null as string | null | undefined,
              'font-family': null as string | null | undefined,
              color: null as string | null | undefined,
              'line-height': null as string | null | undefined,
              'letter-spacing': null as string | null | undefined
            }
          },
          "span.sl-link-subtitle": {
            attributes: {
              'font-size': null as string | null | undefined,
              'font-weight': null as string | null | undefined,
              'font-family': null as string | null | undefined,
              color: null as string | null | undefined,
              'line-height': null as string | null | undefined,
              'letter-spacing': null as string | null | undefined
            }
          },
          "div#user-profile-view section": {
            attributes: {
              'max-width': null as string | null | undefined,
              padding: null as string | null | undefined
            }
          },
          "a div.sl-item.nc-link": {
            attributes: {
              padding: null as string | null | undefined,
              background: null as string | null | undefined,
              'box-shadow': null as string | null | undefined,
              'border-radius': null as string | null | undefined,
              border: null as string | null | undefined
            }
          }
        }
      } as any,
      drawer: {
        page_styles: false,
        typography: false,
        link_styles: false,
        link_typography: false
      },
      meta: {
        page_styles: {
          max_width: null as string | null | undefined,
          padding: null as string | null | undefined,
          avatar_size: null as string | null | undefined,
          avatar_radius: null as string | null | undefined,
          avatar_shadow: null as string | null | undefined,
          avatar_border_type: null as string | null | undefined,
          avatar_border_color: null as string | null | undefined,
          avatar_border_width: null as string | null | undefined,
          background_type: null as string | null | undefined,
          background_image: null as string | null | undefined,
          background_size: null as string | null | undefined,
          background_repeat: null as string | null | undefined,
          background_position: null as string | null | undefined,
          background_color: null as string | null | undefined,
          background_gradient_start: null as string | null | undefined,
          background_gradient_end: null as string | null | undefined,
          background_gradient_direction: null as string | null | undefined
        },
        typography: {
          headline_size: null as string | null | undefined,
          headline_weight: null as string | null | undefined,
          headline_height: null as string | null | undefined,
          headline_spacing: null as string | null | undefined,
          headline_color: null as string | null | undefined,
          headline_family: null as string | null | undefined,
          subtitle_size: null as string | null | undefined,
          subtitle_weight: null as string | null | undefined,
          subtitle_height: null as string | null | undefined,
          subtitle_spacing: null as string | null | undefined,
          subtitle_color: null as string | null | undefined,
          subtitle_family: null as string | null | undefined,
        },
        link_styles: {
          border_type: null as string | null | undefined,
          border_color: null as string | null | undefined,
          border_width: null as string | null | undefined,
          box_shadow: null as string | null | undefined,
          border_radius: null as string | null | undefined,
          background_type: null as string | null | undefined,
          background_image: null as string | null | undefined,
          background_size: null as string | null | undefined,
          background_repeat: null as string | null | undefined,
          background_position: null as string | null | undefined,
          background_color: null as string | null | undefined,
          background_gradient_start: null as string | null | undefined,
          background_gradient_end: null as string | null | undefined,
          background_gradient_direction: null as string | null | undefined,
          headline_size: null as string | null | undefined,
          headline_weight: null as string | null | undefined,
          headline_height: null as string | null | undefined,
          headline_spacing: null as string | null | undefined,
          headline_color: null as string | null | undefined,
          headline_family: null as string | null | undefined,
          subtitle_size: null as string | null | undefined,
          subtitle_weight: null as string | null | undefined,
          subtitle_height: null as string | null | undefined,
          subtitle_spacing: null as string | null | undefined,
          subtitle_color: null as string | null | undefined,
          subtitle_family: null as string | null | undefined,
          padding: null as string | null | undefined
        }
      }
    };
  },

  watch: {
    meta: {
      deep: true,
      handler(): void {
        console.log('Changes');

        // Page Styles
        if (this.meta.page_styles.avatar_size) {
          this.jsonPackage.children["img.nc-avatar"].attributes.width = this.meta.page_styles.avatar_size + 'px';
          this.jsonPackage.children["img.nc-avatar"].attributes.height = this.meta.page_styles.avatar_size + 'px';
        } else {
          delete this.jsonPackage.children["img.nc-avatar"].attributes.width;
          delete this.jsonPackage.children["img.nc-avatar"].attributes.height;
        }
        if (this.meta.page_styles.avatar_radius) {
          this.jsonPackage.children["img.nc-avatar"].attributes['border-radius'] = this.meta.page_styles.avatar_radius + 'px';
        } else {
          delete this.jsonPackage.children["img.nc-avatar"].attributes['border-radius'];
        }
        if (this.meta.page_styles.avatar_shadow) {
          this.jsonPackage.children["img.nc-avatar"].attributes['box-shadow'] = this.meta.page_styles.avatar_shadow;
        }
        if (this.meta.page_styles.avatar_border_type !== 'none' && this.meta.page_styles.avatar_border_color && this.meta.page_styles.avatar_border_width) {
          this.jsonPackage.children["img.nc-avatar"].attributes['border'] = this.meta.page_styles.avatar_border_type + ' ' + this.meta.page_styles.avatar_border_width + 'px ' + this.meta.page_styles.avatar_border_color;
        } else if (this.meta.page_styles.avatar_border_type === 'none') {
          this.jsonPackage.children["img.nc-avatar"].attributes['border'] = 'none';
        }

        // Background type
        if (this.meta.page_styles.background_type) {
          switch (this.meta.page_styles.background_type) {
            case 'solid':
              if (this.meta.page_styles.background_color) {
                this.jsonPackage.children['body'].attributes['background'] = this.meta.page_styles.background_color;
              }
              break;
            case 'image':
              if (this.meta.page_styles.background_image) {
                this.jsonPackage.children['body'].attributes['background'] = 'url(' + this.meta.page_styles.background_image + ')';
              }

              // Background size
              if (this.meta.page_styles.background_size) {
                this.jsonPackage.children['body'].attributes['background-size'] = this.meta.page_styles.background_size;
              }

              // Background position
              if (this.meta.page_styles.background_position) {
                this.jsonPackage.children['body'].attributes['background-position'] = this.meta.page_styles.background_position;
              }

              // Background repeat
              if (this.meta.page_styles.background_repeat) {
                this.jsonPackage.children['body'].attributes['background-repeat'] = this.meta.page_styles.background_repeat;
              }
              break;
            case 'gradient':
              if (this.meta.page_styles.background_gradient_start && this.meta.page_styles.background_gradient_end && this.meta.page_styles.background_gradient_direction) {
                this.jsonPackage.children['body'].attributes['background'] = 'linear-gradient(' + this.meta.page_styles.background_gradient_direction + ',' + this.meta.page_styles.background_gradient_start + ',' + this.meta.page_styles.background_gradient_end + ')';
              }
              break;
            case 'none':
              delete this.jsonPackage.children['body'].attributes['background'];
              break;
          }

          if (this.meta.page_styles.background_type !== 'none') {
            this.jsonPackage.children["div.sl-bg"].attributes.background = 'transparent !important';
          } else {
            delete this.jsonPackage.children["div.sl-bg"].attributes.background;
          }
        } else {
          delete this.jsonPackage.children["body"]?.attributes?.background;
        }

        if (this.meta.page_styles.max_width) {
          this.jsonPackage.children['div#user-profile-view section'].attributes['max-width'] = this.meta.page_styles.max_width + 'px';
        } else {
          delete this.jsonPackage.children['div#user-profile-view section']?.attributes['max-width'];
        }

        if (this.meta.page_styles.padding) {
          this.jsonPackage.children['div#user-profile-view section'].attributes['padding'] = this.meta.page_styles.padding + 'px';
        } else {
          delete this.jsonPackage.children['div#user-profile-view section']?.attributes['padding'];
        }

        // Typography
        if (this.meta.typography.headline_size) {
          this.jsonPackage.children['h1.sl-headline'].attributes['font-size'] = this.meta.typography.headline_size + 'px';
        } else {
          delete this.jsonPackage.children['h1.sl-headline'].attributes['font-size'];
        }
        if (this.meta.typography.headline_weight) {
          this.jsonPackage.children['h1.sl-headline'].attributes['font-weight'] = this.meta.typography.headline_weight;
        } else {
          delete this.jsonPackage.children['h1.sl-headline'].attributes['font-weight'];
        }
        if (this.meta.typography.headline_family) {
          this.jsonPackage.children['h1.sl-headline'].attributes['font-family'] = this.meta.typography.headline_family;
        } else {
          delete this.jsonPackage.children['h1.sl-headline'].attributes['font-family'];
        }
        if (this.meta.typography.headline_spacing) {
          this.jsonPackage.children['h1.sl-headline'].attributes['letter-spacing'] = this.meta.typography.headline_spacing + 'px';
        } else {
          delete this.jsonPackage.children['h1.sl-headline'].attributes['letter-spacing'];
        }
        if (this.meta.typography.headline_height) {
          this.jsonPackage.children['h1.sl-headline'].attributes['line-height'] = this.meta.typography.headline_height + '%';
        } else {
          delete this.jsonPackage.children['h1.sl-headline'].attributes['line-height'];
        }
        if (this.meta.typography.headline_color) {
          this.jsonPackage.children['h1.sl-headline'].attributes['color'] = this.meta.typography.headline_color;
        } else {
          delete this.jsonPackage.children['h1.sl-headline'].attributes['color'];
        }

        // Subtitle
        if (this.meta.typography.subtitle_size) {
          this.jsonPackage.children['h3.sl-subtitle'].attributes['font-size'] = this.meta.typography.subtitle_size + 'px';
        } else {
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['font-size'];
        }
        if (this.meta.typography.subtitle_weight) {
          this.jsonPackage.children['h3.sl-subtitle'].attributes['font-weight'] = this.meta.typography.subtitle_weight;
        } else {
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['font-weight'];
        }
        if (this.meta.typography.subtitle_family) {
          this.jsonPackage.children['h3.sl-subtitle'].attributes['font-family'] = this.meta.typography.subtitle_family;
        } else {
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['font-family'];
        }
        if (this.meta.typography.subtitle_spacing) {
          this.jsonPackage.children['h3.sl-subtitle'].attributes['letter-spacing'] = this.meta.typography.subtitle_spacing + 'px';
        } else {
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['letter-spacing'];
        }
        if (this.meta.typography.subtitle_height) {
          this.jsonPackage.children['h3.sl-subtitle'].attributes['line-height'] = this.meta.typography.subtitle_height + '%';
        } else {
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['line-height'];
        }
        if (this.meta.typography.subtitle_color) {
          this.jsonPackage.children['h3.sl-subtitle'].attributes['color'] = this.meta.typography.subtitle_color;
          this.jsonPackage.children['h3.sl-subtitle'].attributes['opacity'] = 1;
        } else {
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['color'];
          delete this.jsonPackage.children['h3.sl-subtitle'].attributes['opacity'];
        }

        // Link styles

        // Link border
        if (this.meta.link_styles.border_type !== 'none' && this.meta.link_styles.border_color && this.meta.link_styles.border_width) {
          this.jsonPackage.children["a div.sl-item.nc-link"].attributes['border'] = this.meta.link_styles.border_type + ' ' + this.meta.link_styles.border_width + 'px ' + this.meta.link_styles.border_color;
        } else if (this.meta.link_styles.border_type === 'none') {
          this.jsonPackage.children["a div.sl-item.nc-link"].attributes['border'] = 'none';
        }

        // Link box-shadow
        if (this.meta.link_styles.box_shadow) {
          this.jsonPackage.children["a div.sl-item.nc-link"].attributes['box-shadow'] = this.meta.link_styles.box_shadow;
        }

        // Link border-radius
        if (this.meta.link_styles.border_radius) {
          this.jsonPackage.children["a div.sl-item.nc-link"].attributes['border-radius'] = this.meta.link_styles.border_radius + 'px';
        } else {
          delete this.jsonPackage.children["a div.sl-item.nc-link"]?.attributes['border-radius'];
        }

        // Link background
        if (this.meta.link_styles.background_type) {
          switch (this.meta.link_styles.background_type) {
            case 'solid':
              if (this.meta.link_styles.background_color) {
                this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'] = this.meta.link_styles.background_color;
              }
              break;
            case 'image':
              if (this.meta.link_styles.background_image) {
                this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'] = 'url(' + this.meta.link_styles.background_image + ')';
              }

              // Background size
              if (this.meta.link_styles.background_size) {
                this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-size'] = this.meta.link_styles.background_size;
              }

              // Background position
              if (this.meta.link_styles.background_position) {
                this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-position'] = this.meta.link_styles.background_position;
              }

              // Background repeat
              if (this.meta.link_styles.background_repeat) {
                this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-repeat'] = this.meta.link_styles.background_repeat;
              }
              break;
            case 'gradient':
              if (this.meta.link_styles.background_gradient_start && this.meta.link_styles.background_gradient_end && this.meta.link_styles.background_gradient_direction) {
                this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'] = 'linear-gradient(' + this.meta.link_styles.background_gradient_direction + ',' + this.meta.link_styles.background_gradient_start + ',' + this.meta.link_styles.background_gradient_end + ')';
              }
              break;
            case 'none':
              delete this.jsonPackage.children['a div.sl-item.nc-link']?.attributes['background'];
              break;
          }
        } else {
          delete this.jsonPackage.children["a div.sl-item.nc-link"]?.attributes?.background;
        }

        // Link padding
        console.log(this.jsonPackage.children);
        if (this.meta.link_styles.padding) {
          this.jsonPackage.children["a div.sl-item.nc-link"].attributes['padding'] = this.meta.link_styles.padding + 'px';
        } else {
          delete this.jsonPackage.children["a div.sl-item.nc-link"]?.attributes['padding'];
        }

        // Link typography
        if (this.meta.link_styles.headline_size) {
          this.jsonPackage.children['span.sl-label'].attributes['font-size'] = this.meta.link_styles.headline_size + 'px';
        } else {
          delete this.jsonPackage.children['span.sl-label']?.attributes['font-size'];
        }
        if (this.meta.link_styles.headline_weight) {
          this.jsonPackage.children['span.sl-label'].attributes['font-weight'] = this.meta.link_styles.headline_weight;
        } else {
          delete this.jsonPackage.children['span.sl-label']?.attributes['font-weight'];
        }
        if (this.meta.link_styles.headline_family) {
          this.jsonPackage.children['span.sl-label'].attributes['font-family'] = this.meta.link_styles.headline_family;
        } else {
          delete this.jsonPackage.children['span.sl-label']?.attributes['font-family'];
        }
        if (this.meta.link_styles.headline_spacing) {
          this.jsonPackage.children['span.sl-label'].attributes['letter-spacing'] = this.meta.link_styles.headline_spacing + 'px';
        } else {
          delete this.jsonPackage.children['span.sl-label']?.attributes['letter-spacing'];
        }
        if (this.meta.link_styles.headline_height) {
          this.jsonPackage.children['span.sl-label'].attributes['line-height'] = this.meta.link_styles.headline_height + '%';
        } else {
          delete this.jsonPackage.children['span.sl-label']?.attributes['line-height'];
        }
        if (this.meta.link_styles.headline_color) {
          this.jsonPackage.children['span.sl-label'].attributes['color'] = this.meta.link_styles.headline_color;
        } else {
          delete this.jsonPackage.children['span.sl-label']?.attributes['color'];
        }

        // Subtitle
        if (this.meta.link_styles.subtitle_size) {
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-size'] = this.meta.link_styles.subtitle_size + 'px';
        } else {
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-size'];
        }
        if (this.meta.link_styles.subtitle_weight) {
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-weight'] = this.meta.link_styles.subtitle_weight;
        } else {
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-weight'];
        }
        if (this.meta.link_styles.subtitle_family) {
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-family'] = this.meta.link_styles.subtitle_family;
        } else {
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-family'];
        }
        if (this.meta.link_styles.subtitle_spacing) {
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['letter-spacing'] = this.meta.link_styles.subtitle_spacing + 'px';
        } else {
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['letter-spacing'];
        }
        if (this.meta.link_styles.subtitle_height) {
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['line-height'] = this.meta.link_styles.subtitle_height + '%';
        } else {
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['line-height'];
        }
        if (this.meta.link_styles.subtitle_color) {
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['color'] = this.meta.link_styles.subtitle_color;
          this.jsonPackage.children['span.sl-link-subtitle'].attributes['opacity'] = 1;
        } else {
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['color'];
          delete this.jsonPackage.children['span.sl-link-subtitle'].attributes['opacity'];
        }

        this.$emit('input', this.$transform.toCSS(this.jsonPackage));
      }
    }
  },

  mounted(): void {
    if (this.importedCSS) {
      console.log(this.$transform.toJSON(this.importedCSS));
    }

    if (this.importedCSS) {
      this.jsonPackage = this.$transform.toJSON(this.importedCSS);

      // Safety
      if (!this.jsonPackage.children['div#user-profile-view section']) {
        this.jsonPackage.children['div#user-profile-view section'] = {
          attributes: {
            'max-width': null,
            padding: null
          }
        };
      }

      if (!this.jsonPackage.children['img.nc-avatar']) {
        this.jsonPackage.children['img.nc-avatar'] = {
          attributes: {
            width: null,
            height: null,
            border: null,
            'box-shadow': null,
            'border-radius': null
          }
        };
      }

      if (!this.jsonPackage.children['div.sl-bg']) {
        this.jsonPackage.children['div.sl-bg'] = {
          attributes: {
            background: null
          }
        };
      }

      if (!this.jsonPackage.children['body']) {
        this.jsonPackage.children['body'] = {
          attributes: {
            background: null,
            'background-position': null,
            'background-repeat': null,
            'background-size': null
          }
        };
      }

      if (!this.jsonPackage.children['h1.sl-headline']) {
        this.jsonPackage.children['h1.sl-headline'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            color: null,
          }
        };
      }

      if (!this.jsonPackage.children['h3.sl-subtitle']) {
        this.jsonPackage.children['h3.sl-subtitle'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            color: null,
          }
        };
      }

      if (!this.jsonPackage.children['span.sl-label']) {
        this.jsonPackage.children['span.sl-label'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            color: null,
          }
        };
      }

      if (!this.jsonPackage.children['span.sl-link-subtitle']) {
        this.jsonPackage.children['span.sl-link-subtitle'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            color: null,
          }
        };
      }

      if (!this.jsonPackage.children['a div.sl-item.nc-link']) {
        this.jsonPackage.children['a div.sl-item.nc-link'] = {
          attributes: {
            'border-radius': null,
            border: null,
            background: null,
            padding: null
          }
        };
      }

      if (!this.jsonPackage.children['div#user-profile-view section']) {
        this.jsonPackage.children['div#user-profile-view section'] = {
          attributes: {
            'max-width': null,
            padding: null
          }
        };
      }

      // Avatar height
      if (this.jsonPackage.children["img.nc-avatar"].attributes.width) {
        this.meta.page_styles.avatar_size = this.jsonPackage.children["img.nc-avatar"].attributes.width.split('px')[0];
      }
      // Avatar border radius
      if (this.jsonPackage.children["img.nc-avatar"].attributes['border-radius']) {
        this.meta.page_styles.avatar_radius = this.jsonPackage.children["img.nc-avatar"].attributes['border-radius'].split('px')[0];
      }
      // Avatar border
      if (this.jsonPackage.children["img.nc-avatar"].attributes.border && this.jsonPackage.children["img.nc-avatar"].attributes.border !== 'none' && this.jsonPackage.children["img.nc-avatar"].attributes.border.split(' ').length > 2) {
        const border = this.jsonPackage.children["img.nc-avatar"].attributes.border.split(' ');
        // Avatar border style
        this.meta.page_styles.avatar_border_type = border[0];
        // Avatar border width
        this.meta.page_styles.avatar_border_width = border[1].split('px')[0];
        // Avatar border color
        this.meta.page_styles.avatar_border_color = border[2];
      } else if (!this.jsonPackage.children["img.nc-avatar"].attributes.border) {
        this.meta.page_styles.avatar_border_type = 'none';
      }
      // Avatar box-shadow
      if (this.jsonPackage.children["img.nc-avatar"].attributes['box-shadow']) {
        this.meta.page_styles.avatar_shadow = this.jsonPackage.children["img.nc-avatar"].attributes['box-shadow'];
      }

      // Page background
      if (this.jsonPackage.children['body'].attributes['background']) {
        if (this.jsonPackage.children['body'].attributes['background'].includes('linear-gradient')) {
          // Is linear gradient
          this.meta.page_styles.background_type = 'gradient';
          const gradient = this.jsonPackage.children['body'].attributes['background'].replace('linear-gradient(', '').replace(')', '').split(',');
          if (gradient.length === 3) {
            this.meta.page_styles.background_gradient_direction = gradient[0];
            this.meta.page_styles.background_gradient_start = gradient[1];
            this.meta.page_styles.background_gradient_end = gradient[2];
          } else {
            delete this.jsonPackage.children['body'].attributes['background'];
          }
        } else if (this.jsonPackage.children['body'].attributes['background'].includes('url')) {
          // Is image
          this.meta.page_styles.background_type = 'image';
          this.meta.page_styles.background_image = this.jsonPackage.children['body'].attributes['background'].replace('url(', '').replace(')', '');
          // Image size
          if (this.jsonPackage.children['body'].attributes['background-size']) {
            this.meta.page_styles.background_size = this.jsonPackage.children['body'].attributes['background-size'];
          }
          // Image position
          if (this.jsonPackage.children['body'].attributes['background-position']) {
            this.meta.page_styles.background_position = this.jsonPackage.children['body'].attributes['background-position'];
          }
          // Image repeat
          if (this.jsonPackage.children['body'].attributes['background-repeat']) {
            this.meta.page_styles.background_repeat = this.jsonPackage.children['body'].attributes['background-repeat'];
          }
        } else {
          // Is solid color
          this.meta.page_styles.background_type = 'solid';
          this.meta.page_styles.background_color = this.jsonPackage.children['body'].attributes['background'];
        }
      }
      // Typography
      if (this.jsonPackage.children['h1.sl-headline'].attributes['font-size']) {
        this.meta.typography.headline_size = this.jsonPackage.children['h1.sl-headline'].attributes['font-size'].replace('px', '');
      }
      if (this.jsonPackage.children['h1.sl-headline'].attributes['font-weight']) {
        this.meta.typography.headline_weight = this.jsonPackage.children['h1.sl-headline'].attributes['font-weight'];
      }
      if (this.jsonPackage.children['h1.sl-headline'].attributes['font-family']) {
        this.meta.typography.headline_family = this.jsonPackage.children['h1.sl-headline'].attributes['font-family'];
      }
      if (this.jsonPackage.children['h1.sl-headline'].attributes['line-height']) {
        this.meta.typography.headline_height = this.jsonPackage.children['h1.sl-headline'].attributes['line-height'].replace('%', '');
      }
      if (this.jsonPackage.children['h1.sl-headline'].attributes['letter-spacing']) {
        this.meta.typography.headline_spacing = this.jsonPackage.children['h1.sl-headline'].attributes['letter-spacing'].replace('px', '');
      }
      if (this.jsonPackage.children['h1.sl-headline'].attributes['color']) {
        this.meta.typography.headline_color = this.jsonPackage.children['h1.sl-headline'].attributes['color'];
      }

      if (this.jsonPackage.children['h3.sl-subtitle'].attributes['font-size']) {
        this.meta.typography.subtitle_size = this.jsonPackage.children['h3.sl-subtitle'].attributes['font-size'].replace('px', '');
      }
      if (this.jsonPackage.children['h3.sl-subtitle'].attributes['font-weight']) {
        this.meta.typography.subtitle_weight = this.jsonPackage.children['h3.sl-subtitle'].attributes['font-weight'];
      }
      if (this.jsonPackage.children['h3.sl-subtitle'].attributes['font-family']) {
        this.meta.typography.subtitle_family = this.jsonPackage.children['h3.sl-subtitle'].attributes['font-family'];
      }
      if (this.jsonPackage.children['h3.sl-subtitle'].attributes['line-height']) {
        this.meta.typography.subtitle_height = this.jsonPackage.children['h3.sl-subtitle'].attributes['line-height'].replace('%', '');
      }
      if (this.jsonPackage.children['h3.sl-subtitle'].attributes['letter-spacing']) {
        this.meta.typography.subtitle_spacing = this.jsonPackage.children['h3.sl-subtitle'].attributes['letter-spacing'].replace('px', '');
      }
      if (this.jsonPackage.children['h3.sl-subtitle'].attributes['color']) {
        this.meta.typography.subtitle_color = this.jsonPackage.children['h3.sl-subtitle'].attributes['color'];
      }

      // Link border
      if (this.jsonPackage.children["a div.sl-item.nc-link"].attributes.border && this.jsonPackage.children["a div.sl-item.nc-link"].attributes.border !== 'none' && this.jsonPackage.children["a div.sl-item.nc-link"].attributes.border.split(' ').length > 2) {
        const border = this.jsonPackage.children["a div.sl-item.nc-link"].attributes.border.split(' ');
        // Avatar border style
        this.meta.link_styles.border_type = border[0];
        // Avatar border width
        this.meta.link_styles.border_width = border[1].split('px')[0];
        // Avatar border color
        this.meta.link_styles.border_color = border[2];
      } else if (this.jsonPackage.children["a div.sl-item.nc-link"].attributes.border === 'none') {
        this.meta.link_styles.border_type = 'none';
      }

      // Link box-shadow
      if (this.jsonPackage.children["a div.sl-item.nc-link"].attributes['box-shadow']) {
        this.meta.link_styles.box_shadow = this.jsonPackage.children["a div.sl-item.nc-link"].attributes['box-shadow'];
      }

      // Link border radius
      if (this.jsonPackage.children["a div.sl-item.nc-link"].attributes['border-radius']) {
        this.meta.link_styles.border_radius = this.jsonPackage.children["a div.sl-item.nc-link"].attributes['border-radius'].replace('px', '');
      }

      // Link background
      if (this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background']) {
        if (this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'].includes('linear-gradient')) {
          // Is linear gradient
          this.meta.link_styles.background_type = 'gradient';
          const gradient = this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'].replace('linear-gradient(', '').replace(')', '').split(',');
          if (gradient.length === 3) {
            this.meta.link_styles.background_gradient_direction = gradient[0];
            this.meta.link_styles.background_gradient_start = gradient[1];
            this.meta.link_styles.background_gradient_end = gradient[2];
          } else {
            delete this.jsonPackage.children['a div.sl-item.nc-link']?.attributes['background'];
          }
        } else if (this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'].includes('url')) {
          // Is image
          this.meta.link_styles.background_type = 'image';
          this.meta.link_styles.background_image = this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background'].replace('url(', '').replace(')', '');
          // Image size
          if (this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-size']) {
            this.meta.link_styles.background_size = this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-size'];
          }
          // Image position
          if (this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-position']) {
            this.meta.link_styles.background_position = this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-position'];
          }
          // Image repeat
          if (this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-repeat']) {
            this.meta.link_styles.background_repeat = this.jsonPackage.children['a div.sl-item.nc-link'].attributes['background-repeat'];
          }
        } else {
          // Is solid color
          this.meta.link_styles.background_type = 'solid';
          this.meta.link_styles.background_color = this.jsonPackage.children['body'].attributes['background'];
        }
      }

      // Link Typography
      if (this.jsonPackage.children['span.sl-label'].attributes['font-size']) {
        this.meta.link_styles.headline_size = this.jsonPackage.children['span.sl-label'].attributes['font-size'].replace('px', '');
      }
      if (this.jsonPackage.children['span.sl-label'].attributes['font-weight']) {
        this.meta.link_styles.headline_weight = this.jsonPackage.children['span.sl-label'].attributes['font-weight'];
      }
      if (this.jsonPackage.children['span.sl-label'].attributes['font-family']) {
        this.meta.link_styles.headline_family = this.jsonPackage.children['span.sl-label'].attributes['font-family'];
      }
      if (this.jsonPackage.children['span.sl-label'].attributes['line-height']) {
        this.meta.link_styles.headline_height = this.jsonPackage.children['span.sl-label'].attributes['line-height'].replace('%', '');
      }
      if (this.jsonPackage.children['span.sl-label'].attributes['letter-spacing']) {
        this.meta.link_styles.headline_spacing = this.jsonPackage.children['span.sl-label'].attributes['letter-spacing'].replace('px', '');
      }
      if (this.jsonPackage.children['span.sl-label'].attributes['color']) {
        this.meta.link_styles.headline_color = this.jsonPackage.children['span.sl-label'].attributes['color'];
      }

      if (this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-size']) {
        this.meta.link_styles.subtitle_size = this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-size'].replace('px', '');
      }
      if (this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-weight']) {
        this.meta.link_styles.subtitle_weight = this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-weight'];
      }
      if (this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-family']) {
        this.meta.link_styles.subtitle_family = this.jsonPackage.children['span.sl-link-subtitle'].attributes['font-family'];
      }
      if (this.jsonPackage.children['span.sl-link-subtitle'].attributes['line-height']) {
        this.meta.link_styles.subtitle_height = this.jsonPackage.children['span.sl-link-subtitle'].attributes['line-height'].replace('%', '');
      }
      if (this.jsonPackage.children['span.sl-link-subtitle'].attributes['letter-spacing']) {
        this.meta.link_styles.subtitle_spacing = this.jsonPackage.children['span.sl-link-subtitle'].attributes['letter-spacing'].replace('px', '');
      }
      if (this.jsonPackage.children['span.sl-link-subtitle'].attributes['color']) {
        this.meta.link_styles.subtitle_color = this.jsonPackage.children['span.sl-link-subtitle'].attributes['color'];
      }

      // Link styles
      if (this.jsonPackage.children['a div.sl-item.nc-link']) {
        // something in the future
      }

      // Page styles, section
      if (this.jsonPackage.children['div#user-profile-view section']) {
        if (this.jsonPackage.children['div#user-profile-view section'].attributes['max-width']) {
          this.meta.page_styles.max_width = this.jsonPackage.children['div#user-profile-view section'].attributes['max-width'].replace('px', '');
        }
        if (this.jsonPackage.children['div#user-profile-view section'].attributes['padding']) {
          this.meta.page_styles.padding = this.jsonPackage.children['div#user-profile-view section'].attributes['padding'].replace('px', '');
        }
      }

      // End imported CSS
    }
  }
});
</script>
