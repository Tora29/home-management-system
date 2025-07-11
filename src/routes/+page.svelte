<script lang="ts">
  import { onMount } from 'svelte';
  import { apiGet } from '$shared/api/fetch';
  import { INFO_MESSAGES } from '$shared/constants/messages';
  import type { User } from '$shared/api/types';
  
  let users = $state<User[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    const response = await apiGet<User[]>('/api/users');
    
    if (response.success) {
      users = response.data || [];
    } else {
      error = response.error;
    }
    
    loading = false;
  });
</script>

<div class="container">
  <h1>ユーザー一覧</h1>
  
  {#if loading}
    <p>{INFO_MESSAGES.LOADING_DATA}</p>
  {:else if error}
    <p class="error">エラー: {error}</p>
  {:else if users.length === 0}
    <p>{INFO_MESSAGES.NO_USERS}</p>
  {:else}
    <div class="users-grid">
      {#each users as user}
        <div class="user-card">
          <h3>{user.name || 'Unknown'}</h3>
          <p>{user.email}</p>
          <small>作成日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}</small>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    color: #333;
    margin-bottom: 2rem;
  }
  
  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .user-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f9f9f9;
  }
  
  .user-card h3 {
    margin: 0 0 0.5rem 0;
    color: #555;
  }
  
  .user-card p {
    margin: 0 0 0.5rem 0;
    color: #666;
  }
  
  .user-card small {
    color: #888;
  }
  
  .error {
    color: red;
    font-weight: bold;
  }
</style>
