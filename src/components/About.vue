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

    <div class="profile-panel">
      <div class="profile-panel__heading">
        <h1 class="profile-panel__name">Alinouski Aliaksei</h1>
      </div>
      <img class="profile-panel__photo" src="../assets/images/me/myPhoto.jpg" alt="Alinouski Aliaksei">
      <div v-if="skills.length" class="profile-panel__meta">
        <span v-for="skill in skills" :key="skill">{{ skill }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../firebase/firebaseConfig'

export default {
  data: function () {
    return {
      settings: {
        description: 'I build compact, colorful games and tools with Unity, C# and web technologies.',
        skills: ['Unity3D', 'C# .NET', 'Spring Java']
      },
      defaultDescription: 'I build compact, colorful games and tools with Unity, C# and web technologies.',
      defaultSkills: ['Unity3D', 'C# .NET', 'Spring Java']
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
    }
  },
  methods: {
    hasText: function (value) {
      return typeof value === 'string' && value.trim() !== ''
    }
  }
}
</script>
