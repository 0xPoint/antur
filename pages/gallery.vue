<template>
  <section class="section page-top gallery" aria-labelledby="gallery-page-title">
    <div class="container">
      <p class="eyebrow">Свежие фото</p>
      <h1 id="gallery-page-title">Фото из морских выходов</h1>
      <p class="page-lead">Сейчас галерея питается локальными данными. Для MVP здесь будет подключение к API свежих фото, модерация и генерация оптимизированных изображений.</p>
      <div class="gallery-list">
        <article v-for="photo in tourPhotos" :key="photo.id" class="photo-card">
          <img :src="assetPath(photo.src)" width="900" height="900" loading="lazy" :alt="photo.alt">
          <div>
            <strong>{{ photo.route }}</strong>
            <time :datetime="photo.date">{{ formatDate(photo.date) }}</time>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { tourPhotos } from '~/data/social-proof'

const assetPath = useAssetPath()

useAnturSeo({
  title: 'Фото морских прогулок и рыбалки на Камчатке | Антур',
  description: 'Свежие фото из морских прогулок, рыбалки и крабового сафари на Камчатке.',
  path: '/gallery'
})

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
</script>
