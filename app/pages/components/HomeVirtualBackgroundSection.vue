<template>
  <section class="home-virtual-section" aria-labelledby="home-virtual-title">
    <div class="home-virtual-inner">
      <span class="home-virtual-eyebrow" data-reveal>虚拟相机</span>

      <h2 id="home-virtual-title" class="home-virtual-title" data-reveal style="--reveal-delay: 80ms">
        <span>把手机变成虚拟相机</span>
        <span>即插即用</span>
      </h2>

      <p class="home-virtual-subtitle" data-reveal style="--reveal-delay: 160ms">
        <span>支持 iPhone 和安卓端通过 USB 或无线方式连接到 Windows 电脑。</span>
        <span>将手机变成你的 PC 摄像头</span>
      </p>

      <div class="home-virtual-media" data-reveal="scale" style="--reveal-delay: 240ms">
        <div class="home-virtual-frame">
          <video
            class="home-virtual-video"
            :src="virtualVideoSrc"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            aria-label="手机连接电脑作为虚拟相机演示"
          />
        </div>

        <div class="home-virtual-reflection" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<script setup>
const virtualVideoSrc = '/videos/home-hero.mp4'
</script>

<style>
.home-virtual-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 0;
  color: var(--theme-text);
  background-color: var(--theme-page);
}

.home-virtual-inner {
  position: relative;
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: var(--page-padding-x);
  padding-right: var(--page-padding-x);
}

.home-virtual-eyebrow {
  min-width: 66px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid rgba(59, 130, 246, 0.34);
  border-radius: 999px;
  color: rgba(99, 179, 255, 1);
  background-color: rgba(30, 64, 175, 0.22);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.home-virtual-title {
  margin-top: 18px;
  color: rgba(255, 255, 255, 1);
  font-size: 40px;
  font-weight: 900;
  line-height: 48px;
  text-align: center;
}

.home-virtual-title span {
  display: block;
}

.home-virtual-title span:last-child {
  color: rgba(20, 198, 239, 1);
}

.home-virtual-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: rgba(149, 156, 168, 1);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}

.home-virtual-media {
  position: relative;
  width: min(100%, 887px);
  margin-top: 72px;
}

.home-virtual-frame {
  position: relative;
  z-index: 2;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 887 / 582;
  background: url("~/assets/images/Layer.png") center / 100% 100% no-repeat;
}

.home-virtual-video {
  position: absolute;
  left: 2.8%;
  top: 4.2%;
  width: 94.4%;
  height: 91.6%;
  object-fit: cover;
  border-radius: 22px;
  background-color: rgba(15, 23, 42, 1);
}

.home-virtual-reflection {
  position: relative;
  z-index: 1;
  width: 100%;
  aspect-ratio: 887 / 385;
  margin: 0 auto;
  background: url("~/assets/images/layer2.png") center top / 100% 100% no-repeat;
}

@media (max-width: 768px) {

  .home-virtual-section {
    padding-top: 56px;
  }

  .home-virtual-title {
    font-size: 28px;
    line-height: 36px;
  }

  .home-virtual-subtitle {
    font-size: 11px;
  }

  .home-virtual-subtitle span {
    display: inline;
  }

  .home-virtual-media {
    width: min(100%, 520px);
    margin-top: 44px;
  }

  .home-virtual-video {
    border-radius: 14px;
  }

}
</style>
