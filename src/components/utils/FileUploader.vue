<template>

  <div>
    <slot></slot>
    <input type="file" multiple accept="image/*" @change="detectFiles($event.target.files)">{{ progressUpload }}%
  </div>

</template>

<script>
import { db } from '../../firebase/firebaseConfig'

let storage = db.app.storage();

export default {
  data: function () {
    return {
      progressUpload: 0,
      file: File,
      uploadTask: '',
      downloadURL: ''
    }
  },
  methods: {
    detectFiles (fileList) {
      Array.from(Array(fileList.length).keys()).map( x => {
        this.upload(fileList[x])
      })
    },
    upload (file) {
      this.uploadTask = storage.ref('images_games/'+file.name).put(file);
      
      this.uploadTask.then(snapshot => {
        
        return snapshot.ref.getDownloadURL()
      })
      .then(downloadURL => {
          console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
          this.downloadURL = downloadURL;
          this.$emit('url', this.downloadURL)
          return downloadURL;
      })
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      })
    }
  }
}
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
</style>
