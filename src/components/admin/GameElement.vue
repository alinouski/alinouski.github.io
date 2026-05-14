<template>
  <div
    class="admin-list-item"
    :class="{
      'admin-list-item--dragging': isDragging,
      'admin-list-item--drag-over': isDragOver
    }"
    @dragover.prevent="$emit('drag-over')"
    @dragenter.prevent="$emit('drag-over')"
    @drop.prevent="$emit('drop-game')"
  >
    <button
      class="admin-drag-handle"
      type="button"
      draggable="true"
      aria-label="Drag to change game order"
      title="Drag to change game order"
      @dragstart="$emit('drag-start', $event)"
      @dragend="$emit('drag-end')"
    >
      <span aria-hidden="true">::::</span>
    </button>

    <img
      class="admin-list-item__preview"
      :src="thumbnailUrl"
      :alt="game.name + ' preview'"
      loading="lazy"
      decoding="async"
      @error="setFallbackPreview"
    >

    <router-link class="admin-list-item__main" :to="{ name: 'admin.game.edit', params: { id: game['.key'] }}">
      <span class="admin-list-item__title">{{ game.name }}</span>
      <span class="admin-list-item__meta">Order {{ orderLabel }} · {{ game['.key'] }}</span>
    </router-link>

    <div class="admin-list-item__controls">
      <label class="switch" @click.stop>
        <input type="checkbox" v-model="game.hosted">
        <span></span>
      </label>
    </div>
  </div>
</template>

<script>
const fallbackIcon = require('../../assets/logo.png')
const localAssets = require.context('../../assets', true, /^\.\/(?!(?:images\/SocialNetworks\/(?:telegram\.svg|vk\.png)$)).*\.(png|jpe?g|gif|svg)$/)

export default {
  props: {
    game: Object,
    isDragging: Boolean,
    isDragOver: Boolean
  },
  computed: {
    orderLabel: function () {
      return Number.isFinite(Number(this.game.order)) ? Number(this.game.order) : 'unset'
    },
    thumbnailUrl: function () {
      return this.imageUrl(this.game.icon || this.game.featcher || this.game.screen1)
    }
  },
  methods: {
    hasText: function (value) {
      return typeof value === 'string' && value.trim() !== ''
    },
    imageUrl: function (value) {
      if (!this.hasText(value)) {
        return fallbackIcon
      }

      const url = value.trim()
      if (/^(https?:|data:|blob:|\/dist\/|\/)/.test(url)) {
        return url
      }

      const cleanUrl = url
        .replace(/^\.?\//, '')
        .replace(/^src\/assets\//, './')
        .replace(/^@\/assets\//, './')
        .replace(/^\.\.\/assets\//, './')

      try {
        return localAssets(cleanUrl)
      } catch (error) {
        return url
      }
    },
    setFallbackPreview: function (event) {
      event.target.src = fallbackIcon
    }
  }
}
</script>
