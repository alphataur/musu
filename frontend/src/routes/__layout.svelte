<div class="h-screen flex flex-col">
  <Navbar></Navbar>
  <slot></slot>
  <Footer></Footer>
</div>
<script>
  import Navbar from '../lib/navbar.svelte'
  import Footer from '../lib/footer.svelte'
</script>
