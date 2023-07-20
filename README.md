# music-player

[![vue](https://img.shields.io/badge/vue-2.6.14-green)](https://github.com/vuejs/vue)

## 概述

此專案使用Vue和原生JavaScript所構成，主要在音樂與歌詞之間做同步處理。

## 安裝

1.克隆此專案到本地

```
git clone https://github.com/Ben0614/music-player.git
```

2.進入專案目錄

```
cd music-player
```

3.安裝相依套件

```
yarn install
```

4.運行

```
yarn dev
```

## 使用指南

這裡將簡單介紹主要功能與使用。

### 標註當前歌詞

播放音樂後，目前正在播放的歌詞會使用不同的顏色進行標註，以便輕鬆跟上音樂。

### 點擊歌詞跳轉

點擊歌詞中的任意一句，音樂將會跳轉到對應的歌詞並繼續播放。

### 重複播放歌詞

在每句歌詞旁邊皆有**三角形**和**正方形**的按鍵，點三角形將會重複播放該句歌詞；如果要取消重複播放就點擊正方形。

### 繪製聲音長條圖

音樂播放時，背景會出現一片聲音長條圖，這是使用AudioContext獲取的數據進行繪製，以可視化音樂的聲音強度。
