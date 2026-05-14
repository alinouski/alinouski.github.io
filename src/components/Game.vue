<template>
  <section class="game-card" id="content">
    <div class="game-card__aside">
      <img
        class="game-card__icon"
        :src="lazyImageUrl(game.icon)"
        :alt="game.name + ' icon'"
        loading="lazy"
        decoding="async"
      >

      <div class="store-links">
        <a
          v-if="isGooglePlayAvailable"
          class="store-links__item"
          target="_blank"
          rel="noopener noreferrer"
          :href="game.gpUrl"
          aria-label="Open on Google Play"
        >
          <img
            alt="Get it on Google Play"
            :src="lazyExternalImage('https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png')"
            loading="lazy"
            decoding="async"
          >
        </a>
        <img
          v-else
          class="store-links__item store-links__item--disabled"
          alt="Google Play is not available"
          :src="lazyExternalImage('https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png')"
          loading="lazy"
          decoding="async"
        >

        <a
          v-if="isAppStoreAvailable"
          class="store-links__item"
          target="_blank"
          rel="noopener noreferrer"
          :href="game.appStoreUrl"
          aria-label="Open on the App Store"
        >
          <img
            alt="Download on the App Store"
            :src="lazyExternalImage(appStoreBadge)"
            loading="lazy"
            decoding="async"
          >
        </a>
        <img
          v-else
          class="store-links__item store-links__item--disabled"
          alt="App Store is not available"
          :src="lazyExternalImage(appStoreBadge)"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>

    <div class="game-card__body">
      <div class="game-card__header">
        <h1>{{ game.name }}</h1>
        <p v-if="hasDescription" class="game-card__description">
          <span>{{ visibleDescription }}</span>
          <button
            v-if="isDescriptionLong && !isDescriptionExpanded"
            class="game-card__description-more"
            type="button"
            aria-label="Show full description"
            @click="expandDescription"
          >...</button>
        </p>
      </div>

      <div v-if="hasHeroMedia" class="game-card__media">
        <iframe
          v-if="hasText(game.video)"
          class="video"
          :src="game.video"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <img
          v-else
          class="game-card__feature"
          :src="lazyImageUrl(game.featcher)"
          :alt="game.name + ' preview'"
          loading="lazy"
          decoding="async"
        >
      </div>

      <div
        v-if="screenshots.length"
        class="screenshots"
        :class="{
          'screenshots--compact': hasHeroMedia,
          'screenshots--carousel': hasScreenshotCarousel
        }"
      >
        <button
          v-for="(screen, index) in screenshots"
          :key="screen + index"
          class="screenshots__button"
          type="button"
          :aria-label="'Open ' + game.name + ' screenshot ' + (index + 1)"
          @click="openScreenshot(screen, index)"
        >
          <img
            data-enlargable
            class="screenshots__item img-enlargable"
            :src="lazyImageUrl(screen)"
            :alt="game.name + ' screenshot ' + (index + 1)"
            loading="lazy"
            decoding="async"
          >
        </button>
      </div>
    </div>

    <div
      v-if="activeScreenshot"
      class="image-viewer"
      role="dialog"
      aria-modal="true"
      :aria-label="activeScreenshot.alt"
      @click.self="closeScreenshot"
    >
      <button
        class="image-viewer__close"
        type="button"
        aria-label="Close screenshot preview"
        @click="closeScreenshot"
      >
        x
      </button>
      <button
        v-if="canBrowseScreenshots"
        class="image-viewer__nav image-viewer__nav--prev"
        type="button"
        aria-label="Previous screenshot"
        @click.stop="showPreviousScreenshot"
      >
        <
      </button>
      <img
        class="image-viewer__image"
        :src="activeScreenshot.url"
        :alt="activeScreenshot.alt"
      >
      <button
        v-if="canBrowseScreenshots"
        class="image-viewer__nav image-viewer__nav--next"
        type="button"
        aria-label="Next screenshot"
        @click.stop="showNextScreenshot"
      >
        >
      </button>
      <div v-if="canBrowseScreenshots" class="image-viewer__counter">
        {{ activeScreenshotIndex + 1 }} / {{ screenshots.length }}
      </div>
    </div>
  </section>
</template>

<script>
const appStoreBadge = require('../assets/app-store-badge.png')
const fallbackIcon = require('../assets/logo.png')
const localAssets = require.context('../assets', true, /^\.\/(?!(?:images\/SocialNetworks\/(?:telegram\.svg|vk\.png)$)).*\.(png|jpe?g|gif|svg)$/)
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
const descriptionPreviewLength = 520

export default {
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      appStoreBadge,
      mediaObserver: null,
      shouldLoadMedia: false,
      activeScreenshotIndex: null,
      isDescriptionExpanded: false
    }
  },
  computed: {
    hasDescription: function () {
      return this.hasRealText(this.game.description)
    },
    descriptionText: function () {
      return this.hasDescription ? this.game.description.trim() : ''
    },
    isDescriptionLong: function () {
      return this.descriptionText.length > descriptionPreviewLength
    },
    visibleDescription: function () {
      if (!this.isDescriptionLong || this.isDescriptionExpanded) {
        return this.descriptionText
      }

      return this.descriptionText.slice(0, descriptionPreviewLength).trim()
    },
    hasHeroMedia: function () {
      return this.hasText(this.game.video) || this.hasText(this.game.featcher)
    },
    isGooglePlayAvailable: function () {
      return this.hasText(this.game.gpUrl) && this.isLinkEnabled(this.game.gpUrlEnabled)
    },
    isAppStoreAvailable: function () {
      return this.hasText(this.game.appStoreUrl) && this.isLinkEnabled(this.game.appStoreUrlEnabled)
    },
    screenshots: function () {
      const legacyScreenshots = [this.game.screen1, this.game.screen2, this.game.screen3]
      const storedScreenshots = Array.isArray(this.game.screenshots) ? this.game.screenshots : []
      const seen = {}

      return legacyScreenshots.concat(storedScreenshots)
        .filter(this.hasText)
        .map(value => value.trim())
        .filter(value => {
          if (seen[value]) {
            return false
          }
          seen[value] = true
          return true
        })
    },
    hasScreenshotCarousel: function () {
      return this.screenshots.length > 3
    },
    canBrowseScreenshots: function () {
      return this.screenshots.length > 1
    },
    activeScreenshot: function () {
      if (this.activeScreenshotIndex === null || !this.screenshots[this.activeScreenshotIndex]) {
        return null
      }

      return {
        url: this.imageUrl(this.screenshots[this.activeScreenshotIndex]),
        alt: this.game.name + ' screenshot ' + (this.activeScreenshotIndex + 1)
      }
    }
  },
  mounted: function () {
    this.observeMedia()
  },
  beforeDestroy: function () {
    this.stopObservingMedia()
    window.removeEventListener('keydown', this.handleKeydown)
    this.closeScreenshot()
  },
  watch: {
    'game.description': function () {
      this.isDescriptionExpanded = false
    }
  },
  methods: {
    hasText: function (value) {
      return typeof value === 'string' && value.trim() !== ''
    },
    hasRealText: function (value) {
      return this.hasText(value) && value.trim().toLowerCase() !== 'empty'
    },
    isLinkEnabled: function (value) {
      return value !== false
    },
    expandDescription: function () {
      this.isDescriptionExpanded = true
    },
    observeMedia: function () {
      if (!('IntersectionObserver' in window)) {
        this.shouldLoadMedia = true
        return
      }

      this.mediaObserver = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.shouldLoadMedia = true
          this.stopObservingMedia()
        }
      }, {
        rootMargin: '520px 0px',
        threshold: 0.01
      })

      this.mediaObserver.observe(this.$el)
    },
    stopObservingMedia: function () {
      if (this.mediaObserver) {
        this.mediaObserver.disconnect()
        this.mediaObserver = null
      }
    },
    lazyExternalImage: function (value) {
      return this.shouldLoadMedia ? value : transparentPixel
    },
    lazyImageUrl: function (value) {
      return this.shouldLoadMedia ? this.imageUrl(value) : transparentPixel
    },
    openScreenshot: function (screen, index) {
      this.activeScreenshotIndex = index
      document.body.classList.add('is-image-viewer-open')
      window.addEventListener('keydown', this.handleKeydown)
    },
    closeScreenshot: function () {
      this.activeScreenshotIndex = null
      document.body.classList.remove('is-image-viewer-open')
      window.removeEventListener('keydown', this.handleKeydown)
    },
    showPreviousScreenshot: function () {
      if (!this.canBrowseScreenshots) {
        return
      }

      const nextIndex = this.activeScreenshotIndex <= 0
        ? this.screenshots.length - 1
        : this.activeScreenshotIndex - 1
      this.activeScreenshotIndex = nextIndex
    },
    showNextScreenshot: function () {
      if (!this.canBrowseScreenshots) {
        return
      }

      const nextIndex = this.activeScreenshotIndex >= this.screenshots.length - 1
        ? 0
        : this.activeScreenshotIndex + 1
      this.activeScreenshotIndex = nextIndex
    },
    handleKeydown: function (event) {
      if (event.key === 'Escape' && this.activeScreenshot) {
        this.closeScreenshot()
      } else if (event.key === 'ArrowLeft' && this.activeScreenshot) {
        this.showPreviousScreenshot()
      } else if (event.key === 'ArrowRight' && this.activeScreenshot) {
        this.showNextScreenshot()
      }
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
    }
  }
}
</script>
