<template>
  <div>
    <section class="admin-page" id="content">
      <div class="admin-page__header">
        <div>
          <p class="eyebrow">Game editor</p>
          <h1>{{ game.name || 'New game' }}</h1>
        </div>

        <div class="admin-actions">
          <button class="admin-button" @click="save">Save</button>
          <button v-if="id" class="admin-button admin-button--danger" @click="del">Delete</button>
        </div>
      </div>

      <div class="google-play-import">
        <div>
          <span>Google Play import</span>
          <small v-if="importStatus">{{ importStatus }}</small>
          <small v-else>Paste a Google Play link and copy app details into this form.</small>
        </div>
        <label class="field">
          <span>Google Play link</span>
          <input type="text" v-model="googlePlayImportUrl" placeholder="https://play.google.com/store/apps/details?id=...">
        </label>
        <button
          class="admin-button"
          type="button"
          :disabled="isImportingGooglePlay"
          @click="importFromGooglePlay"
        >
          {{ isImportingGooglePlay ? 'Copying...' : 'Copy from Google Play' }}
        </button>
      </div>

      <div class="admin-form">
        <label class="field">
          <span>App name</span>
          <input type="text" v-model="game.name" placeholder="Name">
        </label>

        <label class="field field--wide">
          <span>Description</span>
          <textarea v-model="game.description" placeholder="Short game description"></textarea>
        </label>

        <label class="field">
          <span>Google Play</span>
          <input type="text" v-model="game.gpUrl" placeholder="Google Play URL">
        </label>

        <label class="field-toggle">
          <span>Google Play link active</span>
          <span class="switch">
            <input type="checkbox" v-model="googlePlayLinkEnabled">
            <span></span>
          </span>
        </label>

        <label class="field">
          <span>App Store</span>
          <input type="text" v-model="game.appStoreUrl" placeholder="App Store URL">
        </label>

        <label class="field-toggle">
          <span>App Store link active</span>
          <span class="switch">
            <input type="checkbox" v-model="appStoreLinkEnabled">
            <span></span>
          </span>
        </label>

        <label class="field field--wide">
          <span>Video</span>
          <input type="text" v-model="game.video" placeholder="YouTube embed URL">
        </label>

        <FileUploader class="field field--with-upload" v-on:url="updateIcon">
          <span>Icon</span>
          <input type="text" v-model="game.icon" placeholder="Icon URL or local asset path">
        </FileUploader>

        <FileUploader class="field field--with-upload" v-on:url="updateFeatcher">
          <span>Feature image</span>
          <input type="text" v-model="game.featcher" placeholder="Feature image URL">
        </FileUploader>

        <div class="field field--wide screenshot-editor">
          <div class="screenshot-editor__header">
            <div>
              <span>Screenshots</span>
              <small>{{ editableScreenshots.length }} total</small>
            </div>
            <button class="admin-button admin-button--secondary" type="button" @click="addEmptyScreenshot">Add URL</button>
          </div>

          <FileUploader class="field--with-upload screenshot-editor__upload" v-on:url="addScreenshot">
            <span>Upload screenshots</span>
          </FileUploader>

          <div class="screenshot-editor__list">
            <div
              v-for="(screen, index) in editableScreenshots"
              :key="index"
              class="screenshot-editor__item"
            >
              <span class="screenshot-editor__index">{{ index + 1 }}</span>
              <input
                type="text"
                :value="screen"
                placeholder="Screenshot URL"
                @input="updateScreenshot(index, $event.target.value)"
              >
              <button
                class="admin-icon-button"
                type="button"
                title="Move screenshot up"
                :disabled="index === 0"
                @click="moveScreenshot(index, index - 1)"
              >
                Up
              </button>
              <button
                class="admin-icon-button"
                type="button"
                title="Move screenshot down"
                :disabled="index === editableScreenshots.length - 1"
                @click="moveScreenshot(index, index + 1)"
              >
                Down
              </button>
              <button
                class="admin-icon-button admin-icon-button--danger"
                type="button"
                title="Remove screenshot"
                @click="removeScreenshot(index)"
              >
                x
              </button>
            </div>
          </div>
        </div>

        <label class="field-toggle">
          <span>Hosted on site</span>
          <span class="switch">
            <input type="checkbox" v-model="game.hosted">
            <span></span>
          </span>
        </label>
      </div>
    </section>

    <Game :game="game"/>
  </div>
</template>

<script>
import { db } from '../../firebase/firebaseConfig'
import Game from '../Game'
import FileUploader from '../utils/FileUploader'

export default {
    components:{
        Game: Game,
        FileUploader: FileUploader
    },
    data: function () {
        return {
            game: {
                icon: '',
                name: '',
                description: '',
                gpUrlEnabled: true,
                appStoreUrlEnabled: true,
                screenshots: []
            },
            googlePlayImportUrl: '',
            isImportingGooglePlay: false,
            importStatus: ''
        }
    },
    props: {
        'id': String
    },
    firestore(){
      return {
        game: db.collection('games').doc(this.id)
      }
    },
    computed: {
        googlePlayLinkEnabled: {
            get: function(){
                return this.game.gpUrlEnabled !== false
            },
            set: function(value){
                this.$set(this.game, 'gpUrlEnabled', value)
            }
        },
        appStoreLinkEnabled: {
            get: function(){
                return this.game.appStoreUrlEnabled !== false
            },
            set: function(value){
                this.$set(this.game, 'appStoreUrlEnabled', value)
            }
        },
        editableScreenshots: function(){
            return Array.isArray(this.game.screenshots) ? this.game.screenshots : []
        }
    },
    watch: {
        game: {
            handler: function(){
                this.ensureScreenshots()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        hasText: function(value){
            return typeof value === 'string' && value.trim() !== ''
        },
        getGooglePlayAppId: function(value){
            if (!this.hasText(value)) {
                return ''
            }

            const cleanValue = value.trim()
            try {
                const parsedUrl = new URL(cleanValue)
                return parsedUrl.searchParams.get('id') || ''
            } catch (error) {
                const match = cleanValue.match(/(?:id=|details\?id=)([A-Za-z0-9._]+)/)
                return match ? match[1] : ''
            }
        },
        googlePlayDetailsUrl: function(value){
            const appId = this.getGooglePlayAppId(value)
            if (!appId) {
                return ''
            }

            return 'https://play.google.com/store/apps/details?id=' + encodeURIComponent(appId) + '&hl=en_US&gl=US'
        },
        importFromGooglePlay: function(){
            const detailsUrl = this.googlePlayDetailsUrl(this.googlePlayImportUrl || this.game.gpUrl)
            if (!detailsUrl) {
                alert('Paste a valid Google Play link first.')
                return
            }

            const shouldCopy = confirm('Copy game name, trailer, feature image, description and screenshots from Google Play? Current form values may be overwritten.')
            if (!shouldCopy) {
                return
            }

            this.isImportingGooglePlay = true
            this.importStatus = 'Loading Google Play data...'
            this.fetchGooglePlayData(detailsUrl)
                .then(importedGame => {
                    this.applyGooglePlayData(detailsUrl, importedGame)
                    this.importStatus = 'Copied from Google Play.'
                    alert('Google Play data copied into the form.')
                })
                .catch(error => {
                    console.error(error)
                    this.importStatus = 'Import failed. Check the link or try again later.'
                    alert('Could not copy data from Google Play. The page may be blocked or unavailable.')
                })
                .then(() => {
                    this.isImportingGooglePlay = false
                })
        },
        fetchGooglePlayData: function(detailsUrl){
            const sources = [
                'https://api.allorigins.win/raw?url=' + encodeURIComponent(detailsUrl),
                'https://api.allorigins.win/get?url=' + encodeURIComponent(detailsUrl),
                'https://r.jina.ai/http://r.jina.ai/http://' + detailsUrl
            ]

            return sources.reduce((promise, source) => {
                return promise.catch(() => {
                    return this.fetchText(source).then(text => {
                        const normalizedText = this.unwrapProxyResponse(text)
                        const importedGame = this.parseGooglePlayPage(normalizedText)
                        if (!this.hasImportedGooglePlayData(importedGame)) {
                            throw new Error('No Google Play data found')
                        }
                        return importedGame
                    })
                })
            }, Promise.reject(new Error('No source tried')))
        },
        fetchText: function(url){
            const timeout = new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Google Play import timeout')), 18000)
            })

            return Promise.race([
                fetch(url).then(response => {
                    if (!response.ok) {
                        throw new Error('Google Play import failed with status ' + response.status)
                    }
                    return response.text()
                }),
                timeout
            ])
        },
        unwrapProxyResponse: function(text){
            try {
                const parsed = JSON.parse(text)
                return parsed.contents || parsed.content || text
            } catch (error) {
                return text
            }
        },
        hasImportedGooglePlayData: function(data){
            return this.hasText(data.name) ||
                this.hasText(data.description) ||
                this.hasText(data.video) ||
                this.hasText(data.featcher) ||
                data.screenshots.length > 0
        },
        parseGooglePlayPage: function(text){
            const unescapedText = this.decodeGooglePlayText(text)
            const imageGroups = this.extractGooglePlayImageGroups(unescapedText)
            const video = this.extractGooglePlayVideo(unescapedText)
            const metaImage = this.extractMetaContent(unescapedText, 'og:image')
            const name = this.extractGooglePlayName(unescapedText)
            const description = this.extractGooglePlayDescription(unescapedText)
            const icon = imageGroups.icons[0] || metaImage
            const featureImage = this.pickFeatureImage(imageGroups.screenshots, icon)
            const screenshots = this.pickScreenshotImages(imageGroups.screenshots, featureImage, icon)

            return {
                name: name,
                description: description,
                video: video,
                featcher: featureImage,
                icon: icon,
                screenshots: screenshots
            }
        },
        decodeGooglePlayText: function(text){
            return text
                .replace(/\\u003d/g, '=')
                .replace(/\\u0026/g, '&')
                .replace(/\\u003c/g, '<')
                .replace(/\\u003e/g, '>')
                .replace(/\\"/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
        },
        extractMetaContent: function(text, property){
            const escapedProperty = property.replace(':', '\\:')
            const patterns = [
                new RegExp("<meta[^>]+property=[\"']" + escapedProperty + "[\"'][^>]+content=[\"']([^\"']+)[\"']", 'i'),
                new RegExp("<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']" + escapedProperty + "[\"']", 'i'),
                new RegExp("<meta[^>]+name=[\"']" + escapedProperty + "[\"'][^>]+content=[\"']([^\"']+)[\"']", 'i')
            ]
            for (let index = 0; index < patterns.length; index++) {
                const match = text.match(patterns[index])
                if (match && this.hasText(match[1])) {
                    return this.cleanImportedText(match[1])
                }
            }
            return ''
        },
        extractGooglePlayName: function(text){
            const metaTitle = this.extractMetaContent(text, 'og:title')
            if (this.hasText(metaTitle)) {
                return metaTitle.replace(/\s*-\s*Apps on Google Play\s*$/i, '').trim()
            }

            const titleMatch = text.match(/(?:^|\n)Title:\s*(.+)/i) || text.match(/<title>([^<]+)<\/title>/i)
            return titleMatch ? this.cleanImportedText(titleMatch[1]).replace(/\s*-\s*Apps on Google Play\s*$/i, '').trim() : ''
        },
        extractGooglePlayDescription: function(text){
            const aboutDescription = this.extractSectionText(
                text,
                ['About this game', 'About this app'],
                ['Updated on', 'Available on', 'Data safety', 'Ratings and reviews', 'What\'s new', 'App support']
            )
            if (this.hasText(aboutDescription)) {
                return aboutDescription
            }

            const jsonDescription = this.extractJsonStringValue(text, ['description', 'shortDescription'])
            if (this.hasText(jsonDescription)) {
                return this.cleanImportedText(jsonDescription)
            }

            const metaDescription = this.extractMetaContent(text, 'og:description') || this.extractMetaContent(text, 'description')
            return this.hasText(metaDescription) ? metaDescription : ''
        },
        extractGooglePlayVideo: function(text){
            const youtubeMatch = text.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
            if (youtubeMatch) {
                return 'https://www.youtube.com/embed/' + youtubeMatch[1]
            }

            const videoIdMatch = text.match(/"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/)
            return videoIdMatch ? 'https://www.youtube.com/embed/' + videoIdMatch[1] : ''
        },
        extractGooglePlayImageGroups: function(text){
            const groups = {
                all: [],
                icons: [],
                screenshots: []
            }
            const seen = {
                all: {},
                icons: {},
                screenshots: {}
            }

            const addImage = (groupName, value) => {
                const cleanValue = this.cleanGoogleImageUrl(value)
                if (this.hasText(cleanValue) && !seen[groupName][cleanValue]) {
                    seen[groupName][cleanValue] = true
                    groups[groupName].push(cleanValue)
                }
            }

            const imgPattern = /<img\b[^>]*>/gi
            let imgMatch = imgPattern.exec(text)
            while (imgMatch) {
                const tag = imgMatch[0]
                const altText = this.extractAttribute(tag, 'alt').toLowerCase()
                const imageUrl = this.extractGoogleImageFromTag(tag)
                if (this.hasText(imageUrl)) {
                    addImage('all', imageUrl)
                    if (altText.indexOf('screenshot') !== -1) {
                        addImage('screenshots', imageUrl)
                    } else if (altText.indexOf('icon') !== -1) {
                        addImage('icons', imageUrl)
                    }
                }
                imgMatch = imgPattern.exec(text)
            }

            const markdownPattern = /!\[([^\]]*)\]\((https:\/\/play-lh\.googleusercontent\.com\/[^)]+)\)/g
            let markdownMatch = markdownPattern.exec(text)
            while (markdownMatch) {
                const altText = markdownMatch[1].toLowerCase()
                const imageUrl = markdownMatch[2]
                addImage('all', imageUrl)
                if (altText.indexOf('screenshot') !== -1) {
                    addImage('screenshots', imageUrl)
                } else if (altText.indexOf('icon') !== -1) {
                    addImage('icons', imageUrl)
                }
                markdownMatch = markdownPattern.exec(text)
            }

            const patterns = [
                /https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+/g,
                /!\[[^\]]*\]\((https:\/\/play-lh\.googleusercontent\.com\/[^)]+)\)/g
            ]

            patterns.forEach(pattern => {
                let match = pattern.exec(text)
                while (match) {
                    addImage('all', match[1] || match[0])
                    match = pattern.exec(text)
                }
            })

            if (groups.screenshots.length === 0) {
                groups.all
                    .filter(this.isLikelyScreenshotImage)
                    .forEach(image => addImage('screenshots', image))
            }
            if (groups.icons.length === 0) {
                groups.all
                    .filter(this.isLikelyIconImage)
                    .forEach(image => addImage('icons', image))
            }

            return groups
        },
        extractAttribute: function(tag, attributeName){
            const match = tag.match(new RegExp(attributeName + "\\s*=\\s*([\"'])(.*?)\\1", 'i'))
            return match ? this.cleanImportedText(match[2]) : ''
        },
        extractGoogleImageFromTag: function(tag){
            const source = this.extractAttribute(tag, 'srcset') ||
                this.extractAttribute(tag, 'data-src') ||
                this.extractAttribute(tag, 'src')
            if (!this.hasText(source)) {
                return ''
            }

            const match = source.match(/https:\/\/play-lh\.googleusercontent\.com\/[^\s,]+/)
            return match ? match[0] : ''
        },
        cleanGoogleImageUrl: function(value){
            return value
                .replace(/\\u003d/g, '=')
                .replace(/\\u0026/g, '&')
                .replace(/&amp;/g, '&')
                .replace(/[\\",)'<>\]]+$/g, '')
                .trim()
        },
        isLikelyScreenshotImage: function(image){
            return /=w[2-9][0-9]{2,3}-h[2-9][0-9]{2,3}/.test(image) ||
                /=h[2-9][0-9]{2,3}-rw/.test(image) ||
                /=w[2-9][0-9]{2,3}-rw/.test(image)
        },
        isLikelyIconImage: function(image){
            return /=s(128|180|192|256|512)-rw/.test(image) ||
                /=w(128|180|192|256|512)-h(128|180|192|256|512)/.test(image)
        },
        pickFeatureImage: function(images, iconImage){
            const wideImage = images.find(image => image !== iconImage && /=w[7-9][0-9]{2,3}-h[3-6][0-9]{2}/.test(image))
            return wideImage || images.find(image => image !== iconImage) || ''
        },
        pickScreenshotImages: function(images, featureImage, iconImage){
            return images
                .filter(image => image !== featureImage)
                .filter(image => image !== iconImage)
                .filter(image => !/=s(48|64|96|128|180|192|256|512)-rw/.test(image))
                .filter(this.isLikelyScreenshotImage)
                .slice(0, 10)
        },
        extractSectionText: function(text, startLabels, endLabels){
            const lowerText = text.toLowerCase()
            const startIndexes = startLabels
                .map(label => lowerText.indexOf(label.toLowerCase()))
                .filter(index => index !== -1)
            if (startIndexes.length === 0) {
                return ''
            }

            const startIndex = Math.min.apply(null, startIndexes)
            const textAfterStart = text.slice(startIndex)
            const startLineEnd = textAfterStart.indexOf('\n')
            const bodyStart = startLineEnd === -1 ? 0 : startLineEnd + 1
            const body = textAfterStart.slice(bodyStart)
            const lowerBody = body.toLowerCase()
            const endIndexes = endLabels
                .map(label => lowerBody.indexOf(label.toLowerCase()))
                .filter(index => index !== -1)
            const endIndex = endIndexes.length ? Math.min.apply(null, endIndexes) : Math.min(body.length, 2200)
            return this.cleanImportedText(body.slice(0, endIndex))
        },
        extractJsonStringValue: function(text, keys){
            for (let index = 0; index < keys.length; index++) {
                const pattern = new RegExp('"' + keys[index] + '"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"', 'i')
                const match = text.match(pattern)
                if (match && this.hasText(match[1])) {
                    return this.decodeEscapedString(match[1])
                }
            }
            return ''
        },
        decodeEscapedString: function(value){
            try {
                return JSON.parse('"' + value.replace(/"/g, '\\"') + '"')
            } catch (error) {
                return value
                    .replace(/\\n/g, ' ')
                    .replace(/\\r/g, ' ')
                    .replace(/\\t/g, ' ')
                    .replace(/\\"/g, '"')
            }
        },
        cleanImportedText: function(value){
            if (!this.hasText(value)) {
                return ''
            }

            const textarea = document.createElement('textarea')
            textarea.innerHTML = value
            return textarea.value
                .replace(/<[^>]+>/g, ' ')
                .replace(/^#+\s*/gm, '')
                .replace(/\barrow_forward\b/gi, ' ')
                .replace(/\s+/g, ' ')
                .trim()
        },
        applyGooglePlayData: function(detailsUrl, importedGame){
            this.$set(this.game, 'gpUrl', detailsUrl)
            this.$set(this.game, 'gpUrlEnabled', true)

            if (this.hasText(importedGame.name)) {
                this.$set(this.game, 'name', importedGame.name)
            }
            if (this.hasText(importedGame.description)) {
                this.$set(this.game, 'description', importedGame.description)
            }
            if (this.hasText(importedGame.video)) {
                this.$set(this.game, 'video', importedGame.video)
            }
            if (this.hasText(importedGame.featcher)) {
                this.$set(this.game, 'featcher', importedGame.featcher)
            }
            if (this.hasText(importedGame.icon) && !this.hasText(this.game.icon)) {
                this.$set(this.game, 'icon', importedGame.icon)
            }
            if (importedGame.screenshots.length > 0) {
                this.setScreenshots(importedGame.screenshots)
            }
        },
        legacyScreenshots: function(){
            return [this.game.screen1, this.game.screen2, this.game.screen3].filter(this.hasText)
        },
        ensureScreenshots: function(){
            if (!this.game) {
                return
            }

            const hasScreenshots = Array.isArray(this.game.screenshots)
            const legacyScreenshots = this.legacyScreenshots()

            if (!hasScreenshots || (this.game.screenshots.length === 0 && legacyScreenshots.length > 0)) {
                this.setScreenshots(legacyScreenshots)
            }
        },
        normalizedScreenshots: function(values){
            const seen = {}
            return values
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
        setScreenshots: function(values){
            const screenshots = values.slice()
            this.$set(this.game, 'screenshots', screenshots)
            this.$set(this.game, 'screen1', screenshots[0] || '')
            this.$set(this.game, 'screen2', screenshots[1] || '')
            this.$set(this.game, 'screen3', screenshots[2] || '')
        },
        addScreenshot: function(value){
            const screenshots = this.editableScreenshots.slice()
            screenshots.push(value)
            this.setScreenshots(screenshots)
        },
        addEmptyScreenshot: function(){
            const screenshots = this.editableScreenshots.slice()
            screenshots.push('')
            this.setScreenshots(screenshots)
        },
        updateScreenshot: function(index, value){
            const screenshots = this.editableScreenshots.slice()
            screenshots.splice(index, 1, value)
            this.setScreenshots(screenshots)
        },
        removeScreenshot: function(index){
            const screenshots = this.editableScreenshots.slice()
            screenshots.splice(index, 1)
            this.setScreenshots(screenshots)
        },
        moveScreenshot: function(fromIndex, toIndex){
            if (toIndex < 0 || toIndex >= this.editableScreenshots.length) {
                return
            }

            const screenshots = this.editableScreenshots.slice()
            const movedScreenshot = screenshots.splice(fromIndex, 1)[0]
            screenshots.splice(toIndex, 0, movedScreenshot)
            this.setScreenshots(screenshots)
        },
        normalizedGame: function(){
            const game = Object.assign({}, this.game)
            if (typeof game.description === 'string' && game.description.trim().toLowerCase() === 'empty') {
                game.description = ''
            }
            game.screenshots = this.normalizedScreenshots(this.editableScreenshots)
            game.screen1 = game.screenshots[0] || ''
            game.screen2 = game.screenshots[1] || ''
            game.screen3 = game.screenshots[2] || ''
            game.gpUrlEnabled = game.gpUrlEnabled !== false
            game.appStoreUrlEnabled = game.appStoreUrlEnabled !== false
            return game
        },
        save: function(){
            console.log(this.id);
            const game = this.normalizedGame();
            if(typeof this.id === 'undefined'){
                this.saveNewGameFirst(game);
            }else{
                db.collection('games').doc(this.id).set(game);
            }
        },
        saveNewGameFirst: function(game){
            db.collection('games').get().then(snapshot => {
                const batch = db.batch()
                const games = []

                snapshot.forEach((doc, index) => {
                    const data = doc.data()
                    games.push({
                        ref: doc.ref,
                        order: Number.isFinite(Number(data.order)) ? Number(data.order) : index + 1
                    })
                })

                games
                    .sort((first, second) => first.order - second.order)
                    .forEach((existingGame, index) => {
                        batch.set(existingGame.ref, { order: index + 2 }, { merge: true })
                    })

                const newGameRef = db.collection('games').doc()
                game.order = 1
                batch.set(newGameRef, game)

                return batch.commit().then(() => newGameRef)
            }).then(ref => {
                console.log('Added document with ID: ', ref.id);
                this.id = ref.id;
                alert(game.name+" Game added");
            });
        },
        del: function(){
            if(confirm("Do you really want to delete?")){
                db.collection('games').doc(this.id).delete();
                this.$router.go('admin/games');
            }
        },
        updateIcon: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'icon', value);
        },
        updateFeatcher: function(value){
            this.$forceUpdate();
            this.$set(this.game, 'featcher', value);
        },
        updateScreen1: function(value){
            this.updateScreenshot(0, value);
        },
        updateScreen2: function(value){
            this.updateScreenshot(1, value);
        },
        updateScreen3: function(value){
            this.updateScreenshot(2, value);
        }
    }
}
</script>
