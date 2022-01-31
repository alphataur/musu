<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import { page } from '$app/stores'
//import { getAllContexts } from 'svelte';
//import { get_root_for_style } from 'svelte/internal';

  async function gtfo(){
    if(true){
      let url = "http://localhost:3001/api/random"
      let res = await fetch(url)
      let json = await res.json()
      if(json.success){
        goto(`http://localhost:3000/play/${json.id}`)
      }
      else{
        goto("http://localhost:3000")
      }
    }
    //console.log("alive and kicking")
    //let query = new URLSearchParams(window.location.search)
    //let mode = query.get("mode") || "random"
    ////let id = query.get("id") || "1c00b6eb0693f7ab82d835f0c098316f5d032a3ccd23272db04c59708d63ed8a"
    
    //console.log(query.get("offset"), query.get("pname"))
    //let offset = query.get("offset") || 0
    //let pname = query.get("pname") || "all"
    
    //if(offset === 0 && pname === "all"){
    //  console.log("loading random")
    //  
    //}
    //else{
    //  let url = `http://localhost:3001/api/playlist/next?id=${id}&pname=${pname}`
    //  let res = await fetch(url)
    //  let json = await res.json()
    //  if(json.success){
    //    console.log(json)
    //    goto(`http://localhost:3000/play/${json.id}?pname=${pname}`)
    //  }
    //  else{
    //    goto("http://localhost:3000")
    //  }
    //}
  }
  //http://localhost:3000/play?id=aae01c0b3d3dcf66c6174db0cb61f9325c763adae8b2a0c1a61b6a5a79a7711e?pname=all
  $: if(browser){
    gtfo()
  }
</script>