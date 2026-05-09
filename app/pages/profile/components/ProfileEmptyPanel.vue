<template>
  <section class="profile-content" :aria-label="title">
    <section class="profile-panel profile-empty-panel">
      <header class="profile-panel-heading">
        <span>
          <Icon :name="icon" aria-hidden="true" />
        </span>
        <h2>{{ title }}</h2>
      </header>

      <div class="profile-empty-state">
        <p>暂无内容</p>
      </div>
    </section>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
})
</script>
