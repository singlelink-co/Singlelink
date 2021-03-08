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
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Page</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Max width</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.page_styles.max_width" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Padding</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.page_styles.padding" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
              </div>
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
              <span class="text-gray-800 font-semibold py-3 my-3 border border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Background</span>
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
                      <div class="relative w-full">
                        <input v-model="meta.page_styles.background_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.page_styles.background_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
                <div v-if="meta.page_styles.background_type=='image'" class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background image URL</label>
                      <input v-model="meta.page_styles.background_image" type="text" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. https://singlelink.co/og-image.png"/>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full" v-if="meta.page_styles.background_type=='image'">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background size</label>
                      <select v-model="meta.page_styles.background_size" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                        <option value="100% 100%">Stretch</option>
                        <option value="auto">Auto</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background position</label>
                      <select v-model="meta.page_styles.background_position" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="top left">Top left</option>
                        <option value="top center">Top center</option>
                        <option value="top right">Top right</option>
                        <option value="center left">Center left</option>
                        <option value="center center">Center</option>
                        <option value="center right">Center right</option>
                        <option value="bottom left">Bottom left</option>
                        <option value="bottom center">Bottom center</option>
                        <option value="bottom right">Bottom right</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background repeat</label>
                      <select v-model="meta.page_styles.background_repeat" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="no-repeat">No repeat</option>
                        <option value="repeat-x">Repeat X</option>
                        <option value="repeat-y">Repeat Y</option>
                        <option value="repeat">Repeat X & Y</option>
                      </select>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full" v-if="meta.page_styles.background_type=='gradient'">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Start color</label>
                      <div class="relative w-full">
                        <input v-model="meta.page_styles.background_gradient_start" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.page_styles.background_gradient_start" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">End color</label>
                      <div class="relative w-full">
                        <input v-model="meta.page_styles.background_gradient_end" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.page_styles.background_gradient_end" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Direction</label>
                      <select v-model="meta.page_styles.background_gradient_direction" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="to top">To top</option>
                        <option value="to right">To right</option>
                        <option value="to bottom">To bottom</option>
                        <option value="to left">To left</option>
                      </select>
                </div>
              </div>
            </div>
            <!-- End Drawer -->
          </div>
          <div class="flex flex-col justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center">
            <div class="w-full flex flex-col lg:flex-row justify-start lg:justify-between items-start space-y-2 lg:space-y-0 lg:items-center">
              <div class="flex flex-col">
              <span class="text-gray-800 font-semibold">Typography</span>
              <span class="text-sm text-gray-500 font-medium">Customize your fonts, font size, font weight, and more.</span>
              </div>
              <div @click="drawer.typography = !drawer.typography" class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"><span v-if="!drawer.typography">Expand</span><span v-if="drawer.typography">Collapse</span></div>
            </div>       
            <!-- Drawer -->
            <div v-if="drawer.typography" class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200">
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Headline</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font size</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.typography.headline_size" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font weight</label>
                    <select v-model="meta.typography.headline_weight" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                        <option value="lighter">lighter</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                        <option value="800">800</option>
                        <option value="900">900</option>
                    </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font family</label>
                    <select disabled placeholder="Coming soon..." v-model="meta.typography.headline_family" class="p-3 rounded-lg bg-white text-sm text-gray-700">
                    </select>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Line height</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.typography.headline_height" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="135%" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">%</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.typography.headline_spacing" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="3px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Color</label>
                    <div class="relative">
                  <input v-model="meta.typography.headline_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                  <input v-model="meta.typography.headline_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                </div>
                </div>
              </div>
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Subtitle</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font size</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.typography.subtitle_size" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font weight</label>
                    <select v-model="meta.typography.subtitle_weight" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                        <option value="lighter">lighter</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                        <option value="800">800</option>
                        <option value="900">900</option>
                    </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font family</label>
                    <select disabled placeholder="Coming soon..." v-model="meta.typography.subtitle_family" class="p-3 rounded-lg bg-white text-sm text-gray-700">
                    </select>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Line height</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.typography.subtitle_height" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="135%" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">%</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.typography.subtitle_spacing" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="3px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Color</label>
                    <div class="relative">
                  <input v-model="meta.typography.subtitle_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                  <input v-model="meta.typography.subtitle_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center w-full p-6 border border-t-0 border-l-0 border-r-0 border-gray-200 items-center">
            <div class="w-full flex flex-col lg:flex-row justify-start lg:justify-between items-start space-y-2 lg:space-y-0 lg:items-center">
              <div class="flex flex-col">
              <span class="text-gray-800 font-semibold">Link styles</span>
              <span class="text-sm text-gray-500 font-medium">Customize your default styles for link items.</span>
              </div>
              <div @click="drawer.link_styles = !drawer.link_styles" class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"><span v-if="!drawer.link_styles">Expand</span><span v-if="drawer.link_styles">Collapse</span></div>
            </div>
            <!-- Drawer -->
            <div v-if="drawer.link_styles" class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200">
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Link block styles</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Padding</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.padding" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Border radius</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.border_radius" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Border style</label>
                      <select v-model="meta.link_styles.border_type" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="none">No border</option>
                        <option value="solid">Solid border</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Border width (px)</label>
                      <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.border_width" class="p-3 bg-white text-sm text-gray-700" placeholder="4px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Border color</label>
                      <div class="relative">
                        <input v-model="meta.link_styles.border_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.link_styles.border_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Box shadow</label>
                      <select v-model="meta.link_styles.box_shadow" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="none">None</option>
                        <option value="0 1px 3px 0 rgba(0,0,0,.15)">Small</option>
                        <option value="0 2px 5px 0 rgba(0,0,0,.2)">Medium</option>
                        <option value="0 2px 15px 0 rgba(0,0,0,.12), 0 2px 5px 0 rgba(0,0,0,.25)">Large</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full" >
                      <label class="font-semibold text-gray-700 mb-2">Background type</label>
                      <select v-model="meta.link_styles.background_type" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="none">No background</option>
                        <option value="solid">Solid color</option>
                        <option value="image">Image</option>
                        <option value="gradient">Gradient</option>
                      </select>
                </div>
                <div v-if="meta.link_styles.background_type=='solid'" class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background color</label>
                      <div class="relative w-full">
                        <input v-model="meta.link_styles.background_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.link_styles.background_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
                <div v-if="meta.link_styles.background_type=='image'" class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background image URL</label>
                      <input v-model="meta.link_styles.background_image" type="text" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. https://singlelink.co/og-image.png"/>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full" v-if="meta.link_styles.background_type=='image'">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background size</label>
                      <select v-model="meta.link_styles.background_size" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                        <option value="100% 100%">Stretch</option>
                        <option value="auto">Auto</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background position</label>
                      <select v-model="meta.link_styles.background_position" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="top left">Top left</option>
                        <option value="top center">Top center</option>
                        <option value="top right">Top right</option>
                        <option value="center left">Center left</option>
                        <option value="center center">Center</option>
                        <option value="center right">Center right</option>
                        <option value="bottom left">Bottom left</option>
                        <option value="bottom center">Bottom center</option>
                        <option value="bottom right">Bottom right</option>
                      </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Background repeat</label>
                      <select v-model="meta.link_styles.background_repeat" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="no-repeat">No repeat</option>
                        <option value="repeat-x">Repeat X</option>
                        <option value="repeat-y">Repeat Y</option>
                        <option value="repeat">Repeat X & Y</option>
                      </select>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full" v-if="meta.link_styles.background_type=='gradient'">
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Start color</label>
                      <div class="relative w-full">
                        <input v-model="meta.link_styles.background_gradient_start" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.link_styles.background_gradient_start" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">End color</label>
                      <div class="relative w-full">
                        <input v-model="meta.link_styles.background_gradient_end" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                        <input v-model="meta.link_styles.background_gradient_end" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                      </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                      <label class="font-semibold text-gray-700 mb-2">Direction</label>
                      <select v-model="meta.link_styles.background_gradient_direction" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="to top">To top</option>
                        <option value="to right">To right</option>
                        <option value="to bottom">To bottom</option>
                        <option value="to left">To left</option>
                      </select>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-center w-full p-6 border-t-0 border-l-0 border-r-0 border-gray-200 items-center">
            <div class="w-full flex flex-col lg:flex-row justify-start lg:justify-between items-start space-y-2 lg:space-y-0 lg:items-center">
              <div class="flex flex-col">
              <span class="text-gray-800 font-semibold">Link typography</span>
              <span class="text-sm text-gray-500 font-medium">Customize the default typography for link items.</span>
              </div>
              <div @click="drawer.link_typography = !drawer.link_typography" class="py-2 px-4 text-sm rounded-lg border border-indigo-600 text-indigo-500 bg-indigo-200 font-medium text-center hover:bg-indigo-300 cursor-pointer"><span v-if="!drawer.link_typography">Expand</span><span v-if="drawer.link_typography">Collapse</span></div>
            </div>
            <!-- Drawer -->
            <div v-if="drawer.link_typography" class="w-full flex flex-col items-start justify-start mt-6 p-6 border border-l-0 border-r-0 border-b-0 border-gray-200">
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Link headline</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font size</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.headline_size" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font weight</label>
                    <select v-model="meta.link_styles.headline_weight" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                        <option value="lighter">lighter</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                        <option value="800">800</option>
                        <option value="900">900</option>
                    </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font family</label>
                    <select disabled placeholder="Coming soon..." v-model="meta.link_styles.headline_family" class="p-3 rounded-lg bg-white text-sm text-gray-700">
                    </select>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Line height</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.headline_height" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="135%" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">%</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.headline_spacing" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="3px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Color</label>
                    <div class="relative">
                  <input v-model="meta.link_styles.headline_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                  <input v-model="meta.link_styles.headline_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                </div>
                </div>
              </div>
              <span class="text-gray-800 font-semibold pb-3 mb-3 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full text-left justify-start flex flex-row">Link subtitle</span>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font size</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.subtitle_size" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="70px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font weight</label>
                    <select v-model="meta.link_styles.subtitle_weight" class="p-3 rounded-lg bg-white text-sm text-gray-700" placeholder="Select one...">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                        <option value="lighter">lighter</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                        <option value="800">800</option>
                        <option value="900">900</option>
                    </select>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Font family</label>
                    <select disabled placeholder="Coming soon..." v-model="meta.link_styles.subtitle_family" class="p-3 rounded-lg bg-white text-sm text-gray-700">
                    </select>
                </div>
              </div>
              <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Line height</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.subtitle_height" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="135%" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">%</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Letter spacing</label>
                    <div class="flex flex-row overflow-hidden rounded-lg items-center">
                        <input min="0" v-model="meta.link_styles.subtitle_spacing" class="flex-grow p-3 bg-white text-sm text-gray-700" placeholder="3px" type="number"/>
                        <span style="height:46px;" class="text-sm text-gray-600 font-medium bg-gray-200 shadow-inner p-3 leading-none flex items-center justify-center">px</span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold text-gray-700 mb-2">Color</label>
                    <div class="relative">
                  <input v-model="meta.link_styles.subtitle_color" class="p-3 w-full rounded-lg bg-white text-sm text-gray-700" placeholder="e.g. #FFF" type="text">
                  <input v-model="meta.link_styles.subtitle_color" placeholder="e.g. #FFF" style="position:absolute;right: 6px;z-index:3;top:11.5px;" type="color"/>
                </div>
                </div>
              </div>
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
              "div.sl-bg": {
                attributes: {
                  background: null
                }
              },
              "body": {
                attributes: {
                  background: null
                }
              },
              "h1.sl-headline": {
                attributes: {
                  'font-size': null,
                  'font-weight': null,
                  'font-family': null,
                  'color': null,
                  'line-height': null,
                  'letter-spacing': null
                }
              },
              "h3.sl-subtitle": {
                attributes: {
                  'font-size': null,
                  'font-weight': null,
                  'font-family': null,
                  'color': null,
                  'line-height': null,
                  'letter-spacing': null
                }
              },
              "span.sl-label": {
                attributes: {
                  'font-size': null,
                  'font-weight': null,
                  'font-family': null,
                  'color': null,
                  'line-height': null,
                  'letter-spacing': null
                }
              },
              "span.sl-link-subtitle": {
                attributes: {
                  'font-size': null,
                  'font-weight': null,
                  'font-family': null,
                  'color': null,
                  'line-height': null,
                  'letter-spacing': null
                }
              },
              "div#user-profile-view section": {
                attributes: {
                  'max-width': null,
                  padding: null
                }
              },
              "a div.sl-item.nc-link": {
                attributes: {
                  padding: null,
                  background: null,
                  'box-shadow': null,
                  'border-radius': null,
                  border: null
                }
              }
            }
          },
          drawer: {
            page_styles: false,
            typography: false,
            link_styles: false,
            link_typography: false
          },
          meta: {
            page_styles: {
              max_width: null,
              padding: null,
              avatar_size: null,
              avatar_radius: null,
              avatar_shadow: null,
              avatar_border_type: null,
              avatar_border_color: null,
              avatar_border_width: null,
              background_type: null,
              background_image: null,
              background_size: null,
              background_repeat: null,
              background_position: null,
              background_color: null,
              background_gradient_start: null,
              background_gradient_end: null,
              background_gradient_direction: null
            },
            typography: {
              headline_size: null,
              headline_weight: null,
              headline_height: null,
              headline_spacing: null,
              headline_color: null,
              headline_family: null,
              subtitle_size: null,
              subtitle_weight: null,
              subtitle_height: null,
              subtitle_spacing: null,
              subtitle_color: null,
              subtitle_family: null,     
            },
            link_styles: {
              border_type: null,
              border_color: null,
              border_width: null,
              box_shadow: null,
              border_radius: null,
              background_type: null,
              background_image: null,
              background_size: null,
              background_repeat: null,
              background_position: null,
              background_color: null,
              background_gradient_start: null,
              background_gradient_end: null,
              background_gradient_direction: null,
              headline_size: null,
              headline_weight: null,
              headline_height: null,
              headline_spacing: null,
              headline_color: null,
              headline_family: null,
              subtitle_size: null,
              subtitle_weight: null,
              subtitle_height: null,
              subtitle_spacing: null,
              subtitle_color: null,
              subtitle_family: null,
              padding: null
            }
          }
        }
    },
    mounted() {
      console.log('Input');
      console.log(this.imported_css);
      console.log('to JSON');
      console.log(this.$transform.toJSON(this.imported_css));
      if(this.imported_css) {
        this.JSON_pkg = this.$transform.toJSON(this.imported_css);

        // Safety
        if(!this.JSON_pkg.children['div#user-profile-view section']) this.JSON_pkg.children['div#user-profile-view section'] = {
          attributes: {
            'max-width': null,
            padding: null
          }
        };

        if(!this.JSON_pkg.children['img.nc-avatar']) this.JSON_pkg.children['img.nc-avatar'] = {
          attributes: {
                  width: null,
                  height: null,
                  border: null,
                  'box-shadow': null,
                  'border-radius': null
          }
        };

        if(!this.JSON_pkg.children['div.sl-bg']) this.JSON_pkg.children['div.sl-bg'] = {
          attributes: {
            background: null
          }
        };

        if(!this.JSON_pkg.children['body']) this.JSON_pkg.children['body'] = {
          attributes: {
            background: null,
            'background-position': null,
            'background-repeat': null,
            'background-size': null
          }
        };

        if(!this.JSON_pkg.children['h1.sl-headline']) this.JSON_pkg.children['h1.sl-headline'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            'color': null,
          }
        };

        if(!this.JSON_pkg.children['h3.sl-subtitle']) this.JSON_pkg.children['h3.sl-subtitle'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            'color': null,
          }
        };

        if(!this.JSON_pkg.children['span.sl-label']) this.JSON_pkg.children['span.sl-label'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            'color': null,
          }
        };

        if(!this.JSON_pkg.children['span.sl-link-subtitle']) this.JSON_pkg.children['span.sl-link-subtitle'] = {
          attributes: {
            'line-height': null,
            'letter-spacing': null,
            'font-size': null,
            'font-weight': null,
            'font-family': null,
            'color': null,
          }
        };

        if(!this.JSON_pkg.children['a div.sl-item.nc-link']) this.JSON_pkg.children['a div.sl-item.nc-link'] = {
          attributes: {
            'border-radius': null,
            'border': null,
            'background': null,
            'padding': null
          }
        };

        if(!this.JSON_pkg.children['div#user-profile-view section']) this.JSON_pkg.children['div#user-profile-view section'] = {
          attributes: {
            'max-width': null,
            'padding': null
          }
        };


        // Avatar height
        if(this.JSON_pkg.children["img.nc-avatar"].attributes.width) this.meta.page_styles.avatar_size = this.JSON_pkg.children["img.nc-avatar"].attributes.width.split('px')[0];
        // Avatar border radius
        if(this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius']) this.meta.page_styles.avatar_radius = this.JSON_pkg.children["img.nc-avatar"].attributes['border-radius'].split('px')[0];
        // Avatar border
        if(this.JSON_pkg.children["img.nc-avatar"].attributes.border && this.JSON_pkg.children["img.nc-avatar"].attributes.border != 'none' && this.JSON_pkg.children["img.nc-avatar"].attributes.border.split(' ').length > 2) {
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
        
        // Page background
        if(this.JSON_pkg.children['body'].attributes['background']) {
          if(this.JSON_pkg.children['body'].attributes['background'].indexOf('linear-gradient') > -1) {
            // Is linear gradient
            this.meta.page_styles.background_type = 'gradient';
            let gradient = this.JSON_pkg.children['body'].attributes['background'].replace('linear-gradient(','').replace(')','').split(',');
            if(gradient.length == 3) {
              this.meta.page_styles.background_gradient_direction = gradient[0];
              this.meta.page_styles.background_gradient_start = gradient[1];
              this.meta.page_styles.background_gradient_end = gradient[2];
            } else {
              delete this.JSON_pkg.children['body'].attributes['background'];
            }
          } else if(this.JSON_pkg.children['body'].attributes['background'].indexOf('url') > -1) {
            // Is image
            this.meta.page_styles.background_type = 'image';
            this.meta.page_styles.background_image = this.JSON_pkg.children['body'].attributes['background'].replace('url(','').replace(')','');
            // Image size
            if(this.JSON_pkg.children['body'].attributes['background-size']) this.meta.page_styles.background_size = this.JSON_pkg.children['body'].attributes['background-size'];
            // Image position
            if(this.JSON_pkg.children['body'].attributes['background-position']) this.meta.page_styles.background_position = this.JSON_pkg.children['body'].attributes['background-position'];
            // Image repeat
            if(this.JSON_pkg.children['body'].attributes['background-repeat']) this.meta.page_styles.background_repeat = this.JSON_pkg.children['body'].attributes['background-repeat'];
          } else {
            // Is solid color
            this.meta.page_styles.background_type = 'solid';
            this.meta.page_styles.background_color = this.JSON_pkg.children['body'].attributes['background'];
          }
        }
        // Typography
        if(this.JSON_pkg.children['h1.sl-headline'].attributes['font-size']) this.meta.typography.headline_size = this.JSON_pkg.children['h1.sl-headline'].attributes['font-size'].replace('px','');
        if(this.JSON_pkg.children['h1.sl-headline'].attributes['font-weight']) this.meta.typography.headline_weight = this.JSON_pkg.children['h1.sl-headline'].attributes['font-weight'];
        if(this.JSON_pkg.children['h1.sl-headline'].attributes['font-family']) this.meta.typography.headline_family = this.JSON_pkg.children['h1.sl-headline'].attributes['font-family'];
        if(this.JSON_pkg.children['h1.sl-headline'].attributes['line-height']) this.meta.typography.headline_height = this.JSON_pkg.children['h1.sl-headline'].attributes['line-height'].replace('%','');        
        if(this.JSON_pkg.children['h1.sl-headline'].attributes['letter-spacing']) this.meta.typography.headline_spacing = this.JSON_pkg.children['h1.sl-headline'].attributes['letter-spacing'].replace('px','');
        if(this.JSON_pkg.children['h1.sl-headline'].attributes['color']) this.meta.typography.headline_color = this.JSON_pkg.children['h1.sl-headline'].attributes['color'];

        if(this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-size']) this.meta.typography.subtitle_size = this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-size'].replace('px','');
        if(this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-weight']) this.meta.typography.subtitle_weight = this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-weight'];
        if(this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-family']) this.meta.typography.subtitle_family = this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-family'];
        if(this.JSON_pkg.children['h3.sl-subtitle'].attributes['line-height']) this.meta.typography.subtitle_height = this.JSON_pkg.children['h3.sl-subtitle'].attributes['line-height'].replace('%','');        
        if(this.JSON_pkg.children['h3.sl-subtitle'].attributes['letter-spacing']) this.meta.typography.subtitle_spacing = this.JSON_pkg.children['h3.sl-subtitle'].attributes['letter-spacing'].replace('px','');
        if(this.JSON_pkg.children['h3.sl-subtitle'].attributes['color']) this.meta.typography.subtitle_color = this.JSON_pkg.children['h3.sl-subtitle'].attributes['color'];
      
        // Link border
        if(this.JSON_pkg.children["a div.sl-item.nc-link"].attributes.border && this.JSON_pkg.children["a div.sl-item.nc-link"].attributes.border != 'none' && this.JSON_pkg.children["a div.sl-item.nc-link"].attributes.border.split(' ').length > 2) {
          let border = this.JSON_pkg.children["a div.sl-item.nc-link"].attributes.border.split(' ');
          // Avatar border style
          this.meta.link_styles.border_type = border[0];
          // Avatar border width
          this.meta.link_styles.border_width = border[1].split('px')[0];
          // Avatar border color
          this.meta.link_styles.border_color = border[2];
        } else if(this.JSON_pkg.children["a div.sl-item.nc-link"].attributes.border == 'none') {
          this.meta.link_styles.border_type = 'none';
        }

        // Link box-shadow
        if(this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['box-shadow']) this.meta.link_styles.box_shadow = this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['box-shadow'];
        
        // Link border radius
        if(this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['border-radius']) this.meta.link_styles.border_radius = this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['border-radius'].replace('px','');

        // Link background
        if(this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background']) {
          if(this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'].indexOf('linear-gradient') > -1) {
            // Is linear gradient
            this.meta.link_styles.background_type = 'gradient';
            let gradient = this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'].replace('linear-gradient(','').replace(')','').split(',');
            if(gradient.length == 3) {
              this.meta.link_styles.background_gradient_direction = gradient[0];
              this.meta.link_styles.background_gradient_start = gradient[1];
              this.meta.link_styles.background_gradient_end = gradient[2];
            } else {
              delete this.JSON_pkg.children['a div.sl-item.nc-link']?.attributes['background'];
            }
          } else if(this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'].indexOf('url') > -1) {
            // Is image
            this.meta.link_styles.background_type = 'image';
            this.meta.link_styles.background_image = this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'].replace('url(','').replace(')','');
            // Image size
            if(this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-size']) this.meta.link_styles.background_size = this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-size'];
            // Image position
            if(this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-position']) this.meta.link_styles.background_position = this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-position'];
            // Image repeat
            if(this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-repeat']) this.meta.link_styles.background_repeat = this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-repeat'];
          } else {
            // Is solid color
            this.meta.link_styles.background_type = 'solid';
            this.meta.link_styles.background_color = this.JSON_pkg.children['body'].attributes['background'];
          }
        }

        // Link Typography
        if(this.JSON_pkg.children['span.sl-label'].attributes['font-size']) this.meta.link_styles.headline_size = this.JSON_pkg.children['span.sl-label'].attributes['font-size'].replace('px','');
        if(this.JSON_pkg.children['span.sl-label'].attributes['font-weight']) this.meta.link_styles.headline_weight = this.JSON_pkg.children['span.sl-label'].attributes['font-weight'];
        if(this.JSON_pkg.children['span.sl-label'].attributes['font-family']) this.meta.link_styles.headline_family = this.JSON_pkg.children['span.sl-label'].attributes['font-family'];
        if(this.JSON_pkg.children['span.sl-label'].attributes['line-height']) this.meta.link_styles.headline_height = this.JSON_pkg.children['span.sl-label'].attributes['line-height'].replace('%','');        
        if(this.JSON_pkg.children['span.sl-label'].attributes['letter-spacing']) this.meta.link_styles.headline_spacing = this.JSON_pkg.children['span.sl-label'].attributes['letter-spacing'].replace('px','');
        if(this.JSON_pkg.children['span.sl-label'].attributes['color']) this.meta.link_styles.headline_color = this.JSON_pkg.children['span.sl-label'].attributes['color'];

        if(this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-size']) this.meta.link_styles.subtitle_size = this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-size'].replace('px','');
        if(this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-weight']) this.meta.link_styles.subtitle_weight = this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-weight'];
        if(this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-family']) this.meta.link_styles.subtitle_family = this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-family'];
        if(this.JSON_pkg.children['span.sl-link-subtitle'].attributes['line-height']) this.meta.link_styles.subtitle_height = this.JSON_pkg.children['span.sl-link-subtitle'].attributes['line-height'].replace('%','');        
        if(this.JSON_pkg.children['span.sl-link-subtitle'].attributes['letter-spacing']) this.meta.link_styles.subtitle_spacing = this.JSON_pkg.children['span.sl-link-subtitle'].attributes['letter-spacing'].replace('px','');
        if(this.JSON_pkg.children['span.sl-link-subtitle'].attributes['color']) this.meta.link_styles.subtitle_color = this.JSON_pkg.children['span.sl-link-subtitle'].attributes['color'];
      
        // Link styles
        if(this.JSON_pkg.children['a div.sl-item.nc-link']) {}

        // Page styles, section
        if(this.JSON_pkg.children['div#user-profile-view section']) {
            if(this.JSON_pkg.children['div#user-profile-view section'].attributes['max-width']) this.meta.page_styles.max_width = this.JSON_pkg.children['div#user-profile-view section'].attributes['max-width'].replace('px','');
            if(this.JSON_pkg.children['div#user-profile-view section'].attributes['padding']) this.meta.page_styles.padding = this.JSON_pkg.children['div#user-profile-view section'].attributes['padding'].replace('px','');
        }

      // End imported CSS
      }
    },
    watch: {
      meta: {
        handler() {
          console.log('Changes');
          // Page Styles
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
          // Background type
          if(this.meta.page_styles.background_type) {
            switch(this.meta.page_styles.background_type) {
              case 'solid':
                if(this.meta.page_styles.background_color) this.JSON_pkg.children['body'].attributes['background'] = this.meta.page_styles.background_color;
                break;
              case 'image':
                if(this.meta.page_styles.background_image) this.JSON_pkg.children['body'].attributes['background'] = 'url(' + this.meta.page_styles.background_image + ')';
                // Background size
                if(this.meta.page_styles.background_size) this.JSON_pkg.children['body'].attributes['background-size'] = this.meta.page_styles.background_size;
                // Background position
                if(this.meta.page_styles.background_position) this.JSON_pkg.children['body'].attributes['background-position'] = this.meta.page_styles.background_position;
                // Background repeat
                if(this.meta.page_styles.background_repeat) this.JSON_pkg.children['body'].attributes['background-repeat'] = this.meta.page_styles.background_repeat;
                break;
              case 'gradient':
                if(this.meta.page_styles.background_gradient_start && this.meta.page_styles.background_gradient_end && this.meta.page_styles.background_gradient_direction) this.JSON_pkg.children['body'].attributes['background'] = 'linear-gradient(' + this.meta.page_styles.background_gradient_direction + ',' + this.meta.page_styles.background_gradient_start + ',' + this.meta.page_styles.background_gradient_end + ')';
                break;
              case 'none':
                delete this.JSON_pkg.children['body'].attributes['background'];
                break;
            }
            if(this.meta.page_styles.background_type != 'none') {
              this.JSON_pkg.children["div.sl-bg"].attributes.background='transparent !important';
            } else {
              delete this.JSON_pkg.children["div.sl-bg"].attributes.background;
            }
          } else {
            delete this.JSON_pkg.children["body"]?.attributes?.background;
          }

          if(this.meta.page_styles.max_width) {
            this.JSON_pkg.children['div#user-profile-view section'].attributes['max-width'] = this.meta.page_styles.max_width + 'px';
          } else {
            delete this.JSON_pkg.children['div#user-profile-view section']?.attributes['max-width'];
          }

          if(this.meta.page_styles.padding) {
            this.JSON_pkg.children['div#user-profile-view section'].attributes['padding'] = this.meta.page_styles.padding + 'px';
          } else {
            delete this.JSON_pkg.children['div#user-profile-view section']?.attributes['padding'];
          }

          // Typography
          if(this.meta.typography.headline_size) {
            this.JSON_pkg.children['h1.sl-headline'].attributes['font-size'] = this.meta.typography.headline_size + 'px';
          } else {
            delete this.JSON_pkg.children['h1.sl-headline'].attributes['font-size']
          }
          if(this.meta.typography.headline_weight) {
            this.JSON_pkg.children['h1.sl-headline'].attributes['font-weight'] = this.meta.typography.headline_weight;
          } else {
            delete this.JSON_pkg.children['h1.sl-headline'].attributes['font-weight'];
          }
          if(this.meta.typography.headline_family) {
            this.JSON_pkg.children['h1.sl-headline'].attributes['font-family'] = this.meta.typography.headline_family;
          } else {
            delete this.JSON_pkg.children['h1.sl-headline'].attributes['font-family'];
          }
          if(this.meta.typography.headline_spacing) {
            this.JSON_pkg.children['h1.sl-headline'].attributes['letter-spacing'] = this.meta.typography.headline_spacing + 'px';
          } else {
            delete this.JSON_pkg.children['h1.sl-headline'].attributes['letter-spacing'];
          }
          if(this.meta.typography.headline_height) {
            this.JSON_pkg.children['h1.sl-headline'].attributes['line-height'] = this.meta.typography.headline_height + '%';
          } else {
            delete this.JSON_pkg.children['h1.sl-headline'].attributes['line-height']
          }
          if(this.meta.typography.headline_color) {
            this.JSON_pkg.children['h1.sl-headline'].attributes['color'] = this.meta.typography.headline_color;
          } else {
            delete this.JSON_pkg.children['h1.sl-headline'].attributes['color'];
          }
          
          // Subtitle
          if(this.meta.typography.subtitle_size) {
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-size'] = this.meta.typography.subtitle_size + 'px';
          } else {
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-size']
          }
          if(this.meta.typography.subtitle_weight) {
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-weight'] = this.meta.typography.subtitle_weight;
          } else {
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-weight'];
          }
          if(this.meta.typography.subtitle_family) {
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-family'] = this.meta.typography.subtitle_family;
          } else {
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['font-family'];
          }
          if(this.meta.typography.subtitle_spacing) {
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['letter-spacing'] = this.meta.typography.subtitle_spacing + 'px';
          } else {
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['letter-spacing'];
          }
          if(this.meta.typography.subtitle_height) {
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['line-height'] = this.meta.typography.subtitle_height + '%';
          } else {
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['line-height']
          }
          if(this.meta.typography.subtitle_color) {
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['color'] = this.meta.typography.subtitle_color;
            this.JSON_pkg.children['h3.sl-subtitle'].attributes['opacity'] = 1;
          } else {
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['color'];
            delete this.JSON_pkg.children['h3.sl-subtitle'].attributes['opacity'];
          }

          // Link styles

          // Link border
          if(this.meta.link_styles.border_type != 'none' && this.meta.link_styles.border_color && this.meta.link_styles.border_width) {
            this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['border'] = this.meta.link_styles.border_type + ' ' + this.meta.link_styles.border_width + 'px ' + this.meta.link_styles.border_color;
          } else if(this.meta.link_styles.border_type == 'none') {
            this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['border'] = 'none'
          }
          // Link box-shadow
          if(this.meta.link_styles.box_shadow) this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['box-shadow'] = this.meta.link_styles.box_shadow;
          // Link border-radius
          if(this.meta.link_styles.border_radius) {
            this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['border-radius'] = this.meta.link_styles.border_radius + 'px';
          } else {
            delete this.JSON_pkg.children["a div.sl-item.nc-link"]?.attributes['border-radius'];
          }
          // Link background
          if(this.meta.link_styles.background_type) {
            switch(this.meta.link_styles.background_type) {
              case 'solid':
                if(this.meta.link_styles.background_color) this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'] = this.meta.link_styles.background_color;
                break;
              case 'image':
                if(this.meta.link_styles.background_image) this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'] = 'url(' + this.meta.link_styles.background_image + ')';
                // Background size
                if(this.meta.link_styles.background_size) this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-size'] = this.meta.link_styles.background_size;
                // Background position
                if(this.meta.link_styles.background_position) this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-position'] = this.meta.link_styles.background_position;
                // Background repeat
                if(this.meta.link_styles.background_repeat) this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background-repeat'] = this.meta.link_styles.background_repeat;
                break;
              case 'gradient':
                if(this.meta.link_styles.background_gradient_start && this.meta.link_styles.background_gradient_end && this.meta.link_styles.background_gradient_direction) this.JSON_pkg.children['a div.sl-item.nc-link'].attributes['background'] = 'linear-gradient(' + this.meta.link_styles.background_gradient_direction + ',' + this.meta.link_styles.background_gradient_start + ',' + this.meta.link_styles.background_gradient_end + ')';
                break;
              case 'none':
                delete this.JSON_pkg.children['a div.sl-item.nc-link']?.attributes['background'];
                break;
            }
          } else {
            delete this.JSON_pkg.children["a div.sl-item.nc-link"]?.attributes?.background;
          }
          // Link padding
          console.log(this.JSON_pkg.children);
          if(this.meta.link_styles.padding) {
            this.JSON_pkg.children["a div.sl-item.nc-link"].attributes['padding'] = this.meta.link_styles.padding + 'px';
          } else {
            delete this.JSON_pkg.children["a div.sl-item.nc-link"]?.attributes['padding'];
          }
          // Link typography
          if(this.meta.link_styles.headline_size) {
            this.JSON_pkg.children['span.sl-label'].attributes['font-size'] = this.meta.link_styles.headline_size + 'px';
          } else {
            delete this.JSON_pkg.children['span.sl-label']?.attributes['font-size']
          }
          if(this.meta.link_styles.headline_weight) {
            this.JSON_pkg.children['span.sl-label'].attributes['font-weight'] = this.meta.link_styles.headline_weight;
          } else {
            delete this.JSON_pkg.children['span.sl-label']?.attributes['font-weight'];
          }
          if(this.meta.link_styles.headline_family) {
            this.JSON_pkg.children['span.sl-label'].attributes['font-family'] = this.meta.link_styles.headline_family;
          } else {
            delete this.JSON_pkg.children['span.sl-label']?.attributes['font-family'];
          }
          if(this.meta.link_styles.headline_spacing) {
            this.JSON_pkg.children['span.sl-label'].attributes['letter-spacing'] = this.meta.link_styles.headline_spacing + 'px';
          } else {
            delete this.JSON_pkg.children['span.sl-label']?.attributes['letter-spacing'];
          }
          if(this.meta.link_styles.headline_height) {
            this.JSON_pkg.children['span.sl-label'].attributes['line-height'] = this.meta.link_styles.headline_height + '%';
          } else {
            delete this.JSON_pkg.children['span.sl-label']?.attributes['line-height']
          }
          if(this.meta.link_styles.headline_color) {
            this.JSON_pkg.children['span.sl-label'].attributes['color'] = this.meta.link_styles.headline_color;
          } else {
            delete this.JSON_pkg.children['span.sl-label']?.attributes['color'];
          }
          
          // Subtitle
          if(this.meta.link_styles.subtitle_size) {
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-size'] = this.meta.link_styles.subtitle_size + 'px';
          } else {
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-size']
          }
          if(this.meta.link_styles.subtitle_weight) {
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-weight'] = this.meta.link_styles.subtitle_weight;
          } else {
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-weight'];
          }
          if(this.meta.link_styles.subtitle_family) {
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-family'] = this.meta.link_styles.subtitle_family;
          } else {
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['font-family'];
          }
          if(this.meta.link_styles.subtitle_spacing) {
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['letter-spacing'] = this.meta.link_styles.subtitle_spacing + 'px';
          } else {
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['letter-spacing'];
          }
          if(this.meta.link_styles.subtitle_height) {
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['line-height'] = this.meta.link_styles.subtitle_height + '%';
          } else {
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['line-height']
          }
          if(this.meta.link_styles.subtitle_color) {
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['color'] = this.meta.link_styles.subtitle_color;
            this.JSON_pkg.children['span.sl-link-subtitle'].attributes['opacity'] = 1;
          } else {
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['color'];
            delete this.JSON_pkg.children['span.sl-link-subtitle'].attributes['opacity'];
          }

          return this.$emit('input', this.$transform.toCSS(this.JSON_pkg));
        },
        deep: true
      }
    }

}
</script>