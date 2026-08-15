<script setup>
import { ref, onMounted, computed } from 'vue'

const releases = ref([])
const loading = ref(true)
const error = ref(null)
const expandedVersion = ref(null) // default: expand latest

const GITHUB_API = 'https://api.github.com/repos/bobocha214/everlink/releases'
const GITEE_BASE = 'https://gitee.com/zhiyu_214/ever-link/releases/download'

// Architecture metadata
const archInfo = {
  'arm64-v8a': { label: 'arm64-v8a', desc: '现代 64 位手机 / 平板', recommended: true },
  'armeabi-v7a': { label: 'armeabi-v7a', desc: '老旧 32 位设备', recommended: false },
  'x86_64': { label: 'x86_64', desc: 'x86 模拟器 / Intel 平板', recommended: false },
}

function getArch(fileName) {
  if (fileName.includes('arm64-v8a')) return 'arm64-v8a'
  if (fileName.includes('armeabi-v7a')) return 'armeabi-v7a'
  if (fileName.includes('x86_64')) return 'x86_64'
  return null
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Parse assets from a release, group by architecture
function parseAssets(release) {
  const apks = (release.assets || [])
    .map(a => ({
      ...a,
      arch: getArch(a.name),
    }))
    .filter(a => a.arch !== null)
    .sort((a, b) => {
      const order = ['arm64-v8a', 'armeabi-v7a', 'x86_64']
      return order.indexOf(a.arch) - order.indexOf(b.arch)
    })
  return apks
}

// Build Gitee download URL for the same asset
function giteeUrl(tag, fileName) {
  return `${GITEE_BASE}/${tag}/${fileName}`
}

async function fetchReleases() {
  loading.value = true
  error.value = null
  try {
    const resp = await fetch(GITHUB_API)
    if (!resp.ok) {
      if (resp.status === 403) throw new Error('GitHub API 速率限制，请稍后再试')
      throw new Error(`HTTP ${resp.status}`)
    }
    const data = await resp.json()
    releases.value = data.filter(r => !r.draft)
    if (releases.value.length > 0) {
      expandedVersion.value = releases.value[0].tag_name
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function toggleVersion(tag) {
  expandedVersion.value = expandedVersion.value === tag ? null : tag
}

onMounted(fetchReleases)
</script>

<template>
  <div class="release-downloads">
    <!-- Loading -->
    <div v-if="loading" class="rd-loading">
      <div class="rd-spinner"></div>
      <span>正在获取最新版本信息…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rd-error">
      <p class="rd-error-title">⚠️ 无法从 GitHub 获取版本信息</p>
      <p class="rd-error-msg">{{ error }}</p>
      <p class="rd-error-fallback">
        请直接前往发布页下载：<br>
        <a href="https://github.com/bobocha214/everlink/releases" target="_blank" rel="noopener">GitHub Releases</a>
        ｜
        <a href="https://gitee.com/zhiyu_214/ever-link/releases" target="_blank" rel="noopener">Gitee Releases</a>
      </p>
    </div>

    <!-- Release list -->
    <div v-else-if="releases.length > 0" class="rd-list">
      <div
        v-for="(release, idx) in releases"
        :key="release.id"
        class="rd-release"
        :class="{ 'rd-release--expanded': expandedVersion === release.tag_name }"
      >
        <!-- Header (clickable) -->
        <button
          class="rd-release-header"
          @click="toggleVersion(release.tag_name)"
        >
          <div class="rd-release-info">
            <span class="rd-release-tag">v{{ release.tag_name }}</span>
            <span v-if="idx === 0" class="rd-release-badge">最新</span>
            <span v-if="release.prerelease" class="rd-release-badge rd-release-badge--pre">预发布</span>
            <span class="rd-release-date">{{ formatDate(release.published_at) }}</span>
          </div>
          <svg
            class="rd-chevron"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <!-- Body (expandable) -->
        <div v-show="expandedVersion === release.tag_name" class="rd-release-body">
          <!-- Release notes -->
          <div v-if="release.body" class="rd-release-notes">
            {{ release.body }}
          </div>

          <!-- Download buttons -->
          <div class="rd-downloads">
            <div class="rd-downloads-label">选择适合你设备 CPU 架构的 APK 下载：</div>
            <div class="rd-arch-grid">
              <div
                v-for="asset in parseAssets(release)"
                :key="asset.id"
                class="rd-arch-card"
                :class="{ 'rd-arch-card--recommended': archInfo[asset.arch]?.recommended }"
              >
                <div class="rd-arch-card-header">
                  <span class="rd-arch-name">{{ archInfo[asset.arch]?.label || asset.arch }}</span>
                  <span v-if="archInfo[asset.arch]?.recommended" class="rd-arch-rec">推荐</span>
                </div>
                <div class="rd-arch-desc">{{ archInfo[asset.arch]?.desc || asset.name }}</div>
                <div class="rd-arch-size">{{ formatSize(asset.size) }}</div>
                <div class="rd-arch-links">
                  <a
                    :href="asset.browser_download_url"
                    class="rd-download-btn rd-download-btn--github"
                    target="_blank"
                    rel="noopener"
                  >
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                    GitHub
                  </a>
                  <a
                    :href="giteeUrl(release.tag_name, asset.name)"
                    class="rd-download-btn rd-download-btn--gitee"
                    target="_blank"
                    rel="noopener"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.984 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.016 0zm6.09 5.333c.328.108.603.302.823.582.22.28.335.605.347.976.012.371-.078.704-.27 1.005-.192.301-.453.527-.784.679-.331.152-.681.21-1.05.171a1.74 1.74 0 01-.96-.439 1.673 1.673 0 01-.539-.929 1.659 1.659 0 01.098-1.04c.098-.226.24-.421.427-.585.187-.164.404-.284.65-.36.246-.076.502-.095.768-.057.266.038.51.124.733.258.224.134.41.31.56.527.15.217.244.458.283.723.039.265.022.528-.052.79z"/></svg>
                    Gitee
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="rd-empty">
      暂无已发布的版本。
    </div>

    <!-- Refresh -->
    <button v-if="!loading" class="rd-refresh" @click="fetchReleases">
      ↻ 刷新版本列表
    </button>
  </div>
</template>

<style scoped>
.release-downloads {
  margin: 24px 0;
}

/* Loading */
.rd-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.rd-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: rd-spin 0.8s linear infinite;
}

@keyframes rd-spin {
  to { transform: rotate(360deg); }
}

/* Error */
.rd-error {
  padding: 20px 24px;
  border-radius: 12px;
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-1);
}

.rd-error-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-danger-1);
}

.rd-error-msg {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}

.rd-error-fallback {
  font-size: 14px;
}

.rd-error-fallback a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

/* Release list */
.rd-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rd-release {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.rd-release--expanded {
  border-color: var(--vp-c-brand-1);
}

/* Header */
.rd-release-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border: none;
  cursor: pointer;
  font: inherit;
  color: var(--vp-c-text-1);
  transition: background 0.2s;
}

.rd-release-header:hover {
  background: var(--vp-c-bg-soft-up, var(--vp-c-bg-soft));
}

.rd-release-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.rd-release-tag {
  font-weight: 700;
  font-size: 16px;
  color: var(--vp-c-brand-1);
}

.rd-release-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.rd-release-badge--pre {
  background: var(--vp-c-warning-soft, rgba(234, 179, 8, 0.14));
  color: var(--vp-c-warning-1, #eab308);
}

.rd-release-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.rd-chevron {
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.rd-release--expanded .rd-chevron {
  transform: rotate(180deg);
}

/* Body */
.rd-release-body {
  padding: 20px;
}

.rd-release-notes {
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  line-height: 1.6;
}

/* Downloads */
.rd-downloads-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 14px;
}

.rd-arch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.rd-arch-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 16px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.rd-arch-card:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 4px 12px -4px rgba(0, 137, 123, 0.15);
}

.rd-arch-card--recommended {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.rd-arch-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rd-arch-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--vp-c-text-1);
}

.rd-arch-rec {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
}

.rd-arch-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}

.rd-arch-size {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 12px;
}

.rd-arch-links {
  display: flex;
  gap: 8px;
}

.rd-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.15s;
}

.rd-download-btn:active {
  transform: scale(0.97);
}

.rd-download-btn--github {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.rd-download-btn--github:hover {
  opacity: 0.9;
}

.rd-download-btn--gitee {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.rd-download-btn--gitee:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

/* Refresh */
.rd-refresh {
  margin-top: 16px;
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.rd-refresh:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* Empty */
.rd-empty {
  padding: 32px;
  text-align: center;
  color: var(--vp-c-text-3);
}

/* Mobile */
@media (max-width: 640px) {
  .rd-arch-grid {
    grid-template-columns: 1fr;
  }
  .rd-release-header {
    padding: 14px 16px;
  }
  .rd-release-body {
    padding: 16px;
  }
}
</style>
