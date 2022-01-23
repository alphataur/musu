<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  async function gtfo(){
    let res = await fetch('http://localhost:3001/api/random', { mode: "cors" });
    let json = await res.json()
    console.log(json)
    if(json.success){
      //goto("http://localhost:3000/");
      goto(`http://localhost:3000/play/${json.id}`);
      console.log("its a success now gonna party")
    }
    else{
      goto("http://localhost:3000/");
      console.log("it has failed now gonna home")
    }
  }
  $: if(browser){
    gtfo()
  }
</script>