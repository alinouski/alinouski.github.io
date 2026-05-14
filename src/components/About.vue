<template>
  <section class="hero" id="about">
    <div class="hero__sections">
      <article class="hero-section">
        <p class="eyebrow">About</p>
        <p v-if="hasText(profileDescription)">{{ profileDescription }}</p>
      </article>

      <article class="hero-section">
        <p class="eyebrow">Contacts</p>
        <div class="hero__actions">
          <a class="hero__contact" target="_blank" rel="noopener noreferrer" href="mailto:alinouski@gmail.com">Mail</a>
        </div>
      </article>
    </div>

    <div class="profile-cluster">
      <div class="profile-stat-stack">
        <div class="profile-stat-panel">
          <strong>{{ gamesCount }}</strong>
          <span>Games</span>
        </div>

        <div class="profile-stat-panel">
          <strong class="profile-stat-panel__period">
            <span>{{ experience.years }}y</span>
            <span>{{ experience.months }}m</span>
          </strong>
          <span>Experience</span>
        </div>
      </div>

      <div class="profile-panel">
        <div class="profile-panel__heading">
          <h1 class="profile-panel__name">Alinouski Aliaksei</h1>
        </div>
        <img class="profile-panel__photo" src="../assets/images/me/myPhoto.jpg" alt="Alinouski Aliaksei">
        <div v-if="skills.length" class="profile-panel__meta">
          <span v-for="skill in skills" :key="skill">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../firebase/firebaseConfig'

export default {
  props: {
    gamesCount: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      settings: {
        description: 'I build compact, colorful games and tools with Unity, C# and web technologies.',
        skills: ['Unity3D', 'C# .NET', 'Spring Java'],
        experienceStartDate: ''
      },
      defaultDescription: 'I build compact, colorful games and tools with Unity, C# and web technologies.',
      defaultSkills: ['Unity3D', 'C# .NET', 'Spring Java'],
      now: new Date()
    }
  },
  firestore: function () {
    return {
      settings: db.collection('settings').doc('profile')
    }
  },
  computed: {
    profileDescription: function () {
      if (this.settings && typeof this.settings.description !== 'undefined') {
        return this.settings.description
      }

      return this.defaultDescription
    },
    skills: function () {
      if (this.settings && Array.isArray(this.settings.skills)) {
        return this.settings.skills.filter(this.hasText)
      }

      return this.defaultSkills
    },
    experience: function () {
      const startDate = this.parseDate(this.settings && this.settings.experienceStartDate)

      if (!startDate) {
        return {
          years: 0,
          months: 0
        }
      }

      return this.getDateDifference(startDate, this.now)
    }
  },
  methods: {
    hasText: function (value) {
      return typeof value === 'string' && value.trim() !== ''
    },
    parseDate: function (value) {
      if (typeof value !== 'string' || value.trim() === '') {
        return null
      }

      const parts = value.split('-').map(Number)

      if (parts.length !== 3 || parts.some(isNaN)) {
        return null
      }

      const date = new Date(parts[0], parts[1] - 1, parts[2])

      if (isNaN(date.getTime())) {
        return null
      }

      return date
    },
    getDateDifference: function (startDate, endDate) {
      if (startDate > endDate) {
        return {
          years: 0,
          months: 0
        }
      }

      let months = (endDate.getFullYear() - startDate.getFullYear()) * 12
      months += endDate.getMonth() - startDate.getMonth()

      if (endDate.getDate() < startDate.getDate()) {
        months -= 1
      }

      months = Math.max(months, 0)

      return {
        years: Math.floor(months / 12),
        months: months % 12
      }
    }
  }
}
</script>
