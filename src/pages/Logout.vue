<script>
  import firebase from 'firebase';
  export default {
    created() {
        firebase.auth().signOut().then(() => {
                this.$router.replace('/')
            })
    }
  }
</script>