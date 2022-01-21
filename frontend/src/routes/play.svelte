<p class="text-9xl h-screen"> Hello there </p>
<script>
  import { requestQS } from "../utils/porter.js";

  async function main(){
    let json = await requestQS("http://localhost:3001/api/")
  }
</script>