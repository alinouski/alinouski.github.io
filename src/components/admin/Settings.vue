<template>
  <section class="admin-page" id="content">
    <div class="admin-page__header">
      <div>
        <p class="eyebrow">Site settings</p>
        <h1>Profile</h1>
      </div>

      <button class="admin-button" @click="save">Save</button>
    </div>

    <div class="admin-form">
      <label class="field field--wide">
        <span>Profile description</span>
        <textarea v-model="settings.description" placeholder="Short profile description"></textarea>
      </label>

      <label class="field">
        <span>Experience start date</span>
        <input type="date" v-model="settings.experienceStartDate">
      </label>

      <label class="field field--wide">
        <span>Skills</span>
        <textarea
          v-model="skillsText"
          placeholder="One skill per line"
          @focus="isEditingSkills = true"
          @blur="isEditingSkills = false"
        ></textarea>
      </label>
    </div>
  </section>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'

const settingsRef = db.collection('settings').doc('profile')

export default {
  data: function () {
    return {
      settings: {
        description: 'I build compact, colorful games and tools with Unity, C# and web technologies.',
        skills: ['Unity3D', 'C# .NET', 'Spring Java'],
        experienceStartDate: ''
      },
      skillsText: 'Unity3D\nC# .NET\nSpring Java',
      isEditingSkills: false
    }
  },
  firestore: function () {
    return {
      settings: settingsRef
    }
  },
  watch: {
    'settings.skills': {
      immediate: true,
      handler: function (skills) {
        if (!this.isEditingSkills) {
          this.skillsText = this.normalizedSkills(skills).join('\n')
        }
      }
    }
  },
  methods: {
    normalizedSkills: function (skills) {
      if (Array.isArray(skills)) {
        return skills.map(item => String(item).trim()).filter(Boolean)
      }

      if (typeof skills === 'string') {
        return this.parseSkills(skills)
      }

      return []
    },
    parseSkills: function (value) {
      return String(value || '')
        .split(/\r?\n|,/)
        .map(item => item.trim())
        .filter(Boolean)
    },
    save: function () {
      const skills = this.parseSkills(this.skillsText)
      this.$set(this.settings, 'skills', skills)

      settingsRef.set({
        description: this.settings.description || '',
        skills: skills,
        experienceStartDate: this.settings.experienceStartDate || ''
      }, { merge: true }).then(() => {
        alert('Profile settings saved')
      })
    }
  }
}
</script>
