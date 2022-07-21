<script lang="ts">
  const GET_LOGIN_URL = "https://localhost/oauth/get_login_url";

  async function login() {
    const response = await fetch(GET_LOGIN_URL);
    const body = (await response.body.getReader().read()).value;
    const url = body.toString();
    window.location.replace(url);
  }
</script>

<button on:click={login}>Login with 42 OAuth</button>
